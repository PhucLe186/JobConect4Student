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

    if (selectedCriteria.length === 0) {
      const pool = enrichedCandidates;

      return pool.sort(
        (left, right) =>
          right.match_score - left.match_score ||
          right.outstandingScore - left.outstandingScore ||
          right.gpa - left.gpa ||
          right.englishScore - left.englishScore ||
          Number(right.graduation_year) - Number(left.graduation_year),
      );
    }

    return enrichedCandidates
      .filter((candidate) =>
        selectedCriteria.every((criterionKey) =>
          candidate.matchedCriteriaKeys.includes(criterionKey),
        ),
      )
      .sort(
        (left, right) =>
          right.selectedCriteriaCount - left.selectedCriteriaCount ||
          right.match_score - left.match_score ||
          right.gpa - left.gpa ||
          right.englishScore - left.englishScore ||
          right.outstandingScore - left.outstandingScore,
      );
  }, [filteredBySearch, selectedCriteria]);

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
        .map((criterion) => criterion.label);
    }

    return [
      candidate.matchedCriteriaKeys.includes('highGpa') ? t.badgePriorityGpa : null,
      candidate.matchedCriteriaKeys.includes('english') ? t.badgePriorityEnglish : null,
      candidate.matchedCriteriaKeys.includes('recentGraduate')
        ? t.badgeRecentGraduate
        : null,
      candidate.matchedCriteriaKeys.includes('techMajor') ? t.badgeTechMajor : null,
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
                    <div className={cx('cand-card__name')}>{candidate.name}</div>
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

              {candidate.cv_file_path ? (
                <div className={cx('cand-card__cv-action')}>
                  <a
                    href={`http://localhost:5000/${candidate.cv_file_path.replace(/\\/g, '/')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cx('cand-card__cv-btn')}
                  >
                    📄 {language === 'vi' ? 'Xem CV gốc' : 'View CV'}
                  </a>
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
    </div>
  );
}

export default CandidateManagement;
