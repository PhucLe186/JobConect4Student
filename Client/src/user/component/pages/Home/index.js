import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import style from './Home.module.scss';
import LookJobsImg from '~/asset/img/LookJobs.png';
import translations from '~/component/Translation';
import { AuthContext } from '~/context/AuthContext';
import { createCompanyPlaceholder, mergeJobs } from '~/user/component/shared/companyData';

const cx = classNames.bind(style);

if (!document.querySelector('link[href*="fontawesome"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
    document.head.appendChild(link);
}

const Homepage = () => {
    const navigate = useNavigate();
    const { api, language } = useContext(AuthContext);
    const [salaryValue, setSalaryValue] = useState(50);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [allJobData, setAllJobData] = useState([]);
    const [experience, setExperience] = useState('');
    const [location, setLocation] = useState('');
    const [jobType, setJobType] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const jobPerPages = 9;

    const t = translations[language || 'vi'];

    const getRequirementTags = (requirements = '') =>
        String(requirements)
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean)
            .slice(0, 3);

    const getJobTypeLabel = (type) => {
        if (type === 'part-time') {
            return 'Part-time';
        }

        if (type === 'internship') {
            return language === 'vi' ? 'Thuc tap' : 'Internship';
        }

        return 'Full-time';
    };

    const experienceOptions = Array.from(new Set(allJobData.map((job) => job.experience).filter(Boolean)));
    const locationOptions = Array.from(new Set(allJobData.map((job) => job.location).filter(Boolean)));
    const jobTypeOptions = Array.from(new Set(allJobData.map((job) => job.job_type).filter(Boolean)));

    const filteredJobs = allJobData.filter((job) => {
        const searchValue = searchKeyword.toLowerCase();
        const matchesSearch =
            !searchKeyword ||
            job.title?.toLowerCase().includes(searchValue) ||
            job.company_name?.toLowerCase().includes(searchValue) ||
            job.industry?.toLowerCase().includes(searchValue) ||
            job.location?.toLowerCase().includes(searchValue) ||
            job.description?.toLowerCase().includes(searchValue) ||
            job.requirements?.toLowerCase().includes(searchValue);

        const matchesExperience = !experience || job.experience === experience;
        const matchesLocation = !location || job.location === location;
        const matchesJobType = !jobType || job.job_type === jobType;
        const matchesSalary =
            !job.min_salary || Number(job.min_salary || 0) / 1000000 <= Number(salaryValue || 0);

        return matchesSearch && matchesExperience && matchesLocation && matchesJobType && matchesSalary;
    });

    const totalJob = filteredJobs.length;
    const totalPages = Math.max(1, Math.ceil(totalJob / jobPerPages));
    const startIndex = (currentPage - 1) * jobPerPages;
    const finalJobPage = filteredJobs.slice(startIndex, startIndex + jobPerPages);

    const updateSalary = (value) => {
        setSalaryValue(value);
        setCurrentPage(1);
    };

    const handleSearch = (e) => {
        setSearchKeyword(e.target.value);
        setCurrentPage(1);
    };

    const handleFilterChange = (setter) => (e) => {
        setter(e.target.value);
        setCurrentPage(1);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get('jobs');
                setAllJobData(mergeJobs(res.data || []));
            } catch (error) {
                console.error('API Error:', error);
                setAllJobData(mergeJobs([]));
            }
        };

        fetchData();
    }, [api]);

    return (
        <div className={cx('home-page')}>
            <div className={cx('hero-section')}>
                <div className={cx('container')}>
                    <div className={cx('hero-content')}>
                        <div className={cx('hero-image')}>
                            <img src={LookJobsImg} alt="Job Search" />
                        </div>
                        <h1 className={cx('hero-title')}>{t.findJob}</h1>
                        <div className={cx('search-box')}>
                            <input
                                type="text"
                                className={cx('search-input')}
                                placeholder={t.searchPlaceholder}
                                value={searchKeyword}
                                onChange={handleSearch}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className={cx('filter-section')}>
                <div className={cx('container')}>
                    <div className={cx('filter-row')}>
                        <div className={cx('filter-item')}>
                            <label>{t.salaryRange}</label>
                            <div className={cx('salary-range')}>
                                <input
                                    type="range"
                                    className={cx('salary-slider')}
                                    min="0"
                                    max="50"
                                    value={salaryValue}
                                    onChange={(e) => updateSalary(e.target.value)}
                                />
                                <div className={cx('salary-display')}>
                                    0 - {salaryValue} {language === 'vi' ? 'trieu VND' : 'million VND'}
                                </div>
                            </div>
                        </div>

                        <div className={cx('filter-item')}>
                            <label>{t.experienceLevel}</label>
                            <select
                                className={cx('filter-select')}
                                value={experience}
                                onChange={handleFilterChange(setExperience)}
                            >
                                <option value="">{t.chooseExp}</option>
                                {experienceOptions.map((item) => (
                                    <option key={item} value={item}>
                                        {item}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={cx('filter-item')}>
                            <label>{t.workLocation}</label>
                            <select
                                className={cx('filter-select')}
                                value={location}
                                onChange={handleFilterChange(setLocation)}
                            >
                                <option value="">{t.chooseLocation}</option>
                                {locationOptions.map((item) => (
                                    <option key={item} value={item}>
                                        {item}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={cx('filter-item')}>
                            <label>{t.jobType}</label>
                            <select
                                className={cx('filter-select')}
                                value={jobType}
                                onChange={handleFilterChange(setJobType)}
                            >
                                <option value="">{t.chooseJobType}</option>
                                {jobTypeOptions.map((item) => (
                                    <option key={item} value={item}>
                                        {getJobTypeLabel(item)}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className={cx('jobs-section')}>
                <div className={cx('container')}>
                    <div className={cx('jobs-summary')}>
                        {language === 'vi'
                            ? `${totalJob} c?ng vi?c ?ang hi?n th?`
                            : `${totalJob} jobs currently available`}
                    </div>

                    {filteredJobs.length === 0 && (
                        <p className={cx('empty-state')}>
                            {language === 'vi'
                                ? 'Không tìm thấy công việc phù hợp với bộ lọc hiện tại.'
                                : 'No jobs match the current filters.'}
                        </p>
                    )}

                    <div className={cx('jobs-grid')}>
                        {finalJobPage.map((job) => (
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
                                        <div className={cx('job-title-row')}>
                                            <h3 className={cx('job-title')}>{job.title}</h3>
                                            <span className={cx('job-level-badge')}>
                                                {job.level || (language === 'vi' ? 'Cập nhật sau' : 'Updating')}
                                            </span>
                                        </div>
                                        <p className={cx('company-name')}>{job.company_name}</p>
                                        <span className={cx('job-industry')}>{job.industry}</span>
                                    </div>
                                </div>

                                <div className={cx('job-meta-list')}>
                                    <div className={cx('job-meta-item')}>
                                        <i className="fas fa-location-dot"></i>
                                        <span>{job.location}</span>
                                    </div>
                                    <div className={cx('job-meta-item')}>
                                        <i className="fas fa-money-bill-wave"></i>
                                        <span>{job.salaryLabel}</span>
                                    </div>
                                    <div className={cx('job-meta-item')}>
                                        <i className="fas fa-briefcase"></i>
                                        <span>{job.experience}</span>
                                    </div>
                                    <div className={cx('job-meta-item')}>
                                        <i className="fas fa-clock"></i>
                                        <span>{job.typeLabel || getJobTypeLabel(job.job_type)}</span>
                                    </div>
                                    <div className={cx('job-meta-item')}>
                                        <i className="fas fa-calendar-days"></i>
                                        <span>
                                            {language === 'vi' ? 'Han nop' : 'Deadline'}: {job.deadlineLabel}
                                        </span>
                                    </div>
                                </div>

                                <div className={cx('job-tags')}>
                                    {getRequirementTags(job.requirements).map((tag) => (
                                        <span key={`${job.id}-${tag}`} className={cx('job-tag')}>
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <p className={cx('job-description')}>{job.description}</p>

                                <button
                                    className={cx('apply-btn')}
                                    onClick={() => {
                                        navigate(`/job/${job.id}`);
                                    }}
                                >
                                    {t.seeMore}
                                </button>
                            </div>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className={cx('pagination-wrapper')}>
                            <button
                                className={cx('page-btn')}
                                onClick={() => setCurrentPage(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                {t.previous}
                            </button>
                            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                                <button
                                    key={page}
                                    className={cx('page-btn', { active: currentPage === page })}
                                    onClick={() => setCurrentPage(page)}
                                >
                                    {page}
                                </button>
                            ))}
                            <button
                                className={cx('page-btn')}
                                onClick={() => setCurrentPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                {t.next}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Homepage;
