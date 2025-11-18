import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import style from './Home.module.scss';
import LookJobsImg from '~/asset/img/LookJobs.png';
import routesconfig from '~/config/routes';
import { v4 as uuidv4 } from 'uuid';
// Import company logos
import LongThanhLogo from '~/asset/img/LongThanh.png';
import SamsungLogo from '~/asset/img/Samsung.png';
import MBLogo from '~/asset/img/MB.png';
import NECLogo from '~/asset/img/NEC.png';
import LGLogo from '~/asset/img/LG.png';
import NaverLogo from '~/asset/img/Naver.png';
import GoogleLogo from '~/asset/img/Google.png';
import MicrosoftLogo from '~/asset/img/Microsoft.png';
import AppleLogo from '~/asset/img/Apple.png';
import IBMLogo from '~/asset/img/IBM.png';
import AWSLogo from '~/asset/img/AWS.png';
import ShopeeLogo from '~/asset/img/Shopee.png';
import OracleLogo from '~/asset/img/Oracle.png';
import GrabLogo from '~/asset/img/Grab.png';
import NetflixLogo from '~/asset/img/Netflix.png';
import AdobeLogo from '~/asset/img/Adobe.png';
import TikTokLogo from '~/asset/img/TikTok.png';
import VisaLogo from '~/asset/img/Visa.png';

const cx = classNames.bind(style);

const Homepage = (props) => {
    const { companyFilter } = props;
    const navigate = useNavigate();
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

    const allJobData = {
        1: [
            {
                id: uuidv4(),
                logo: LongThanhLogo,
                title: 'Dev',
                company: 'Công ty TNHH Long Thành',
                companyKey: 'longthanh',
            },
            {
                id: uuidv4(),
                logo: SamsungLogo,
                title: 'Junior',
                company: 'Công ty Samsung',
                companyKey: 'samsung',
            },
            {
                id: uuidv4(),
                logo: MBLogo,
                title: 'Software Engineer',
                company: 'Ngân hàng MB',
                companyKey: 'mb',
            },
            {
                id: uuidv4(),
                logo: NECLogo,
                title: 'Senior AI Specialist',
                company: 'Công ty NEC',
                companyKey: 'nec',
            },
            {
                id: uuidv4(),
                logo: LGLogo,
                title: 'Electronics Development',
                company: 'Công ty LG',
                companyKey: 'lg',
            },
            {
                id: uuidv4(),
                logo: NaverLogo,
                title: 'Dev',
                company: 'Công ty Naver',
                companyKey: 'naver',
            },
            {
                id: uuidv4(),
                logo: GoogleLogo,
                title: 'Software Engineer',
                company: 'Công ty Google',
                companyKey: 'google',
            },
            {
                id: uuidv4(),
                logo: MicrosoftLogo,
                title: 'Cloud Developer',
                company: 'Công ty Microsoft',
                companyKey: 'microsoft',
            },
            {
                id: uuidv4(),
                logo: AppleLogo,
                title: 'iOS Developer',
                company: 'Công ty Apple',
                companyKey: 'apple',
            },
        ],
        2: [
            {
                id: uuidv4(),
                logo: IBMLogo,
                title: 'Backend Developer',
                company: 'Tập đoàn IBM',
                companyKey: 'ibm',
            },
            {
                id: uuidv4(),
                logo: AWSLogo,
                title: 'Cloud Engineer',
                company: 'Amazon Web Services',
                companyKey: 'aws',
            },
            {
                id: uuidv4(),
                logo: ShopeeLogo,
                title: 'Data Analyst',
                company: 'Shopee Việt Nam',
                companyKey: 'shopee',
            },
            {
                id: uuidv4(),
                logo: OracleLogo,
                title: 'Database Developer',
                company: 'Oracle Việt Nam',
                companyKey: 'oracle',
            },
            {
                id: uuidv4(),
                logo: GrabLogo,
                title: 'Mobile Developer',
                company: 'Grab Việt Nam',
                companyKey: 'grab',
            },
            {
                id: uuidv4(),
                logo: NetflixLogo,
                title: 'Frontend Developer',
                company: 'Netflix Technology',
                companyKey: 'netflix',
            },
            {
                id: uuidv4(),
                logo: AdobeLogo,
                title: 'Product Manager',
                company: 'Adobe Systems',
                companyKey: 'adobe',
            },
            {
                id: uuidv4(),
                logo: TikTokLogo,
                title: 'DevOps Engineer',
                company: 'TikTok Technology',
                companyKey: 'tiktok',
            },
            {
                id: uuidv4(),
                logo: VisaLogo,
                title: 'Security Engineer',
                company: 'Visa Inc.',
                companyKey: 'visa',
            },
        ],
        3: [
            {
                id: uuidv4(),
                logo: IBMLogo,
                title: 'AI Specialist',
                company: 'Tập đoàn IBM',
                companyKey: 'ibm',
            },
            {
                id: uuidv4(),
                logo: AWSLogo,
                title: 'Solutions Architect',
                company: 'Amazon Web Services',
                companyKey: 'aws',
            },
            {
                id: uuidv4(),
                logo: ShopeeLogo,
                title: 'Business Analyst',
                company: 'Shopee Việt Nam',
                companyKey: 'shopee',
            },
            {
                id: uuidv4(),
                logo: OracleLogo,
                title: 'System Administrator',
                company: 'Oracle Việt Nam',
                companyKey: 'oracle',
            },
            {
                id: uuidv4(),
                logo: GrabLogo,
                title: 'Product Designer',
                company: 'Grab Việt Nam',
                companyKey: 'grab',
            },
            {
                id: uuidv4(),
                logo: NetflixLogo,
                title: 'Content Engineer',
                company: 'Netflix Technology',
                companyKey: 'netflix',
            },
            {
                id: uuidv4(),
                logo: AdobeLogo,
                title: 'UX Designer',
                company: 'Adobe Systems',
                companyKey: 'adobe',
            },
            {
                id: uuidv4(),
                logo: TikTokLogo,
                title: 'Algorithm Engineer',
                company: 'TikTok Technology',
                companyKey: 'tiktok',
            },
            {
                id: uuidv4(),
                logo: VisaLogo,
                title: 'Payment Specialist',
                company: 'Visa Inc.',
                companyKey: 'visa',
            },
        ],
    };

    const currentJobData = allJobData[currentPage] || [];
    const jobData = companyFilter ? currentJobData.filter((job) => job.companyKey === companyFilter) : currentJobData;

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
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                        >
                            {t.previous}
                        </button>
                        {[1, 2, 3].map((page) => (
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
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
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
