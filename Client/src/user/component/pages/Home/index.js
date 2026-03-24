import React, { useContext, useEffect, useMemo, useState } from 'react';
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
    const [allJobData, setAllJobData] = useState([]);
    const [experience, setExperience] = useState('');
    const [location, setLocation] = useState('');
    const [jobType, setJobType] = useState('');
    const [searchKeyword, setSearchKeyword] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const jobsPerPage = 9;
    const t = translations[language || 'vi'];

    const locationOptions = useMemo(
        () => Array.from(new Set(allJobData.map((job) => job.location).filter(Boolean))).slice(0, 10),
        [allJobData],
    );

    const filteredJobs = allJobData.filter((job) => {
        const keyword = searchKeyword.trim().toLowerCase();
        const matchesKeyword =
            !keyword ||
            job.title?.toLowerCase().includes(keyword) ||
            job.company_name?.toLowerCase().includes(keyword) ||
            job.industry?.toLowerCase().includes(keyword);
        const matchesExperience = !experience || job.experience === experience;
        const matchesLocation = !location || job.location?.includes(location);
        const matchesJobType = !jobType || job.job_type?.toLowerCase() === jobType;
        const maxSalary = Number(job.max_salary || job.min_salary || 0);
        const matchesSalary = !maxSalary || maxSalary <= salaryValue * 1_000_000;

        return matchesKeyword && matchesExperience && matchesLocation && matchesJobType && matchesSalary;
    });

    const totalJobs = filteredJobs.length;
    const totalPages = Math.ceil(totalJobs / jobsPerPage);
    const startIndex = (currentPage - 1) * jobsPerPage;
    const finalJobPage = filteredJobs.slice(startIndex, startIndex + jobsPerPage);

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
                if (error.response) {
                    alert(error.response?.data?.message);
                } else {
                    alert(language === 'vi' ? 'Lỗi kết nối tới server' : 'Server connection error');
                }
                setAllJobData(mergeJobs([]));
            }
        };

        fetchData();
    }, [api, language]);

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
                                    0 - {salaryValue} {language === 'vi' ? 'triệu VNĐ' : 'million VND'}
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
                                <option value="không yêu cầu">{t.noExp}</option>
                                <option value="dưới 1 năm">{language === 'vi' ? 'Dưới 1 năm' : 'Under 1 year'}</option>
                                <option value="1 năm">1 {language === 'vi' ? 'năm' : 'year'}</option>
                                <option value="2 năm">2 {language === 'vi' ? 'năm' : 'years'}</option>
                                <option value="3 năm">3 {language === 'vi' ? 'năm' : 'years'}</option>
                                <option value="4 năm">4 {language === 'vi' ? 'năm' : 'years'}</option>
                                <option value="4 năm trở lên">
                                    {language === 'vi' ? '4 năm trở lên' : '4+ years'}
                                </option>
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
                                <option value="full-time">Full-time</option>
                                <option value="part-time">Part-time</option>
                                <option value="internship">{language === 'vi' ? 'Thực tập' : 'Internship'}</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className={cx('jobs-section')}>
                <div className={cx('container')}>
                    {filteredJobs.length === 0 && allJobData.length > 0 && (
                        <p style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
                            {language === 'vi' ? 'Không tìm thấy việc làm phù hợp.' : 'No jobs found.'}
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
                                        <h3 className={cx('job-title')}>{job.title}</h3>
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
                                        <span>{job.typeLabel}</span>
                                    </div>
                                    <div className={cx('job-meta-item')}>
                                        <i className="fas fa-calendar-check"></i>
                                        <span>
                                            {language === 'vi' ? 'Hạn nộp:' : 'Deadline:'} {job.deadlineLabel}
                                        </span>
                                    </div>
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
                            disabled={currentPage === totalPages || totalPages === 0}
                        >
                            {t.next}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Homepage;
