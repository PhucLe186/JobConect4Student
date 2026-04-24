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

const isTechMajor = (major = '') => {
  const normalizedMajor = normalizeText(major);
  return [
    'phan mem',
    'khoa hoc may tinh',
    'he thong thong tin',
    'computer science',
    'data science',
    'ai',
    'software',
    'cntt',
  ].some((keyword) => normalizedMajor.includes(keyword));
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
    matches: (candidate) => isTechMajor(candidate.major),
  },
];

const ORDERED_CRITERIA_KEYS = CRITERIA_DEFINITIONS.map((criterion) => criterion.key);
const DEFAULT_OUTSTANDING_KEYS = ['highGpa', 'english'];

const getOutstandingScore = (candidate) => {
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
        `${t.loadError}: ${
          fetchError.response?.data?.message || fetchError.message || 'Unknown error'
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
      const outstandingCandidates = enrichedCandidates.filter((candidate) =>
        DEFAULT_OUTSTANDING_KEYS.some((criterionKey) =>
          candidate.matchedCriteriaKeys.includes(criterionKey),
        ),
      );

      const pool = outstandingCandidates.length > 0 ? outstandingCandidates : enrichedCandidates;

      return pool.sort(
        (left, right) =>
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
                    <div className={cx('cand-card__role')}>{candidate.major || '-'}</div>
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
                      : candidate.outstandingScore}
                  </strong>
                </div>
              </header>

              <div className={cx('cand-card__badges')}>
                {!hasSelectedCriteria ? (
                  <span className={cx('cand-card__badge', 'cand-card__badge--outstanding')}>
                    {t.badgeOutstanding}
                  </span>
                ) : null}

                {badgeLabels.map((label) => (
                  <span key={`${candidate.id}-${label}`} className={cx('cand-card__badge')}>
                    {label}
                  </span>
                ))}
              </div>

              <div className={cx('cand-card__info')}>
                <div className={cx('cand-card__info-item')}>
                  <span className={cx('cand-card__label')}>{t.labelPhone}</span>
                  <strong>{candidate.phone || '-'}</strong>
                </div>

                <div className={cx('cand-card__info-item')}>
                  <span className={cx('cand-card__label')}>{t.labelEmail}</span>
                  <strong>{candidate.email || '-'}</strong>
                </div>

                <div className={cx('cand-card__info-item')}>
                  <span className={cx('cand-card__label')}>{t.labelAddress}</span>
                  <strong>{candidate.address || '-'}</strong>
                </div>

                <div className={cx('cand-card__info-item')}>
                  <span className={cx('cand-card__label')}>{t.labelGraduation}</span>
                  <strong>{candidate.graduation_year || '-'}</strong>
                </div>

                <div className={cx('cand-card__info-item')}>
                  <span className={cx('cand-card__label')}>{t.labelGPA}</span>
                  <strong>{candidate.gpa || '-'}</strong>
                </div>

                <div className={cx('cand-card__info-item')}>
                  <span className={cx('cand-card__label')}>{t.labelEnglish}</span>
                  <strong>{candidate.englishLabel || t.englishNotUpdated}</strong>
                </div>

                <div className={cx('cand-card__info-item')}>
                  <span className={cx('cand-card__label')}>{t.labelSalary}</span>
                  <strong>{candidate.desired_salary || '-'}</strong>
                </div>

                <div className={cx('cand-card__info-item')}>
                  <span className={cx('cand-card__label')}>{t.labelLatestJob}</span>
                  <strong>{candidate.latestJobTitle || '-'}</strong>
                </div>

                <div className={cx('cand-card__info-item')}>
                  <span className={cx('cand-card__label')}>{t.labelApplications}</span>
                  <strong>{candidate.totalApplications || 0}</strong>
                </div>
              </div>

              {candidate.skills.length > 0 ? (
                <div className={cx('cand-card__skills')}>
                  <span className={cx('cand-card__label')}>{t.labelSkills}</span>
                  <div className={cx('cand-card__skills-list')}>
                    {candidate.skills.slice(0, 6).map((skill) => (
                      <span key={`${candidate.id}-${skill.id}-${skill.level}`} className={cx('cand-card__skill')}>
                        {skill.name} ({skill.level}/5)
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className={cx('cand-card__goal-section')}>
                <div className={cx('cand-card__goal-label')}>{t.labelGoal}</div>
                <div className={cx('cand-card__goal-text')}>
                  {candidate.career_goal || '-'}
                </div>
              </div>
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
