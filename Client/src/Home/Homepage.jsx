import React, { useState } from 'react';
import './stylee.scss';
import './ZaloChat.scss';

const Homepage = () => {
    const [salaryValue, setSalaryValue] = useState(50);
    const [experience, setExperience] = useState('');
    const [location, setLocation] = useState('');
    const [jobType, setJobType] = useState('');
    const [language, setLanguage] = useState('vi');
    const [showZaloChat, setShowZaloChat] = useState(false);

    const translations = {
        vi: {
            company: 'Công ty',
            jobs: 'Việc làm',
            community: 'Cộng đồng',
            contact: 'Liên hệ',
            signIn: 'Đăng nhập',
            signUp: 'Đăng xuất',
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
            signUp: 'Log out',
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

    const openZaloChat = () => {
        // Thay 'YOUR_ZALO_NUMBER' bằng số Zalo thực của bạn
        const zaloNumber = '0943009243';
        const message =
            language === 'vi' ? 'Xin chào! Tôi cần hỗ trợ về việc làm.' : 'Hello! I need support about jobs.';

        // Mở Zalo chat trực tiếp
        const zaloUrl = `https://zalo.me/${zaloNumber}?text=${encodeURIComponent(message)}`;
        window.open(zaloUrl, '_blank');
    };

    const jobData = [
        { logo: 'LongThanh.png', title: 'Dev', company: 'Công ty TNHH Long Thành' },
        { logo: 'Samsung.png', title: 'Junior', company: 'Công ty Samsung' },
        { logo: 'MB.png', title: 'Software Engineer', company: 'Ngân hàng MB' },
        { logo: 'NEC.png', title: 'Senior AI Specialist', company: 'Công ty NEC' },
        { logo: 'LG.png', title: 'Electronics Development', company: 'Công ty LG' },
        { logo: 'Naver.png', title: 'Dev', company: 'Công ty Naver' },
        { logo: 'Google.png', title: 'Software Engineer', company: 'Công ty Google' },
        { logo: 'Microsoft.png', title: 'Cloud Developer', company: 'Công ty Microsoft' },
        { logo: 'Apple.png', title: 'iOS Developer', company: 'Công ty Apple' },
    ];

    return (
        <div>
            {/* Navbar */}
            <nav className="navbar navbar-expand-lg bg-white shadow-sm">
                <div className="container">
                    <a className="navbar-brand fw-bold text-primary" href="#">
                        JobConnect<span className="text-success">4Students</span>
                    </a>
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <a className="nav-link" href="#">
                                {t.company}
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">
                                {t.jobs}
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">
                                {t.community}
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">
                                {t.contact}
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="btn btn-primary me-2" href="#">
                                {t.signIn}
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="btn btn-primary" href="#">
                                {t.signUp}
                            </a>
                        </li>
                    </ul>
                    <button
                        className="btn btn-outline-secondary ms-3"
                        onClick={() => setLanguage(language === 'vi' ? 'en' : 'vi')}
                        style={{ padding: '6px 12px' }}
                    >
                        <img
                            src={language === 'vi' ? 'vietnam-flag.svg' : 'uk-flag.svg'}
                            alt={language === 'vi' ? 'VI' : 'EN'}
                            style={{ width: '20px', height: '14px' }}
                        />
                    </button>
                </div>
            </nav>

            {/* Banner */}
            <div className="container my-4 text-center">
                <div className="banner-container">
                    <img src="LookJobs.png" className="shadow-sm" alt="banner" />
                </div>
            </div>

            {/* Main Search Bar */}
            <div className="container">
                <div className="main-search text-center">
                    <h4 className="mb-4">{t.findJob}</h4>
                    <div className="row">
                        <div className="col-12">
                            <input type="text" className="form-control" placeholder={t.searchPlaceholder} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Search Bar */}
            <div className="container search-bar">
                <div className="row">
                    <div className="col-md-3">
                        <div className="salary-range">
                            <label className="form-label">{t.salaryRange}</label>
                            <input
                                type="range"
                                className="salary-slider"
                                min="0"
                                max="100"
                                value={salaryValue}
                                onChange={(e) => updateSalary(e.target.value)}
                            />
                            <div className="salary-display">
                                0 - {salaryValue} {language === 'vi' ? 'triệu VNĐ' : 'million VND'}
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <label className="form-label">{t.experienceLevel}</label>
                        <select className="form-select" value={experience} onChange={handleExperienceChange}>
                            <option value="">{t.chooseExp}</option>
                            <option>{t.noExp}</option>
                            <option>1 - 2 {language === 'vi' ? 'năm' : 'years'}</option>
                            <option>3 - 4 {language === 'vi' ? 'năm' : 'years'}</option>
                            <option>4 - 5 {language === 'vi' ? 'năm' : 'years'}</option>
                        </select>
                    </div>
                    <div className="col-md-3">
                        <label className="form-label">{t.workLocation}</label>
                        <select className="form-select" value={location} onChange={handleLocationChange}>
                            <option value="">{t.chooseLocation}</option>
                            <option>{language === 'vi' ? 'Hà Nội' : 'Hanoi'}</option>
                            <option>{language === 'vi' ? 'Hồ Chí Minh' : 'Ho Chi Minh City'}</option>
                            <option>{language === 'vi' ? 'Đà Nẵng' : 'Da Nang'}</option>
                            <option>{language === 'vi' ? 'Cần Thơ' : 'Can Tho'}</option>
                            <option>{language === 'vi' ? 'Hải Phòng' : 'Hai Phong'}</option>
                        </select>
                    </div>
                    <div className="col-md-3">
                        <label className="form-label">{t.jobType}</label>
                        <select className="form-select" value={jobType} onChange={handleJobTypeChange}>
                            <option value="">{t.chooseJobType}</option>
                            <option>Full-time</option>
                            <option>Part-time</option>
                            <option>{language === 'vi' ? 'Thực tập' : 'Internship'}</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Job Listings */}
            <div className="container mt-4">
                {[0, 3, 6].map((startIndex) => (
                    <div className="row" key={startIndex}>
                        {jobData.slice(startIndex, startIndex + 3).map((job, index) => (
                            <div className="col-md-4" key={index}>
                                <div className="job-card d-flex align-items-center">
                                    <img src={job.logo} alt="logo" />
                                    <div className="job-info">
                                        <h6>{job.title}</h6>
                                        <p>{job.company}</p>
                                        <button className="btn btn-sm btn-outline-primary">{t.seeMore}</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}

                <nav aria-label="Page navigation">
                    <ul className="pagination justify-content-center">
                        <li className="page-item disabled">
                            <a className="page-link" href="#" tabIndex="-1">
                                {t.previous}
                            </a>
                        </li>
                        <li className="page-item active">
                            <a className="page-link" href="#">
                                1
                            </a>
                        </li>
                        <li className="page-item">
                            <a className="page-link" href="#">
                                2
                            </a>
                        </li>
                        <li className="page-item">
                            <a className="page-link" href="#">
                                3
                            </a>
                        </li>
                        <li className="page-item">
                            <a className="page-link" href="#">
                                {t.next}
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>

            {/* Zalo Chat Widget */}
            <div className={`zalo-chat-widget ${showZaloChat ? 'open' : ''}`}>
                <div className="zalo-chat-button" onClick={openZaloChat}>
                    <img src="zalo-logo.svg" alt="Zalo" style={{ width: '28px', height: '28px' }} />
                </div>
                {showZaloChat && (
                    <div className="zalo-chat-window">
                        <div className="zalo-chat-header">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <img src="zalo-logo.svg" alt="Zalo" style={{ width: '20px', height: '20px' }} />
                                <span>Zalo - {language === 'vi' ? 'Chat với chúng tôi' : 'Chat with us'}</span>
                            </div>
                            <button onClick={() => setShowZaloChat(false)}>&times;</button>
                        </div>
                        <div className="zalo-chat-body">
                            <div className="zalo-message">
                                <p>
                                    {language === 'vi'
                                        ? 'Xin chào! Chúng tôi có thể giúp gì cho bạn?'
                                        : 'Hello! How can we help you?'}
                                </p>
                            </div>
                        </div>
                        <div className="zalo-chat-footer">
                            <input
                                type="text"
                                placeholder={language === 'vi' ? 'Nhập tin nhắn...' : 'Type a message...'}
                            />
                            <button>{language === 'vi' ? 'Gửi' : 'Send'}</button>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <footer>
                <div className="container text-center">
                    <h5 className="fw-bold text-primary">
                        JobConnect <span className="text-success">4Students</span>
                    </h5>
                    <p>497 Hoa Hao Street, Ward 7, District 10, Ho Chi Minh City</p>
                    <p>
                        Hotline : 0943009243 |{' '}
                        <button
                            onClick={openZaloChat}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#007bff',
                                textDecoration: 'underline',
                                cursor: 'pointer',
                            }}
                        >
                            Chat Zalo: 0943009243
                        </button>
                    </p>
                    <div className="mt-2">
                        <a href="#">Facebook</a> · <a href="#">Instagram</a> ·<a href="#">YouTube</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Homepage;
