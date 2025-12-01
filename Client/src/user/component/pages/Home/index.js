import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import style from './Home.module.scss';
import LookJobsImg from '~/asset/img/LookJobs.png';
// Import company logos
import translations from '~/component/Translation';
import { AuthContext } from '~/context/AuthContext';

const cx = classNames.bind(style);

const Homepage = () => {
    const navigate = useNavigate();
    const { api, language } = useContext(AuthContext);
    const [salaryValue, setSalaryValue] = useState(50);
    const [allJobData, setAllJobData] = useState([]);
    const [experience, setExperience] = useState('');
    const [location, setLocation] = useState('');
    const [jobType, setJobType] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const JobPerPages = 9;

    const totalJob = allJobData.length;
    const totalPages = Math.ceil(totalJob / JobPerPages);
    const startIndex = (currentPage - 1) * JobPerPages;
    const EndIndex = startIndex + JobPerPages;
    const finalJobPage = allJobData.slice(startIndex, EndIndex);

    const t = translations[language || 'vi'];
    const updateSalary = (value) => {
        setSalaryValue(value);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get('jobs');
                if (res.data) {
                    setAllJobData(res.data);
                }
            } catch (error) {
                if (error.response) {
                    alert(error.response?.data?.message);
                } else {
                    alert('lỗi kết nối tới server');
                }
            }
        };
        fetchData();
    }, [api]);

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
                                onChange={(e) => setExperience(e.target.value)}
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
                            <select 
                                className={cx('filter-select')} 
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            >
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
                            <select 
                                className={cx('filter-select')} 
                                value={jobType}
                                onChange={(e) => setJobType(e.target.value)}
                            >
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
                        {finalJobPage.map((job, index) => (
                            <div className={cx('job-card')} key={index}>
                                <div className={cx('job-header')}>
                                    <img src={job.logo} alt={job.company} className={cx('company-logo')} />
                                    <div className={cx('job-info')}>
                                        <h3 className={cx('job-title')}>{job.title}</h3>
                                        <p className={cx('company-name')}>{job.company_name}</p>
                                    </div>
                                </div>
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

                    {/* Pagination */}
                    <div className={cx('pagination-wrapper')}>
                        <button
                            className={cx('page-btn')}
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            {t.previous}
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
                </div>
            </div>
        </div>
    );
};

export default Homepage;
