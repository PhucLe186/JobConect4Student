import React, { useState } from 'react';

const Homepage = (props) => {
    const { companyFilter } = props;
    const [salaryValue, setSalaryValue] = useState(50);
    const [experience, setExperience] = useState('');
    const [location, setLocation] = useState('');
    const [jobType, setJobType] = useState('');
    const [language, setLanguage] = useState('vi');
    const currentPage = 1;
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
    const allJobData = [
        { logo: 'LongThanh.png', title: 'Dev', company: 'Công ty TNHH Long Thành', companyKey: 'longthanh' },
        { logo: 'Samsung.png', title: 'Junior', company: 'Công ty Samsung', companyKey: 'samsung' },
        { logo: 'MB.png', title: 'Software Engineer', company: 'Ngân hàng MB', companyKey: 'mb' },
        { logo: 'NEC.png', title: 'Senior AI Specialist', company: 'Công ty NEC', companyKey: 'nec' },
        { logo: 'LG.png', title: 'Electronics Development', company: 'Công ty LG', companyKey: 'lg' },
        { logo: 'Naver.png', title: 'Dev', company: 'Công ty Naver', companyKey: 'naver' },
        {
            logo: 'Google.png',
            title: 'Software Engineer',
            company: 'Công ty Google',
            companyKey: 'google',
        },
        {
            logo: 'Microsoft.png',
            title: 'Cloud Developer',
            company: 'Công ty Microsoft',
            companyKey: 'microsoft',
        },
        { logo: 'Apple.png', title: 'iOS Developer', company: 'Công ty Apple', companyKey: 'apple' },
    ];

    const jobData = companyFilter ? allJobData.filter((job) => job.companyKey === companyFilter) : allJobData;

    return (
        <div>
            {!companyFilter && (
                <div className="container my-4 text-center">
                    <div className="banner-container">
                        <img src="LookJobs.png" className="shadow-sm" alt="banner" />
                    </div>
                </div>
            )}

            {companyFilter && (
                <div className="container mt-4 text-center">
                    <h2 style={{ color: '#007bff', marginBottom: '20px' }}>
                        {language === 'vi' ? 'Việc làm tại Samsung' : 'Jobs at Samsung'}
                    </h2>
                </div>
            )}

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
                                        <button type="button" className="btn btn-sm btn-outline-primary">
                                            {t.seeMore}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
                <nav aria-label="Page navigation" className="mt-4">
                    <ul className="pagination justify-content-center">
                        <li className="page-item">
                            <button
                                className="page-link"
                                onClick={() => props.onPageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                {t.previous}
                            </button>
                        </li>
                        <li className="page-item active">
                            <span className="page-link">1</span>
                        </li>
                        <li className="page-item">
                            <button className="page-link" onClick={() => props.onPageChange(2)}>
                                2
                            </button>
                        </li>
                        <li className="page-item">
                            <button className="page-link" onClick={() => props.onPageChange(3)}>
                                3
                            </button>
                        </li>
                        <li className="page-item">
                            <button
                                className="page-link"
                                onClick={() => props.onPageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                {t.next}
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default Homepage;
