import React, { useState } from 'react';
import classNames from 'classnames/bind';
import style from './CompanyDetail.module.scss';
const cx = classNames.bind(style);

const CompanyDetail = ({ onPageChange }) => {
    const [language, setLanguage] = useState('vi');

    const translations = {
        vi: {
            company: 'Công ty',
            jobs: 'Việc làm',
            community: 'Cộng đồng',
            contact: 'Liên hệ',
            signIn: 'Đăng nhập',
            signUp: 'Đăng ký',
            back: 'Quay lại',
            companyInfo: 'Thông tin công ty',
            address: 'Địa chỉ',
            size: 'Quy mô',
            website: 'Website',
            jobOpenings: 'Vị trí đang tuyển',
            salary: 'Mức lương',
            viewDetails: 'Xem chi tiết',
            apply: 'Ứng tuyển',
        },
        en: {
            company: 'Company',
            jobs: 'Jobs',
            community: 'Community',
            contact: 'Contact',
            signIn: 'Log In',
            signUp: 'Sign Up',
            back: 'Back',
            companyInfo: 'Company Information',
            address: 'Address',
            size: 'Size',
            website: 'Website',
            jobOpenings: 'Job Openings',
            salary: 'Salary',
            viewDetails: 'View Details',
            apply: 'Apply',
        },
    };

    const t = translations[language];

    const handleLogin = () => {
        window.location.href = 'http://localhost:3002?mode=login';
    };

    const handleSignup = () => {
        window.location.href = 'http://localhost:3002?mode=signup';
    };

    const jobOpenings = [
        {
            title: 'Software Engineer',
            salary: '15-25 triệu VNĐ',
            description: 'Phát triển ứng dụng mobile và web',
            requirements: 'React, Node.js, 2+ năm kinh nghiệm',
        },
        {
            title: 'Product Manager',
            salary: '20-35 triệu VNĐ',
            description: 'Quản lý sản phẩm và chiến lược',
            requirements: 'MBA, 3+ năm kinh nghiệm PM',
        },
        {
            title: 'UI/UX Designer',
            salary: '12-20 triệu VNĐ',
            description: 'Thiết kế giao diện người dùng',
            requirements: 'Figma, Adobe XD, portfolio mạnh',
        },
        {
            title: 'Data Analyst',
            salary: '18-28 triệu VNĐ',
            description: 'Phân tích dữ liệu và báo cáo',
            requirements: 'SQL, Python, Excel nâng cao',
        },
    ];

    return (
        <div>
            <div className={cx('container mt-4')}>
                <button className={cx('btn btn-secondary mb-3')} onClick={() => onPageChange('company')}>
                    <i className={cx('fa-solid fa-arrow-left me-2')}></i>
                    {t.back}
                </button>

                <div className={cx('company-detail-card')}>
                    <div className={cx('company-header')}>
                        <div className={cx('d-flex align-items-center mb-4')}>
                            <img src="Samsung.png" alt="Samsung" className={cx('company-logo')} />
                            <div className={cx('company-basic-info')}>
                                <h1>Samsung Vietnam</h1>
                                <p className={cx('company-industry')}>Technology - Electronics</p>
                                <div className={cx('company-rating')}>
                                    <span className={cx('rating-stars')}>
                                        <i className={cx('fa-solid fa-star')}></i>
                                        <i className={cx('fa-solid fa-star')}></i>
                                        <i className={cx('fa-solid fa-star')}></i>
                                        <i className={cx('fa-solid fa-star')}></i>
                                        <i className={cx('fa-regular fa-star')}></i>
                                    </span>
                                    <span className={cx('rating-text')}>4.2/5 (1,234 reviews)</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={cx('row')}>
                        <div className={cx('col-md-8')}>
                            <div className={cx('company-description')}>
                                <h4>About Samsung Vietnam</h4>
                                <p>
                                    Samsung Vietnam is a leading technology company specializing in consumer
                                    electronics, semiconductors, and digital media technologies. We are committed to
                                    creating innovative products that enhance people's lives and contribute to a better
                                    world.
                                </p>
                                <p>
                                    With over 10,000 employees across Vietnam, we offer exciting career opportunities in
                                    various fields including engineering, design, marketing, and business development.
                                </p>
                            </div>

                            <div className={cx('job-openings')}>
                                <h4>{t.jobOpenings}</h4>
                                <div className={cx('job-list')}>
                                    {jobOpenings.map((job, index) => (
                                        <div key={index} className={cx('job-item')}>
                                            <div className={cx('job-header')}>
                                                <h5>{job.title}</h5>
                                                <span className={cx('job-salary')}>{job.salary}</span>
                                            </div>
                                            <p className={cx('job-description')}>{job.description}</p>
                                            <p className={cx('job-requirements')}>
                                                <strong>Requirements:</strong> {job.requirements}
                                            </p>
                                            <div className={cx('job-actions')}>
                                                <button
                                                    className={cx('btn', 'btn-outline-primary', 'btn-sm', 'me-2')}
                                                    onClick={() => onPageChange('job')}
                                                >
                                                    {t.viewDetails}
                                                </button>
                                                <button className={cx('btn', 'btn-primary', 'btn-sm')}>
                                                    {t.apply}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className={cx('col-md-4')}>
                            <div className={cx('company-sidebar')}>
                                <div className={cx('company-info')}>
                                    <h4>{t.companyInfo}</h4>
                                    <div className={cx('info-item')}>
                                        <i className={cx('fa-solid fa-location-dot')}></i>
                                        <div>
                                            <strong>{t.address}:</strong>
                                            <p>Samsung Tower, 28 Nguyen Hue Blvd, District 1, Ho Chi Minh City</p>
                                        </div>
                                    </div>
                                    <div className={cx('info-item')}>
                                        <i className={cx('fa-solid fa-users')}></i>
                                        <div>
                                            <strong>{t.size}:</strong>
                                            <p>10,000+ employees</p>
                                        </div>
                                    </div>
                                    <div className={cx('info-item')}>
                                        <i className={cx('fa-solid fa-globe')}></i>
                                        <div>
                                            <strong>{t.website}:</strong>
                                            <p>
                                                <a
                                                    href="https://www.samsung.com"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    www.samsung.com
                                                </a>
                                            </p>
                                        </div>
                                    </div>
                                    <div className={cx('info-item')}>
                                        <i className={cx('fa-solid fa-calendar')}></i>
                                        <div>
                                            <strong>Founded:</strong>
                                            <p>1969</p>
                                        </div>
                                    </div>
                                </div>

                                <div className={cx('company-benefits')}>
                                    <h5>Benefits & Perks</h5>
                                    <ul>
                                        <li>
                                            <i className={cx('fa-solid fa-check')}></i> Competitive salary
                                        </li>
                                        <li>
                                            <i className={cx('fa-solid fa-check')}></i> Health insurance
                                        </li>
                                        <li>
                                            <i className={cx('fa-solid fa-check')}></i> Annual bonus
                                        </li>
                                        <li>
                                            <i className={cx('fa-solid fa-check')}></i> Training programs
                                        </li>
                                        <li>
                                            <i className={cx('fa-solid fa-check')}></i> Flexible working hours
                                        </li>
                                        <li>
                                            <i className={cx('fa-solid fa-check')}></i> Career development
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyDetail;
