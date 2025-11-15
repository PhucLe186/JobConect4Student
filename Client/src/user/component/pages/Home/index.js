import React, { useState } from 'react';
import classNames from 'classnames/bind';
import style from './Home.module.scss';
import LookJobsImg from '~/asset/img/LookJobs.png';

const cx = classNames.bind(style);

const Homepage = (props) => {
    const { companyFilter } = props;
    const [salaryValue, setSalaryValue] = useState(50);
    const [experience, setExperience] = useState('');
    const [location, setLocation] = useState('');
    const [jobType, setJobType] = useState('');
    const [language, setLanguage] = useState('vi');
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 3;

    const translations = {
        vi: {
            company: 'Công ty',
            jobs: 'Việc làm',
            community: 'Cộng đồng',
            contact: 'Liên hệ',
            signIn: 'Đăng nhập',
            signUp: 'Đăng ký',
            findJob: 'Tìm công việc mơ ước của bạn',
            searchPlaceholder: 'Tìm kiếm công việc, công ty hoặc từ khóa...',
            salaryRange: 'Mức lương',
            experienceLevel: 'Kinh nghiệm',
            workLocation: 'Địa điểm làm việc',
            jobType: 'Loại hình',
            chooseExp: 'Chọn kinh nghiệm',
            chooseLocation: 'Chọn địa điểm',
            chooseJobType: 'Chọn loại hình',
            noExp: 'Không cần kinh nghiệm',
            seeMore: 'Xem thêm',
            previous: 'Trước',
            next: 'Tiếp',
        },
        en: {
            company: 'Company',
            jobs: 'Jobs',
            community: 'Community',
            contact: 'Contact',
            signIn: 'Log In',
            signUp: 'Sign Up',
            findJob: 'Find Your Dream Job',
            searchPlaceholder: 'Search jobs, companies, or keywords...',
            salaryRange: 'Salary Range',
            experienceLevel: 'Experience Level',
            workLocation: 'Work Location',
            jobType: 'Job Type',
            chooseExp: 'Choose experience',
            chooseLocation: 'Choose location',
            chooseJobType: 'Choose job type',
            noExp: 'No experience required',
            seeMore: 'See more',
            previous: 'Previous',
            next: 'Next',
        },
    };
    const t = translations[language];
    const updateSalary = (value) => {
        setSalaryValue(value);
    };
    const handleExperienceChange = (e) => {
        setExperience(e.target.value);
    };
    const handleLocationChange = (e) => {
        setLocation(e.target.value);
    };
    const handleJobTypeChange = (e) => {
        setJobType(e.target.value);
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };
    const allJobData = [
        {
            logo: require('~/asset/img/LongThanh.png'),
            title: 'Dev',
            company: 'Công ty TNHH Long Thành',
            companyKey: 'longthanh',
        },
        { logo: require('~/asset/img/Samsung.png'), title: 'Junior', company: 'Công ty Samsung', companyKey: 'samsung' },
        { logo: require('~/asset/img/MB.png'), title: 'Software Engineer', company: 'Ngân hàng MB', companyKey: 'mb' },
        { logo: require('~/asset/img/NEC.png'), title: 'Senior AI Specialist', company: 'Công ty NEC', companyKey: 'nec' },
        { logo: require('~/asset/img/LG.png'), title: 'Electronics Development', company: 'Công ty LG', companyKey: 'lg' },
        { logo: require('~/asset/img/Naver.png'), title: 'Dev', company: 'Công ty Naver', companyKey: 'naver' },
        {
            logo: require('~/asset/img/Google.png'),
            title: 'Software Engineer',
            company: 'Công ty Google',
            companyKey: 'google',
        },
        {
            logo: require('~/asset/img/Microsoft.png'),
            title: 'Cloud Developer',
            company: 'Công ty Microsoft',
            companyKey: 'microsoft',
        },
        { logo: require('~/asset/img/Apple.png'), title: 'iOS Developer', company: 'Công ty Apple', companyKey: 'apple' },
    ];

    const jobData = companyFilter ? allJobData.filter((job) => job.companyKey === companyFilter) : allJobData;

    return (
        <div className={cx('home-page')}>
            {/* Hero Section */}
            <div className={cx('hero-section')}>
                <div className={cx('container')}>
                    <div className={cx('hero-content')}>
                        <div className={cx('hero-image')}>
                            <img src={LookJobsImg} alt="Job Search" />
                        </div>
                        <h1 className={cx('hero-title')}>{t.findJob}</h1>
                        <div className={cx('search-box')}>
                            <input type="text" className={cx('search-input')} placeholder={t.searchPlaceholder} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter Section */}
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
                                onChange={handleExperienceChange}
                            >
                                <option value="">{t.chooseExp}</option>
                                <option>{t.noExp}</option>
                                <option>1 - 2 {language === 'vi' ? 'năm' : 'years'}</option>
                                <option>3 - 4 {language === 'vi' ? 'năm' : 'years'}</option>
                                <option>4 - 5 {language === 'vi' ? 'năm' : 'years'}</option>
                            </select>
                        </div>
                        <div className={cx('filter-item')}>
                            <label>{t.workLocation}</label>
                            <select className={cx('filter-select')} value={location} onChange={handleLocationChange}>
                                <option value="">{t.chooseLocation}</option>
                                <option>{language === 'vi' ? 'Hà Nội' : 'Hanoi'}</option>
                                <option>{language === 'vi' ? 'Hồ Chí Minh' : 'Ho Chi Minh City'}</option>
                                <option>{language === 'vi' ? 'Đà Nẵng' : 'Da Nang'}</option>
                                <option>{language === 'vi' ? 'Cần Thơ' : 'Can Tho'}</option>
                                <option>{language === 'vi' ? 'Hải Phòng' : 'Hai Phong'}</option>
                            </select>
                        </div>
                        <div className={cx('filter-item')}>
                            <label>{t.jobType}</label>
                            <select className={cx('filter-select')} value={jobType} onChange={handleJobTypeChange}>
                                <option value="">{t.chooseJobType}</option>
                                <option>Full-time</option>
                                <option>Part-time</option>
                                <option>{language === 'vi' ? 'Thực tập' : 'Internship'}</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Jobs Grid */}
            <div className={cx('jobs-section')}>
                <div className={cx('container')}>
                    <div className={cx('jobs-grid')}>
                        {jobData.map((job, index) => (
                            <div className={cx('job-card')} key={index}>
                                <div className={cx('job-header')}>
                                    <img src={job.logo} alt={job.company} className={cx('company-logo')} />
                                    <div className={cx('job-info')}>
                                        <h3 className={cx('job-title')}>{job.title}</h3>
                                        <p className={cx('company-name')}>{job.company}</p>
                                    </div>
                                </div>
                                <button className={cx('apply-btn')}>{t.seeMore}</button>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className={cx('pagination-wrapper')}>
                        <button
                            className={cx('page-btn')}
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            {t.previous}
                        </button>
                        {[1, 2, 3].map((page) => (
                            <button
                                key={page}
                                className={cx('page-btn', { active: currentPage === page })}
                                onClick={() => handlePageChange(page)}
                            >
                                {page}
                            </button>
                        ))}
                        <button
                            className={cx('page-btn')}
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
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
