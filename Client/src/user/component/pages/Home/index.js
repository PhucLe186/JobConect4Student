import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import style from './Home.module.scss';
import LookJobsImg from '~/asset/img/LookJobs.png';
import translations from '~/component/Translation';
import { AuthContext } from '~/context/AuthContext';

const cx = classNames.bind(style);

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
    const JobPerPages = 9;

    // Filter jobs based on search and filters
    const filteredJobs = allJobData.filter(job => {
        const matchesSearch = !searchKeyword || 
            job.title?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
            job.company_name?.toLowerCase().includes(searchKeyword.toLowerCase());
        
        const matchesExperience = !experience || job.experience === experience;
        const matchesLocation = !location || job.location?.includes(location);
        const matchesJobType = !jobType || job.job_type === jobType;
        
        return matchesSearch && matchesExperience && matchesLocation && matchesJobType;
    });

    const totalJob = filteredJobs.length;
    const totalPages = Math.ceil(totalJob / JobPerPages);
    const startIndex = (currentPage - 1) * JobPerPages;
    const finalJobPage = filteredJobs.slice(startIndex, startIndex + JobPerPages);

    const t = translations[language || 'vi'];
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
                if (res.data && res.data.length > 0) {
                    setAllJobData(res.data);
                } else {
                    // Nếu API trả về rỗng, dùng mock data
                    setAllJobData(getMockJobs());
                }
            } catch (error) {
                console.error('API Error:', error);
                // Khi API lỗi, dùng mock data thay vì hiện alert
                setAllJobData(getMockJobs());
            }
        };
        fetchData();
    }, [api]);

    const getMockJobs = () => [
        {
            id: '1',
            title: 'Frontend Developer',
            company_name: 'FPT Software',
            location: 'Hà Nội',
            experience: '1-3 năm',
            job_type: 'full-time',
            logo: 'https://cdn.haitrieu.com/wp-content/uploads/2022/01/Logo-FPT-Software.png'
        },
        {
            id: '2', 
            title: 'Backend Developer',
            company_name: 'Viettel Group',
            location: 'Hồ Chí Minh',
            experience: '2-4 năm',
            job_type: 'full-time',
            logo: 'https://cdn.haitrieu.com/wp-content/uploads/2021/11/Logo-Viettel.png'
        },
        {
            id: '3',
            title: 'Mobile Developer',
            company_name: 'VNG Corporation',
            location: 'Hồ Chí Minh',
            experience: '1-2 năm',
            job_type: 'full-time',
            logo: 'https://cdn.haitrieu.com/wp-content/uploads/2022/01/Logo-VNG.png'
        },
        {
            id: '4',
            title: 'DevOps Engineer',
            company_name: 'Shopee Vietnam',
            location: 'Hà Nội',
            experience: '3-5 năm',
            job_type: 'full-time',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Shopee.svg/200px-Shopee.svg.png'
        },
        {
            id: '5',
            title: 'Data Analyst',
            company_name: 'Grab Vietnam',
            location: 'Hồ Chí Minh',
            experience: '1-3 năm',
            job_type: 'full-time',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Grab_%28application%29_logo.svg/200px-Grab_%28application%29_logo.svg.png'
        },
        {
            id: '6',
            title: 'UI/UX Designer',
            company_name: 'Tiki',
            location: 'Hà Nội',
            experience: '2-4 năm',
            job_type: 'full-time',
            logo: 'https://cdn.haitrieu.com/wp-content/uploads/2022/01/Logo-Tiki.png'
        },
        {
            id: '7',
            title: 'Product Manager',
            company_name: 'MoMo',
            location: 'Hồ Chí Minh',
            experience: '3-5 năm',
            job_type: 'full-time',
            logo: 'https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-MoMo-Square.png'
        },
        {
            id: '8',
            title: 'QA Engineer',
            company_name: 'Techcombank',
            location: 'Hà Nội',
            experience: '1-3 năm',
            job_type: 'full-time',
            logo: 'https://cdn.haitrieu.com/wp-content/uploads/2022/01/Logo-Techcombank-TCB.png'
        },
        {
            id: '9',
            title: 'Business Analyst',
            company_name: 'Vinamilk',
            location: 'Hồ Chí Minh',
            experience: '2-4 năm',
            job_type: 'full-time',
            logo: 'https://cdn.haitrieu.com/wp-content/uploads/2022/01/Logo-Vinamilk.png'
        },
        {
            id: '10',
            title: 'Software Engineer',
            company_name: 'Samsung Vietnam',
            location: 'Hà Nội',
            experience: '2-5 năm',
            job_type: 'full-time',
            logo: 'https://logo.clearbit.com/samsung.com'
        },
        {
            id: '11',
            title: 'Marketing Specialist',
            company_name: 'Lazada Vietnam',
            location: 'Hồ Chí Minh',
            experience: '1-3 năm',
            job_type: 'full-time',
            logo: 'https://cdn.haitrieu.com/wp-content/uploads/2022/01/Logo-Lazada.png'
        },
        {
            id: '12',
            title: 'Sales Manager',
            company_name: 'Vingroup',
            location: 'Hà Nội',
            experience: '3-5 năm',
            job_type: 'full-time',
            logo: 'https://cdn.haitrieu.com/wp-content/uploads/2022/01/Logo-Vingroup.png'
        }
    ];

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

            {/* Jobs Grid */}
            <div className={cx('jobs-section')}>
                <div className={cx('container')}>
                    {filteredJobs.length === 0 && searchKeyword && (
                        <p style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
                            {language === 'vi' ? 'Không tìm thấy việc làm phù hợp.' : 'No jobs found.'}
                        </p>
                    )}
                    <div className={cx('jobs-grid')}>
                        {finalJobPage.map((job, index) => (
                            <div className={cx('job-card')} key={index}>
                                <div className={cx('job-header')}>
                                    <img 
                                        src={job.logo || 'https://via.placeholder.com/60x60?text=Logo'} 
                                        alt={job.company} 
                                        className={cx('company-logo')} 
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/60x60?text=' + (job.company_name?.charAt(0) || 'C');
                                        }}
                                    />
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