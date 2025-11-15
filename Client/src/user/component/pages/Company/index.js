import React, { useState } from 'react';

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
        2: [
            {
                logo: 'IBM.png',
                name: language === 'vi' ? 'Tập đoàn IBM' : 'IBM Corporation',
                industry: language === 'vi' ? 'Công nghệ' : 'Technology',
            },
            {
                logo: 'AWS.png',
                name: language === 'vi' ? 'Dịch vụ Web Amazon' : 'Amazon Web Services',
                industry: language === 'vi' ? 'Đám mây' : 'Cloud',
            },
            {
                logo: 'Shopee.png',
                name: language === 'vi' ? 'Shopee Việt Nam' : 'Shopee Vietnam',
                industry: language === 'vi' ? 'Thương mại điện tử' : 'E-commerce',
            },
            {
                logo: 'Oracle.png',
                name: language === 'vi' ? 'Oracle Việt Nam' : 'Oracle Vietnam',
                industry: language === 'vi' ? 'Cơ sở dữ liệu' : 'Database',
            },
            {
                logo: 'Grab.png',
                name: language === 'vi' ? 'Grab Việt Nam' : 'Grab Vietnam',
                industry: language === 'vi' ? 'Giao thông' : 'Transportation',
            },
            {
                logo: 'Netflix.png',
                name: language === 'vi' ? 'Công nghệ Netflix' : 'Netflix Technology',
                industry: language === 'vi' ? 'Giải trí' : 'Entertainment',
            },
            {
                logo: 'Adobe.png',
                name: language === 'vi' ? 'Hệ thống Adobe' : 'Adobe Systems',
                industry: language === 'vi' ? 'Phần mềm' : 'Software',
            },
            {
                logo: 'TikTok.png',
                name: language === 'vi' ? 'Công nghệ TikTok' : 'TikTok Technology',
                industry: language === 'vi' ? 'Mạng xã hội' : 'Social Media',
            },
            {
                logo: 'Visa.png',
                name: 'Visa Inc.',
                industry: language === 'vi' ? 'Thanh toán' : 'Payment',
            },
        ],
        3: [
            {
                logo: 'Dược.png',
                name: language === 'vi' ? 'Công Ty Cổ phần Tâm Dược' : 'Tam Duoc JSC',
                industry: language === 'vi' ? 'Dược phẩm' : 'Pharmaceutical',
            },
            {
                logo: 'Longhai.png',
                name: language === 'vi' ? 'Công ty Bất động sản Long Hải' : 'Long Hai Real Estate',
                industry: language === 'vi' ? 'Bất động sản' : 'Real Estate',
            },
            {
                logo: 'Chungphat.png',
                name: language === 'vi' ? 'Công Ty Chung Phát' : 'Chung Phat Company',
                industry: language === 'vi' ? 'Dịch vụ' : 'Services',
            },
            {
                logo: 'Kaiyi.png',
                name: language === 'vi' ? 'Công Ty Đầu tư Quốc tế Kaiyi' : 'Kaiyi International Investment',
                industry: language === 'vi' ? 'Đầu tư' : 'Investment',
            },
            {
                logo: 'Xaydung.png',
                name: language === 'vi' ? 'Công Ty Cổ phần Xây Dựng Số 5' : 'Construction Company No.5 JSC',
                industry: language === 'vi' ? 'Xây dựng' : 'Construction',
            },
            {
                logo: 'HPL.png',
                name: language === 'vi' ? 'Công Ty Du lịch HPLS' : 'HPLS Tourism Company',
                industry: language === 'vi' ? 'Du lịch' : 'Tourism',
            },
            {
                logo: 'LongThanh.png',
                name: language === 'vi' ? 'Tập đoàn Long Thành' : 'Long Thanh Corp',
                industry: language === 'vi' ? 'Kế toán' : 'Accounting',
            },
            {
                logo: 'Samsung.png',
                name: language === 'vi' ? 'Samsung Display' : 'Samsung Display',
                industry: language === 'vi' ? 'Màn hình' : 'Display',
            },
            {
                logo: 'MB.png',
                name: language === 'vi' ? 'MB Ageas Life' : 'MB Ageas Life',
                industry: language === 'vi' ? 'Bảo hiểm' : 'Insurance',
            },
        ],
    };

    const companyData = allCompanyData[currentPage] || [];

    return (
        <div>
            <nav style={{ background: 'white', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)', padding: '15px 0' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <a href="#" style={{ fontSize: '24px', fontWeight: 'bold', textDecoration: 'none' }}>
                        <span style={{ color: '#007bff' }}>JobConnect</span>
                        <span style={{ color: '#28a745' }}>4Students</span>
                    </a>
                    <div style={{ display: 'flex', listStyle: 'none', margin: 0, padding: 0, gap: '20px', alignItems: 'center' }}>
                        <a href="#" style={{ textDecoration: 'none', color: '#333', padding: '8px 12px' }}>{t.company}</a>
                        <a href="#" style={{ textDecoration: 'none', color: '#333', padding: '8px 12px' }}>{t.jobs}</a>
                        <a href="#" style={{ textDecoration: 'none', color: '#333', padding: '8px 12px' }}>{t.community}</a>
                        <a href="#" style={{ textDecoration: 'none', color: '#333', padding: '8px 12px' }}>{t.contact}</a>
                        <button onClick={handleLogin} style={{ padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer', background: '#007bff', color: 'white' }}>{t.signIn}</button>
                        <button onClick={handleSignup} style={{ padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer', background: '#007bff', color: 'white' }}>{t.signUp}</button>
                        <button onClick={() => setLanguage(language === 'vi' ? 'en' : 'vi')} style={{ padding: '6px 12px', border: '1px solid #6c757d', background: 'transparent', color: '#6c757d', borderRadius: '4px', cursor: 'pointer' }}>
                            {language === 'vi' ? 'EN' : 'VI'}
                        </button>
                    </div>
                </div>
            </nav>

            <div style={{ textAlign: 'center', padding: '40px 20px', backgroundColor: '#f8f9fa' }}>
                <img src="LookJobs.png" alt="banner" style={{ maxWidth: '500px', width: '100%', height: 'auto', borderRadius: '12px', marginBottom: '20px' }} />
                <h1 style={{ color: '#007bff', marginBottom: '20px' }}>{t.findCompany}</h1>
                <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <input 
                        type="text" 
                        placeholder={t.searchPlaceholder}
                        style={{
                            width: '100%',
                            padding: '15px 20px',
                            border: '1px solid #ddd',
                            borderRadius: '25px',
                            fontSize: '16px'
                        }}
                    />
                </div>
            </div>

            <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                            {language === 'vi' ? 'Quy mô công ty' : 'Company Size'}
                        </label>
                        <select style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}>
                            <option>{language === 'vi' ? 'Chọn quy mô' : 'Choose size'}</option>
                            <option>1-50 {language === 'vi' ? 'nhân viên' : 'employees'}</option>
                            <option>51-200 {language === 'vi' ? 'nhân viên' : 'employees'}</option>
                            <option>201-1000 {language === 'vi' ? 'nhân viên' : 'employees'}</option>
                            <option>1000+ {language === 'vi' ? 'nhân viên' : 'employees'}</option>
                        </select>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                            {language === 'vi' ? 'Ngành nghề' : 'Industry'}
                        </label>
                        <select style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}>
                            <option>{language === 'vi' ? 'Chọn ngành nghề' : 'Choose industry'}</option>
                            <option>{language === 'vi' ? 'Công nghệ' : 'Technology'}</option>
                            <option>{language === 'vi' ? 'Tài chính' : 'Finance'}</option>
                            <option>{language === 'vi' ? 'Y tế' : 'Healthcare'}</option>
                            <option>{language === 'vi' ? 'Giáo dục' : 'Education'}</option>
                        </select>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                            {language === 'vi' ? 'Địa điểm' : 'Location'}
                        </label>
                        <select style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}>
                            <option>{language === 'vi' ? 'Chọn địa điểm' : 'Choose location'}</option>
                            <option>{language === 'vi' ? 'Hà Nội' : 'Hanoi'}</option>
                            <option>{language === 'vi' ? 'Hồ Chí Minh' : 'Ho Chi Minh City'}</option>
                            <option>{language === 'vi' ? 'Đà Nẵng' : 'Da Nang'}</option>
                        </select>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                            {language === 'vi' ? 'Loại hình' : 'Company Type'}
                        </label>
                        <select style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}>
                            <option>{language === 'vi' ? 'Chọn loại hình' : 'Choose type'}</option>
                            <option>{language === 'vi' ? 'Công ty tư nhân' : 'Private Company'}</option>
                            <option>{language === 'vi' ? 'Công ty đại chúng' : 'Public Company'}</option>
                            <option>{language === 'vi' ? 'Startup' : 'Startup'}</option>
                        </select>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
                    {companyData.map((company, index) => (
                        <div key={index} style={{
                            background: 'white',
                            border: '1px solid #e0e0e0',
                            borderRadius: '8px',
                            padding: '20px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '15px'
                        }}>
                            <img
                                src={company.logo}
                                alt={company.name}
                                style={{ width: '60px', height: '60px', objectFit: 'contain' }}
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/60x60?text=Logo';
                                }}
                            />
                            <div style={{ flex: 1 }}>
                                <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#333' }}>{company.name}</h3>
                                <p style={{ margin: '0 0 12px 0', color: '#666', fontSize: '14px' }}>{company.industry}</p>
                                <button
                                    style={{
                                        background: '#007bff',
                                        color: 'white',
                                        border: 'none',
                                        padding: '8px 16px',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontSize: '14px'
                                    }}
                                    onClick={() => {
                                        if (company.name.includes('Samsung') && onPageChange) {
                                            onPageChange('companyDetail');
                                        }
                                    }}
                                >
                                    {t.seeMore}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginTop: '40px' }}>
                    <button
                        style={{
                            padding: '8px 16px',
                            border: '1px solid #ddd',
                            background: 'white',
                            cursor: 'pointer',
                            borderRadius: '4px'
                        }}
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                    >
                        {t.previous}
                    </button>
                    {[1, 2, 3].map((page) => (
                        <button
                            key={page}
                            style={{
                                padding: '8px 12px',
                                border: '1px solid #ddd',
                                background: currentPage === page ? '#007bff' : 'white',
                                color: currentPage === page ? 'white' : '#007bff',
                                cursor: 'pointer',
                                borderRadius: '4px'
                            }}
                            onClick={() => setCurrentPage(page)}
                        >
                            {page}
                        </button>
                    ))}
                    <button
                        style={{
                            padding: '8px 16px',
                            border: '1px solid #ddd',
                            background: 'white',
                            cursor: 'pointer',
                            borderRadius: '4px'
                        }}
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                    >
                        {t.next}
                    </button>
                </div>
            </div>

            <footer style={{ backgroundColor: '#f8f9fa', padding: '40px 20px', textAlign: 'center', borderTop: '1px solid #e9ecef' }}>
                <h5 style={{ fontWeight: 'bold', color: '#007bff' }}>
                    JobConnect <span style={{ color: '#28a745' }}>4Students</span>
                </h5>
                <p>497 Hoa Hao Street, Ward 7, District 10, Ho Chi Minh City</p>
                <p>Hotline : 0943009243</p>
                <div style={{ marginTop: '10px' }}>
                    <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#007bff' }}>Facebook</a>
                    {' · '}
                    <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#007bff' }}>Instagram</a>
                    {' · '}
                    <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#007bff' }}>YouTube</a>
                </div>
            </footer>
        </div>
    );
};

export default Company;
