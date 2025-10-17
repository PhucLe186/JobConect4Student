import React, { useState } from 'react';
import './stylee.scss';

const Company = ({ onPageChange }) => {
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
            findCompany: 'Tìm công ty mơ ước của bạn',
            searchPlaceholder: 'Tìm kiếm công ty, ngành nghề hoặc từ khóa...',
            seeMore: 'Xem thêm',
            back: 'Quay lại',
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
            findCompany: 'Find Your Dream Company',
            searchPlaceholder: 'Search companies, industries, or keywords...',
            seeMore: 'See more',
            back: 'Back',
            previous: 'Previous',
            next: 'Next',
        },
    };

    const t = translations[language];

    const handleLogin = () => {
        window.location.href = 'http://localhost:3002?mode=login';
    };

    const handleSignup = () => {
        window.location.href = 'http://localhost:3002?mode=signup';
    };

    const allCompanyData = {
        1: [
            {
                logo: 'LongThanh.png',
                name: language === 'vi' ? 'Tập đoàn Long Thành' : 'Long Thanh Corp',
                industry: language === 'vi' ? 'Xây dựng' : 'Construction',
            },
            {
                logo: 'Samsung.png',
                name: language === 'vi' ? 'Samsung Việt Nam' : 'Samsung Vietnam',
                industry: language === 'vi' ? 'Công nghệ' : 'Technology',
            },
            {
                logo: 'MB.png',
                name: language === 'vi' ? 'Ngân hàng MB' : 'MB Bank',
                industry: language === 'vi' ? 'Tài chính' : 'Finance',
            },
            {
                logo: 'NEC.png',
                name: language === 'vi' ? 'Công ty NEC' : 'NEC Corporation',
                industry: language === 'vi' ? 'Công nghệ' : 'Technology',
            },
            {
                logo: 'LG.png',
                name: language === 'vi' ? 'Công ty LG' : 'LG Electronics',
                industry: language === 'vi' ? 'Điện tử' : 'Electronics',
            },
            {
                logo: 'Naver.png',
                name: language === 'vi' ? 'Công ty Naver' : 'Naver Corporation',
                industry: language === 'vi' ? 'Công nghệ' : 'Technology',
            },
            {
                logo: 'Google.png',
                name: language === 'vi' ? 'Công ty Google' : 'Google Inc',
                industry: language === 'vi' ? 'Công nghệ' : 'Technology',
            },
            {
                logo: 'Microsoft.png',
                name: language === 'vi' ? 'Công ty Microsoft' : 'Microsoft Corp',
                industry: language === 'vi' ? 'Công nghệ' : 'Technology',
            },
            {
                logo: 'Apple.png',
                name: language === 'vi' ? 'Công ty Apple' : 'Apple Inc',
                industry: language === 'vi' ? 'Công nghệ' : 'Technology',
            },
        ],
    };

    const companyData = allCompanyData[currentPage] || [];

    return (
        <div>
            <div className="container my-4 text-center">
                <div className="banner-container">
                    <img src="LookJobs.png" className="shadow-sm" alt="banner" />
                </div>
            </div>

            <div className="container">
                <div className="main-search text-center">
                    <h4 className="mb-4">{t.findCompany}</h4>
                    <div className="row">
                        <div className="col-12">
                            <input type="text" className="form-control" placeholder={t.searchPlaceholder} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mt-4">
                {[0, 3, 6].map((startIndex) => (
                    <div className="row" key={startIndex}>
                        {companyData.slice(startIndex, startIndex + 3).map((company, index) => (
                            <div className="col-md-4" key={index}>
                                <div className="job-card d-flex align-items-center">
                                    <img
                                        src={company.logo}
                                        alt="logo"
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/50x50?text=Logo';
                                        }}
                                    />
                                    <div className="job-info">
                                        <h6>{company.name}</h6>
                                        <p>{company.industry}</p>
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline-primary"
                                            onClick={() => {
                                                if (company.name.includes('Samsung')) {
                                                    onPageChange('companyDetail');
                                                }
                                            }}
                                        >
                                            {t.seeMore}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Company;
