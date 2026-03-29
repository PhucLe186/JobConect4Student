import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './JobSuggestions.module.scss';
import { AuthContext } from '~/context/AuthContext';
import translations from '~/component/Translation';
import { createCompanyPlaceholder, mergeJobs } from '~/user/component/shared/companyData';
import {
    buildProfileSuggestionCriteria,
    filterJobsBySuggestionCriteria,
    getCriteriaSummary,
    rankJobsByCriteria,
} from '~/user/component/shared/jobSuggestionUtils';

const cx = classNames.bind(styles);

if (!document.querySelector('link[href*="fontawesome"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
    document.head.appendChild(link);
}

function JobSuggestions() {
    const navigate = useNavigate();
    const { api, language, user } = useContext(AuthContext);
    const [allJobs, setAllJobs] = useState([]);
    const [studentProfile, setStudentProfile] = useState(null);
    const [showAll, setShowAll] = useState(false);
    const [filters, setFilters] = useState({
        level: '',
        jobKeyword: '',
        address: '',
        skill: '',
        gpa: '',
    });

    const t = translations[language || 'vi'];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const jobsPromise = api.get('jobs');
                const profilePromise = user ? api.get('student') : Promise.resolve({ data: null });
                const [jobsRes, profileRes] = await Promise.all([jobsPromise, profilePromise]);

                setAllJobs(mergeJobs(jobsRes.data || []));
                setStudentProfile(profileRes.data || null);
            } catch (error) {
                console.error('Error fetching suggestions data:', error);
                setAllJobs(mergeJobs([]));
                setStudentProfile(null);
            }
        };

        fetchData();
    }, [api, user]);

    const profileCriteria = useMemo(() => buildProfileSuggestionCriteria(studentProfile || {}), [studentProfile]);
    const criteriaSummary = useMemo(() => getCriteriaSummary(profileCriteria), [profileCriteria]);

    const rankedJobs = useMemo(() => {
        if (!user) {
            return allJobs.map((job) => ({
                ...job,
                suggestionScore: 0,
                matchedCriteria: [],
                requiredGpa: job.requiredGpa || 2.7,
            }));
        }

        return rankJobsByCriteria(allJobs, profileCriteria);
    }, [allJobs, profileCriteria, user]);

    const filteredJobs = useMemo(
        () => filterJobsBySuggestionCriteria(rankedJobs, filters),
        [filters, rankedJobs],
    );

    const visibleJobs = showAll ? filteredJobs : filteredJobs.slice(0, 6);
    const levelOptions = useMemo(
        () => Array.from(new Set(rankedJobs.map((job) => job.level).filter(Boolean))),
        [rankedJobs],
    );

    const updateFilter = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
        setShowAll(false);
    };

    const clearFilters = () => {
        setFilters({
            level: '',
            jobKeyword: '',
            address: '',
            skill: '',
            gpa: '',
        });
        setShowAll(false);
    };

    return (
        <div className={cx('job-suggestions')}>
            <div className={cx('container')}>
                <div className={cx('header')}>
                    <h1 className={cx('title')}>{language === 'vi' ? 'Gợi ý công việc phù hợp' : 'Job Suggestions'}</h1>
                    <p className={cx('subtitle')}>
                        {language === 'vi'
                            ? 'Hệ thống gợi ý dựa trên 5 tiêu chí: Level, công việc, địa chỉ, kỹ năng và GPA.'
                            : 'Suggestions are ranked by five criteria: level, job, address, skills, and GPA.'}
                    </p>
                </div>

                <div className={cx('filter-panel')}>
                    <div className={cx('filter-grid')}>
                        <div className={cx('filter-item')}>
                            <label>{language === 'vi' ? 'Level' : 'Level'}</label>
                            <select
                                className={cx('filter-input')}
                                value={filters.level}
                                onChange={(e) => updateFilter('level', e.target.value)}
                            >
                                <option value="">{language === 'vi' ? 'Tất cả level' : 'All levels'}</option>
                                {levelOptions.map((level) => (
                                    <option key={level} value={level}>
                                        {level}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={cx('filter-item')}>
                            <label>{language === 'vi' ? 'Công việc' : 'Job'}</label>
                            <input
                                className={cx('filter-input')}
                                value={filters.jobKeyword}
                                onChange={(e) => updateFilter('jobKeyword', e.target.value)}
                                placeholder={language === 'vi' ? 'Ví dụ: Backend, Data Analyst...' : 'Example: Backend'}
                            />
                        </div>

                        <div className={cx('filter-item')}>
                            <label>{language === 'vi' ? 'Địa chỉ' : 'Address'}</label>
                            <input
                                className={cx('filter-input')}
                                value={filters.address}
                                onChange={(e) => updateFilter('address', e.target.value)}
                                placeholder={language === 'vi' ? 'Ví dụ: Hà Nội, TP.HCM...' : 'Example: Hanoi'}
                            />
                        </div>

                        <div className={cx('filter-item')}>
                            <label>{language === 'vi' ? 'Kỹ năng' : 'Skill'}</label>
                            <input
                                className={cx('filter-input')}
                                value={filters.skill}
                                onChange={(e) => updateFilter('skill', e.target.value)}
                                placeholder={language === 'vi' ? 'Ví dụ: React, SQL, Java...' : 'Example: React'}
                            />
                        </div>

                        <div className={cx('filter-item')}>
                            <label>GPA</label>
                            <input
                                type="number"
                                min="0"
                                max="4"
                                step="0.1"
                                className={cx('filter-input')}
                                value={filters.gpa}
                                onChange={(e) => updateFilter('gpa', e.target.value)}
                                placeholder="0.0 - 4.0"
                            />
                        </div>
                    </div>

                    <div className={cx('filter-actions')}>
                        <button className={cx('clear-btn')} onClick={clearFilters}>
                            {language === 'vi' ? 'Xóa bộ lọc' : 'Clear filters'}
                        </button>
                    </div>

                    {user && criteriaSummary.length > 0 && (
                        <div className={cx('criteria-box')}>
                            <div className={cx('criteria-title')}>
                                {language === 'vi'
                                    ? 'Hồ sơ đang dùng để gợi ý tự động'
                                    : 'Profile criteria used for auto suggestions'}
                            </div>
                            <div className={cx('criteria-list')}>
                                {criteriaSummary.map((item) => (
                                    <span key={`${item.label}-${item.value}`} className={cx('criteria-chip')}>
                                        <strong>{item.label}:</strong> {item.value}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {!user && (
                        <p className={cx('guest-note')}>
                            {language === 'vi'
                                ? 'Đăng nhập để hệ thống gợi ý theo hồ sơ của bạn trên 5 tiêu chí này.'
                                : 'Log in to get profile-based suggestions using these five criteria.'}
                        </p>
                    )}
                </div>

                {filteredJobs.length === 0 && (
                    <p className={cx('empty-state')}>
                        {language === 'vi'
                            ? 'Chưa có công việc phù hợp với bộ lọc hiện tại.'
                            : 'No jobs match the current filters.'}
                    </p>
                )}

                <div className={cx('jobs-grid')}>
                    {visibleJobs.map((job) => (
                        <div className={cx('job-card')} key={job.id}>
                            <div className={cx('job-header')}>
                                <img
                                    src={job.logo}
                                    alt={job.company_name}
                                    className={cx('company-logo')}
                                    onError={(e) => {
                                        e.currentTarget.src = createCompanyPlaceholder(job.company_name);
                                    }}
                                />
                                <div className={cx('job-info')}>
                                    <h3 className={cx('job-title')}>{job.title}</h3>
                                    <p className={cx('company-name')}>{job.company_name}</p>
                                    <div className={cx('job-badges')}>
                                        <span className={cx('badge')}>{job.level || '--'}</span>
                                        <span className={cx('badge', 'badge--soft')}>{job.location}</span>
                                    </div>
                                </div>
                                {user && (
                                    <div className={cx('score-badge')}>
                                        <span>{job.suggestionScore}%</span>
                                    </div>
                                )}
                            </div>

                            <div className={cx('job-meta')}>
                                <div className={cx('job-meta-item')}>
                                    <i className="fas fa-money-bill-wave"></i>
                                    <span>{job.salaryLabel}</span>
                                </div>
                                <div className={cx('job-meta-item')}>
                                    <i className="fas fa-briefcase"></i>
                                    <span>{job.typeLabel}</span>
                                </div>
                                <div className={cx('job-meta-item')}>
                                    <i className="fas fa-graduation-cap"></i>
                                    <span>GPA {language === 'vi' ? 'tối thiểu' : 'minimum'}: {job.requiredGpa}</span>
                                </div>
                            </div>

                            {user && job.matchedCriteria?.length > 0 && (
                                <div className={cx('matched-list')}>
                                    {job.matchedCriteria.map((item) => (
                                        <span key={`${job.id}-${item}`} className={cx('matched-chip')}>
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            )}

                            <p className={cx('description')}>{job.description}</p>

                            <button
                                className={cx('apply-btn')}
                                onClick={() => {
                                    if (!user) {
                                        alert(t.loginToViewMore);
                                        return;
                                    }
                                    navigate(`/job/${job.id}`);
                                }}
                            >
                                {t.seeMore}
                            </button>
                        </div>
                    ))}
                </div>

                {filteredJobs.length > 6 && (
                    <div className={cx('view-more-wrapper')}>
                        <button
                            className={cx('view-more-btn')}
                            onClick={() => {
                                if (!user) {
                                    alert(t.loginToViewMore);
                                    return;
                                }
                                setShowAll(!showAll);
                            }}
                        >
                            {showAll ? (language === 'vi' ? 'Thu gọn' : 'Show Less') : t.viewMore}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default JobSuggestions;
