import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import styles from './CandidateManagement.module.scss';
import classNames from 'classnames/bind';
import trans__candidateManagement from '../../../../component/Translation/CandidateManagement';
import { AuthContext } from '../../../../context/AuthContext';

const cx = classNames.bind(styles);

const normalizeText = (value = '') =>
  value
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

const isTechMajor = (major = '', careerGoal = '', position = '') => {
  const techKeywords = [
    'phan mem', 'khoa hoc may tinh', 'he thong thong tin',
    'computer science', 'data science', 'ai', 'software', 'cntt',
    'cong nghe thong tin', 'ky thuat may tinh', 'information technology',
    'developer', 'engineer', 'frontend', 'backend', 'fullstack',
  ];
  const combined = [major, careerGoal, position].join(' ');
  const normalized = normalizeText(combined);
  return techKeywords.some((keyword) => normalized.includes(keyword));
};

const CRITERIA_DEFINITIONS = [
  {
    key: 'highGpa',
    labelKey: 'criteriaHighGpa',
    matches: (candidate) => candidate.gpa >= 3.5,
  },
  {
    key: 'english',
    labelKey: 'criteriaEnglish',
    matches: (candidate) => candidate.englishScore >= 80,
  },
  {
    key: 'recentGraduate',
    labelKey: 'criteriaRecentGraduate',
    matches: (candidate) => Number(candidate.graduation_year) >= 2024,
  },
  {
    key: 'techMajor',
    labelKey: 'criteriaTechMajor',
    matches: (candidate) => isTechMajor(candidate.major, candidate.career_goal, candidate.latestJobTitle),
  },
];

const ORDERED_CRITERIA_KEYS = CRITERIA_DEFINITIONS.map((criterion) => criterion.key);

const getOutstandingScore = (candidate) => {
  if (candidate.match_score > 0) {
    return Math.round(candidate.match_score);
  }

  let score = candidate.gpa * 20 + candidate.englishScore * 0.7;

  if (candidate.gpa >= 3.7) {
    score += 6;
  }

  if (candidate.englishScore >= 85) {
    score += 6;
  }

  if (Number(candidate.graduation_year) >= 2024) {
    score += 4;
  }

  if (isTechMajor(candidate.major)) {
    score += 4;
  }

  return Math.round(score);
};

function CandidateManagement({ language = 'vi' }) {
  const [query, setQuery] = useState('');
  const [selectedMajor, setSelectedMajor] = useState('all');
  const [selectedCriteria, setSelectedCriteria] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [compareCandidate, setCompareCandidate] = useState(null);
  const { api, user } = useContext(AuthContext);

  const t = trans__candidateManagement[language] || trans__candidateManagement.vi;

  const fetchCandidates = useCallback(async () => {
    if (!user) {
      setCandidates([]);
      setError(t.authRequired);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await api.get('applications/employer-candidates');
      setCandidates(response.data?.candidates || []);
    } catch (fetchError) {
      console.error('Error fetching employer candidates:', fetchError);
      setCandidates([]);
      setError(
        `${t.loadError}: ${fetchError.response?.data?.message || fetchError.message || 'Unknown error'
        }`,
      );
    } finally {
      setLoading(false);
    }
  }, [api, t.authRequired, t.loadError, user]);

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  const criteriaOptions = useMemo(
    () =>
      CRITERIA_DEFINITIONS.map((criterion) => ({
        ...criterion,
        label: t[criterion.labelKey],
      })),
    [t],
  );

  const normalizedCandidates = useMemo(
    () =>
      candidates.map((candidate) => ({
        ...candidate,
        gpa: Number(candidate.gpa) || 0,
        englishScore: Number(candidate.englishScore) || 0,
        match_score: Number(candidate.match_score) || 0,
        englishLabel: candidate.englishLabel || '',
        latestJobTitle: candidate.latestJobTitle || '',
        skills: Array.isArray(candidate.skills) ? candidate.skills : [],
      })),
    [candidates],
  );

  const majors = useMemo(() => {
    const allMajors = normalizedCandidates
      .map((candidate) => candidate.major)
      .filter(Boolean);
    return ['all', ...new Set(allMajors)];
  }, [normalizedCandidates]);

  const filteredBySearch = useMemo(() => {
    const normalizedQuery = normalizeText(query);

    return normalizedCandidates.filter((candidate) => {
      const searchableText = normalizeText(
        [
          candidate.name,
          candidate.email,
          candidate.school,
          candidate.major,
          candidate.address,
          candidate.career_goal,
          candidate.latestJobTitle,
          candidate.skills.map((skill) => skill.name).join(' '),
        ].join(' '),
      );

      const matchesQuery = !normalizedQuery || searchableText.includes(normalizedQuery);
      const matchesMajor = selectedMajor === 'all' || candidate.major === selectedMajor;

      return matchesQuery && matchesMajor;
    });
  }, [normalizedCandidates, query, selectedMajor]);

  const displayedCandidates = useMemo(() => {
    const enrichedCandidates = filteredBySearch.map((candidate) => {
      const matchedCriteriaKeys = CRITERIA_DEFINITIONS.filter((criterion) =>
        criterion.matches(candidate),
      ).map((criterion) => criterion.key);

      return {
        ...candidate,
        matchedCriteriaKeys,
        outstandingScore: getOutstandingScore(candidate),
        selectedCriteriaCount: selectedCriteria.filter((criterionKey) =>
          matchedCriteriaKeys.includes(criterionKey),
        ).length,
      };
    });

    let pool = [];
    if (selectedCriteria.length === 0) {
      pool = enrichedCandidates;
    } else {
      pool = enrichedCandidates.filter((candidate) =>
        selectedCriteria.every((criterionKey) =>
          candidate.matchedCriteriaKeys.includes(criterionKey),
        ),
      );
    }

    // Lấy 3 ứng viên có điểm ưu tiên cao nhất trong danh sách đã lọc lên đầu trang
    const sortedByOutstanding = [...pool].sort((left, right) => right.outstandingScore - left.outstandingScore);
    const top3 = sortedByOutstanding.slice(0, 3).map((c) => ({ ...c, isTop3: true }));
    const top3Ids = new Set(top3.map((c) => c.id));

    const remaining = pool.filter((c) => !top3Ids.has(c.id));

    let sortedRemaining = [];
    if (selectedCriteria.length === 0) {
      sortedRemaining = remaining.sort(
        (left, right) =>
          right.match_score - left.match_score ||
          right.outstandingScore - left.outstandingScore ||
          right.gpa - left.gpa ||
          right.englishScore - left.englishScore ||
          Number(right.graduation_year) - Number(left.graduation_year),
      ).map((c) => ({ ...c, isTop3: false }));
    } else {
      sortedRemaining = remaining.sort(
        (left, right) =>
          right.selectedCriteriaCount - left.selectedCriteriaCount ||
          right.match_score - left.match_score ||
          right.gpa - left.gpa ||
          right.englishScore - left.englishScore ||
          right.outstandingScore - left.outstandingScore,
      ).map((c) => ({ ...c, isTop3: false }));
    }

    return [...top3, ...sortedRemaining];
  }, [filteredBySearch, selectedCriteria]);

  const openSideBySide = (candidate) => {
    setCompareCandidate(candidate);
  };

  const closeCompareModal = () => {
    setCompareCandidate(null);
  };

  const renderCompareModal = () => {
    if (!compareCandidate) return null;

    const raw = compareCandidate.raw_ai_extracted_data || {};
    const form = compareCandidate.verified_cv_data || {};
    const devDetails = compareCandidate.deviation_details || {};
    const warnings = devDetails.warnings || [];
    const addedSkills = devDetails.addedSkills || [];

    const hasDiscrepancy = (field) => {
      if (field === 'skill') {
        return addedSkills.length > 0;
      }
      if (field === 'experience') {
        const rExp = parseInt(raw.experience || '0', 10);
        const fExp = parseInt(form.experience || '0', 10);
        return fExp > rExp;
      }
      if (field === 'gpa') {
        const rGpa = Number(raw.gpa) || 0;
        const fGpa = Number(form.gpa) || 0;
        return fGpa > rGpa;
      }
      if (field === 'level') {
        const levelWeights = { 'intern': 0, 'fresher': 1, 'junior': 2, 'middle': 3, 'mid': 3, 'senior': 4, 'lead': 5, 'manager': 6 };
        const rWeight = levelWeights[normalizeText(raw.level)] !== undefined ? levelWeights[normalizeText(raw.level)] : -1;
        const fWeight = levelWeights[normalizeText(form.level)] !== undefined ? levelWeights[normalizeText(form.level)] : -1;
        return fWeight > rWeight && rWeight >= 0;
      }
      return false;
    };

    const isRedAlert = compareCandidate.deviation_status === 'flagged_red';
    const isYellowAlert = compareCandidate.deviation_status === 'flagged_yellow';
    const isLowDiscrepancy = compareCandidate.deviation_status === 'low';

    const cvSrc = compareCandidate.cv_file_base64 || (compareCandidate.cv_file_path ? `http://localhost:5000/${compareCandidate.cv_file_path.replace(/\\/g, '/')}` : '');

    return (
      <div className={cx('modal-overlay')} onClick={closeCompareModal}>
        <div className={cx('compare-modal')} onClick={(e) => e.stopPropagation()}>
          <header className={cx('compare-header')}>
            <div className={cx('compare-header-title')}>
              <h3>🔍 {language === 'vi' ? 'HỆ THỐNG ĐỐI SOÁT HỒ SƠ SONG SONG (SIDE-BY-SIDE)' : 'SIDE-BY-SIDE CROSS-CHECK SYSTEM'}</h3>
              <p>{language === 'vi' ? `Ứng viên: ${compareCandidate.name}` : `Candidate: ${compareCandidate.name}`}</p>
            </div>
            <button className={cx('close-btn')} onClick={closeCompareModal}>&times;</button>
          </header>

          <div className={cx('compare-container')}>
            {/* Left Panel: Analytics & Comparative Table */}
            <div className={cx('compare-panel-left')}>
              {/* Deviation Warning Alert Banner */}
              {(isRedAlert || isYellowAlert || isLowDiscrepancy) && (
                <div className={cx('warning-banner', {
                  'warning-banner--red': isRedAlert,
                  'warning-banner--yellow': isYellowAlert,
                  'warning-banner--low': isLowDiscrepancy
                })}>
                  <div className={cx('warning-banner-icon')}>
                    {isRedAlert ? '🚨' : isYellowAlert ? '⚠️' : 'ℹ️'}
                  </div>
                  <div className={cx('warning-banner-content')}>
                    <h4>
                      {isRedAlert 
                        ? (language === 'vi' ? 'CẢNH BÁO GIAN LẬN HỒ SƠ (ĐỘ LỆCH NẶNG)' : 'SEVERE DATA INFLATION WARNING')
                        : isYellowAlert 
                          ? (language === 'vi' ? 'PHÁT HIỆN LỆCH DỮ LIỆU ĐÁNG NGỜ' : 'MODERATE DATA DISCREPANCY')
                          : (language === 'vi' ? 'Có sai lệch dữ liệu nhẹ' : 'Minor data discrepancy')}
                    </h4>
                    <ul>
                      {warnings.length > 0 ? (
                        warnings.map((warn, i) => <li key={i}>{warn}</li>)
                      ) : (
                        <li>{language === 'vi' ? 'Ứng viên tự chỉnh sửa kỹ năng hoặc thông tin cơ bản so với bản dịch OCR.' : 'discrepancy detected in skills or basic metadata.'}</li>
                      )}
                    </ul>
                  </div>
                </div>
              )}

              {/* Personal Integrity Commitment Banner */}
              <div className={cx('commitment-banner', { 'commitment-banner--accepted': compareCandidate.commitment_accepted })}>
                <div className={cx('commitment-icon')}>✓</div>
                <div>
                  <strong>{language === 'vi' ? 'Cam kết trung thực:' : 'Integrity Commitment:'}</strong>
                  <p>
                    {compareCandidate.commitment_accepted 
                      ? (language === 'vi' ? 'Ứng viên đã tick chọn cam kết khớp dữ liệu và chịu trách nhiệm nếu gian lận.' : 'Candidate verified that the edited data fully matches the original CV.') 
                      : (language === 'vi' ? 'Ứng viên chưa hoàn tất cam kết.' : 'No integrity commitment recorded.')}
                  </p>
                </div>
              </div>

              {/* Matching Score Summary Card */}
              <div className={cx('info-card')}>
                <div className={cx('info-card-header')}>
                  <span>{language === 'vi' ? 'ĐIỂM SƠ TUYỂN AI' : 'AI PRE-SCREENING SCORE'}</span>
                  <h2>{compareCandidate.match_score}%</h2>
                </div>
                <div className={cx('info-card-progress')}>
                  <div style={{ width: `${compareCandidate.match_score}%`, backgroundColor: compareCandidate.match_score >= 80 ? '#10b981' : compareCandidate.match_score >= 60 ? '#f59e0b' : '#ef4444' }}></div>
                </div>
              </div>

              {/* Comparison Table */}
              <h4 style={{ margin: '15px 0 10px 0', color: '#1e293b' }}>
                📊 {language === 'vi' ? 'Bảng đối soát chi tiết từng trường' : 'Field-by-field Cross-examination Table'}
              </h4>
              <div className={cx('compare-table-wrapper')}>
                <table className={cx('compare-table')}>
                  <thead>
                    <tr>
                      <th>{language === 'vi' ? 'Trường thông tin' : 'Metadata Field'}</th>
                      <th>{language === 'vi' ? 'CV Gốc (OCR bóc tách)' : 'Original CV (OCR Parsed)'}</th>
                      <th>{language === 'vi' ? 'Form đã sửa (Ứng viên nộp)' : 'Candidate Submitted Form'}</th>
                      <th>{language === 'vi' ? 'Đối soát' : 'Cross-check'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className={cx({ 'row-deviation': hasDiscrepancy('position') })}>
                      <td><strong>{language === 'vi' ? 'Chức vụ' : 'Desired Position'}</strong></td>
                      <td>{raw.position || raw.desiredPosition || <em style={{ color: '#aaa' }}>{language === 'vi' ? '(Trống)' : '(Empty)'}</em>}</td>
                      <td>{form.position || form.desiredPosition || <em style={{ color: '#aaa' }}>{language === 'vi' ? '(Trống)' : '(Empty)'}</em>}</td>
                      <td>{hasDiscrepancy('position') ? '⚠️ Lệch' : '✓ Khớp'}</td>
                    </tr>
                    <tr className={cx({ 'row-deviation': hasDiscrepancy('level') })}>
                      <td><strong>{language === 'vi' ? 'Cấp bậc' : 'Career Level'}</strong></td>
                      <td>{raw.level || <em style={{ color: '#aaa' }}>{language === 'vi' ? '(Trống)' : '(Empty)'}</em>}</td>
                      <td>{form.level || <em style={{ color: '#aaa' }}>{language === 'vi' ? '(Trống)' : '(Empty)'}</em>}</td>
                      <td>{hasDiscrepancy('level') ? '🚨 Lệch bậc' : '✓ Khớp'}</td>
                    </tr>
                    <tr className={cx({ 'row-deviation': hasDiscrepancy('experience') })}>
                      <td><strong>{language === 'vi' ? 'Kinh nghiệm' : 'Experience'}</strong></td>
                      <td>{raw.experience !== undefined ? `${raw.experience} năm` : <em style={{ color: '#aaa' }}>{language === 'vi' ? '(Trống)' : '(Empty)'}</em>}</td>
                      <td>{form.experience !== undefined ? `${form.experience} năm` : <em style={{ color: '#aaa' }}>{language === 'vi' ? '(Trống)' : '(Empty)'}</em>}</td>
                      <td>{hasDiscrepancy('experience') ? '🚨 Khai thêm' : '✓ Khớp'}</td>
                    </tr>
                    <tr className={cx({ 'row-deviation': hasDiscrepancy('gpa') })}>
                      <td><strong>{language === 'vi' ? 'Điểm GPA' : 'GPA Score'}</strong></td>
                      <td>{raw.gpa || <em style={{ color: '#aaa' }}>{language === 'vi' ? '(Trống)' : '(Empty)'}</em>}</td>
                      <td>{form.gpa || <em style={{ color: '#aaa' }}>{language === 'vi' ? '(Trống)' : '(Empty)'}</em>}</td>
                      <td>{hasDiscrepancy('gpa') ? '🚨 Nâng điểm' : '✓ Khớp'}</td>
                    </tr>
                    <tr className={cx({ 'row-deviation': hasDiscrepancy('skill') })}>
                      <td><strong>{language === 'vi' ? 'Kỹ năng' : 'Core Skills'}</strong></td>
                      <td>
                        <div className={cx('skills-cell-text')} title={raw.skill || raw.skills || ''}>
                          {raw.skill || raw.skills || <em style={{ color: '#aaa' }}>{language === 'vi' ? '(Trống)' : '(Empty)'}</em>}
                        </div>
                      </td>
                      <td>
                        <div className={cx('skills-cell-text')} title={form.skill || form.skillsSummary || ''}>
                          {form.skill || form.skillsSummary || <em style={{ color: '#aaa' }}>{language === 'vi' ? '(Trống)' : '(Empty)'}</em>}
                        </div>
                      </td>
                      <td>
                        {addedSkills.length > 0 ? (
                          <span style={{ color: '#dc2626', fontWeight: 'bold' }}>
                            🚨 {language === 'vi' ? `Thêm ${addedSkills.length} kỹ năng` : `Added ${addedSkills.length} skills`}
                          </span>
                        ) : '✓ Khớp'}
                      </td>
                    </tr>
                    <tr>
                      <td><strong>{language === 'vi' ? 'Địa chỉ' : 'Location'}</strong></td>
                      <td>{raw.address || <em style={{ color: '#aaa' }}>{language === 'vi' ? '(Trống)' : '(Empty)'}</em>}</td>
                      <td>{form.address || <em style={{ color: '#aaa' }}>{language === 'vi' ? '(Trống)' : '(Empty)'}</em>}</td>
                      <td>{raw.address !== form.address ? 'ℹ️ Sửa đổi' : '✓ Khớp'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Panel: Embedded Original CV Document */}
            <div className={cx('compare-panel-right')}>
              <div className={cx('cv-viewer-header')}>
                <span>📄 {language === 'vi' ? 'FILE CV GỐC ĐỂ ĐỐI SOÁT TRỰC QUAN' : 'ORIGINAL CANDIDATE CV FILE'}</span>
              </div>
              <div className={cx('cv-viewer-body')}>
                {cvSrc ? (
                  cvSrc.endsWith('.pdf') || cvSrc.includes('application/pdf') || cvSrc.startsWith('data:application/pdf') ? (
                    <iframe 
                      src={cvSrc} 
                      title="CV Original Viewer" 
                      width="100%" 
                      height="100%" 
                      style={{ border: 'none' }}
                    />
                  ) : (
                    <div className={cx('cv-image-scroll')}>
                      <img src={cvSrc} alt="Original CV" style={{ width: '100%', height: 'auto', display: 'block' }} />
                    </div>
                  )
                ) : (
                  <div className={cx('no-cv-view')}>
                    {language === 'vi' ? 'Không tìm thấy file CV đính kèm' : 'No CV file attached'}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const hasSelectedCriteria = selectedCriteria.length > 0;

  const selectedCriteriaLabels = criteriaOptions
    .filter((criterion) => selectedCriteria.includes(criterion.key))
    .map((criterion) => criterion.label);

  const toggleCriterion = (criterionKey) => {
    setSelectedCriteria((current) => {
      const nextSelection = current.includes(criterionKey)
        ? current.filter((item) => item !== criterionKey)
        : [...current, criterionKey];

      return ORDERED_CRITERIA_KEYS.filter((item) => nextSelection.includes(item));
    });
  };

  const clearCriteria = () => setSelectedCriteria([]);

  const getBadgeLabels = (candidate) => {
    if (hasSelectedCriteria) {
      return criteriaOptions
        .filter(
          (criterion) =>
            selectedCriteria.includes(criterion.key) &&
            candidate.matchedCriteriaKeys.includes(criterion.key),
        )
        .map((criterion) => {
          if (criterion.key === 'techMajor') {
            return candidate.isTop3 ? t.badgeOutstanding : null;
          }
          if (criterion.key === 'highGpa') {
            return null;
          }
          return criterion.label;
        })
        .filter(Boolean);
    }

    return [
      candidate.matchedCriteriaKeys.includes('english') ? t.badgePriorityEnglish : null,
      candidate.matchedCriteriaKeys.includes('recentGraduate')
        ? t.badgeRecentGraduate
        : null,
      candidate.isTop3 ? t.badgeOutstanding : null,
    ].filter(Boolean);
  };

  if (loading) {
    return <div className={cx('cands__status')}>{t.loading}</div>;
  }

  return (
    <div className={cx('cands')}>
      <section className={cx('cands__hero')}>
        <div>
          <h1 className={cx('cands__title')}>{t.pageTitle}</h1>
          <p className={cx('cands__subtitle')}>{t.pageDescription}</p>
        </div>

        <div className={cx('cands__hero-stat')}>
          <span>{t.resultsLabel}</span>
          <strong>{displayedCandidates.length}</strong>
          <button
            type="button"
            onClick={fetchCandidates}
            style={{ display: 'block', marginTop: 8, fontSize: '0.8rem', color: 'var(--primary-color)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
          >
            {language === 'vi' ? '↻ Làm mới' : '↻ Refresh'}
          </button>
        </div>
      </section>

      <section className={cx('cands__panel')}>
        <h2 className={cx('cands__panel-title')}>{t.panelTitle}</h2>

        {error ? <div className={cx('cands__alert')}>{error}</div> : null}

        <div className={cx('cands__controls')}>
          <div className={cx('cands__search')}>
            <input
              className={cx('cands__search-input')}
              placeholder={t.searchPlaceholder}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>

          <div className={cx('cands__select')}>
            <select
              className={cx('cands__select-native')}
              value={selectedMajor}
              onChange={(event) => setSelectedMajor(event.target.value)}
            >
              <option value="all">{t.filterAllMajors}</option>
              {majors
                .filter((major) => major !== 'all')
                .map((major) => (
                  <option key={major} value={major}>
                    {major}
                  </option>
                ))}
            </select>
          </div>

          {hasSelectedCriteria ? (
            <button
              type="button"
              className={cx('cands__clear-btn')}
              onClick={clearCriteria}
            >
              {t.clearCriteria}
            </button>
          ) : null}
        </div>

        <div className={cx('cands__criteria')}>
          <div className={cx('cands__criteria-header')}>
            <div>
              <h3 className={cx('cands__criteria-title')}>{t.criteriaTitle}</h3>
              <p className={cx('cands__criteria-text')}>{t.criteriaDescription}</p>
            </div>
          </div>

          <div className={cx('cands__criteria-list')}>
            {criteriaOptions.map((criterion) => (
              <label
                key={criterion.key}
                className={cx('criterion-chip', {
                  'criterion-chip--active': selectedCriteria.includes(criterion.key),
                })}
              >
                <input
                  type="checkbox"
                  checked={selectedCriteria.includes(criterion.key)}
                  onChange={() => toggleCriterion(criterion.key)}
                />
                <span>{criterion.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div
          className={cx('cands__mode', {
            'cands__mode--filtered': hasSelectedCriteria,
          })}
        >
          <div>
            <span className={cx('cands__mode-kicker')}>
              {hasSelectedCriteria ? t.filteredModeTitle : t.outstandingModeTitle}
            </span>
            <p className={cx('cands__mode-text')}>
              {hasSelectedCriteria ? t.filteredModeText : t.outstandingModeText}
            </p>
          </div>

          <div className={cx('cands__mode-summary')}>
            <strong>{displayedCandidates.length}</strong>
            <span>{t.resultsLabel}</span>
          </div>
        </div>

        {hasSelectedCriteria && selectedCriteriaLabels.length > 0 ? (
          <div className={cx('cands__selected')}>
            <span className={cx('cands__selected-label')}>{t.selectedCriteriaLabel}</span>
            <div className={cx('cands__selected-list')}>
              {selectedCriteriaLabels.map((label) => (
                <span key={label} className={cx('cands__selected-chip')}>
                  {label}
                </span>
              ))}
            </div>
          </div>
        ) : null}
      </section>

      <div className={cx('cands__list')}>
        {displayedCandidates.map((candidate) => {
          const badgeLabels = getBadgeLabels(candidate);

          return (
            <article key={candidate.id} className={cx('cand-card')}>
              <header className={cx('cand-card__header')}>
                <div className={cx('cand-card__profile')}>
                  <img
                    className={cx('cand-card__avatar')}
                    src={candidate.avatar}
                    alt={candidate.name}
                  />

                  <div className={cx('cand-card__identity')}>
                    <div className={cx('cand-card__name')} style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      {candidate.name}
                      {candidate.deviation_status === 'flagged_red' && (
                        <span className={cx('fraud-flag', 'fraud-flag--red')} title={language === 'vi' ? 'Sai lệch dữ liệu cực nặng!' : 'Severe data discrepancy!'}>
                          🚨 {language === 'vi' ? 'KHAI KHỐNG' : 'FRAUD ALERT'}
                        </span>
                      )}
                      {candidate.deviation_status === 'flagged_yellow' && (
                        <span className={cx('fraud-flag', 'fraud-flag--yellow')} title={language === 'vi' ? 'Sai lệch dữ liệu nhẹ!' : 'Discrepancy detected!'}>
                          ⚠️ {language === 'vi' ? 'SAI LỆCH' : 'SUSPICIOUS'}
                        </span>
                      )}
                    </div>
                    <div className={cx('cand-card__school')}>{candidate.school || '-'}</div>
                  </div>
                </div>

                <div className={cx('cand-card__score')}>
                  <span className={cx('cand-card__score-label')}>
                    {hasSelectedCriteria ? t.scoreCriteria : t.scorePriority}
                  </span>
                  <strong>
                    {hasSelectedCriteria
                      ? `${candidate.selectedCriteriaCount}/${selectedCriteria.length}`
                      : candidate.match_score > 0
                        ? `${candidate.match_score}%`
                        : candidate.outstandingScore}
                  </strong>
                </div>
              </header>

              <div className={cx('cand-card__body')}>
                {/* Row 1: Position & Career Goal */}
                <div className={cx('cand-card__row-job')}>
                  <span className={cx('cand-card__job-title')}>
                    💼 {candidate.latestJobTitle || candidate.major || t.englishNotUpdated}
                  </span>
                  {candidate.career_goal && candidate.career_goal !== '-' && (
                    <span className={cx('cand-card__career-goal')} title={candidate.career_goal}>
                      🎯 {candidate.career_goal}
                    </span>
                  )}
                </div>

                {/* Row 2: Badges/Tags for Contacts */}
                <div className={cx('cand-card__contact-row')}>
                  {candidate.address && candidate.address !== '-' && (
                    <span className={cx('contact-badge')} title={candidate.address}>
                      📍 {candidate.address}
                    </span>
                  )}
                  {candidate.phone && candidate.phone !== '-' ? (
                    <span className={cx('contact-badge')}>
                      📞 {candidate.phone}
                    </span>
                  ) : (
                    <span className={cx('contact-badge', 'contact-badge--empty')}>
                      📞 {t.englishNotUpdated}
                    </span>
                  )}
                  {candidate.email && candidate.email !== '-' ? (
                    <span className={cx('contact-badge', 'contact-badge--email')} title={candidate.email}>
                      ✉️ <span className={cx('email-text')}>{candidate.email}</span>
                    </span>
                  ) : (
                    <span className={cx('contact-badge', 'contact-badge--empty')}>
                      ✉️ {t.englishNotUpdated}
                    </span>
                  )}
                </div>

                {/* Row 3: Education/Academic Info */}
                <div className={cx('cand-card__edu-row')}>
                  <span className={cx('edu-tag', { 'edu-tag--empty': !candidate.gpa })}>
                    🎓 GPA: {candidate.gpa || '-'}
                  </span>
                  <span className={cx('edu-tag', { 'edu-tag--empty': !candidate.englishLabel || candidate.englishLabel === t.englishNotUpdated })}>
                    🇬🇧 {t.labelEnglish}: {candidate.englishLabel || t.englishNotUpdated}
                  </span>
                  <span className={cx('edu-tag', { 'edu-tag--empty': !candidate.graduation_year || candidate.graduation_year === '-' })}>
                    📅 {t.labelGraduation}: {candidate.graduation_year || '-'}
                  </span>
                </div>

                {/* Row 4: Salary & Applications Meta */}
                <div className={cx('cand-card__meta-row')}>
                  {candidate.desired_salary && candidate.desired_salary !== '-' && (
                    <span className={cx('meta-tag')}>
                      💵 {candidate.desired_salary}
                    </span>
                  )}
                  <span className={cx('meta-tag')}>
                    📥 {t.labelApplications}: {candidate.totalApplications || 0}
                  </span>
                </div>

                {/* Skills Section */}
                {candidate.skills.length > 0 ? (
                  <div className={cx('cand-card__skills')}>
                    <div className={cx('cand-card__skills-list')}>
                      {candidate.skills.slice(0, 6).map((skill) => (
                        <span key={`${candidate.id}-${skill.id}-${skill.level}`} className={cx('cand-card__skill')} title={`${skill.name} (${skill.level}/5)`}>
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}

                {/* Criteria Badges */}
                {badgeLabels.length > 0 ? (
                  <div className={cx('cand-card__badges')}>
                    {badgeLabels.map((label) => (
                      <span key={`${candidate.id}-${label}`} className={cx('cand-card__badge')}>
                        {label}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>

              {candidate.cv_file_base64 || candidate.cv_file_path ? (
                <div className={cx('cand-card__cv-action')} style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                  <button
                    type="button"
                    onClick={() => openSideBySide(candidate)}
                    className={cx('cand-card__cv-btn')}
                    style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: '#fff', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}
                  >
                    🔍 {language === 'vi' ? 'Đối soát Side-by-Side' : 'Cross-check Side-by-Side'}
                  </button>
                  <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                    <a
                      href={candidate.cv_file_base64 || `http://localhost:5000/${candidate.cv_file_path.replace(/\\/g, '/')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cx('cand-card__cv-btn')}
                      style={{ flex: 1 }}
                    >
                      📄 {language === 'vi' ? 'Xem CV gốc' : 'View CV'}
                    </a>
                    <a
                      href={candidate.cv_file_base64 || `http://localhost:5000/${candidate.cv_file_path.replace(/\\/g, '/')}`}
                      download={`CV_${candidate.name.replace(/\s+/g, '_')}_original`}
                      className={cx('cand-card__cv-btn')}
                      style={{ flex: 1, background: 'linear-gradient(135deg, #10b981, #059669)', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.15)' }}
                    >
                      📥 {language === 'vi' ? 'Tải CV' : 'Download CV'}
                    </a>
                  </div>
                </div>
              ) : null}
            </article>
          );
        })}

        {displayedCandidates.length === 0 && !error ? (
          <div className={cx('cands__empty')}>
            {normalizedCandidates.length === 0 && !error
              ? t.noCandidatesInDb
              : hasSelectedCriteria
                ? t.noResultFiltered
                : t.noResultOutstanding}
          </div>
        ) : null}
      </div>
      {renderCompareModal()}
    </div>
  );
}

export default CandidateManagement;
