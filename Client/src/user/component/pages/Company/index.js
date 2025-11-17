import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import style from './Company.module.scss';
import LookJobsImg from '~/asset/img/LookJobs.png';
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
import DuocLogo from '~/asset/img/dược.png';
import LonghaiLogo from '~/asset/img/Longhai.png';
import ChungphatLogo from '~/asset/img/Chungphat.png';
import KaiyiLogo from '~/asset/img/Kaiyi.png';
import XaydungLogo from '~/asset/img/Xaydung.png';
import HPLLogo from '~/asset/img/HPL.png';

const cx = classNames.bind(style);

const Company = ({ onPageChange }) => {
    const navigate = useNavigate();
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

    const logoMap = {
        'LongThanh.png': LongThanhLogo,
        'Samsung.png': SamsungLogo,
        'MB.png': MBLogo,
        'NEC.png': NECLogo,
        'LG.png': LGLogo,
        'Naver.png': NaverLogo,
        'Google.png': GoogleLogo,
        'Microsoft.png': MicrosoftLogo,
        'Apple.png': AppleLogo,
        'IBM.png': IBMLogo,
        'AWS.png': AWSLogo,
        'Shopee.png': ShopeeLogo,
        'Oracle.png': OracleLogo,
        'Grab.png': GrabLogo,
        'Netflix.png': NetflixLogo,
        'Adobe.png': AdobeLogo,
        'TikTok.png': TikTokLogo,
        'Visa.png': VisaLogo,
        'Dược.png': DuocLogo,
        'Longhai.png': LonghaiLogo,
        'Chungphat.png': ChungphatLogo,
        'Kaiyi.png': KaiyiLogo,
        'Xaydung.png': XaydungLogo,
        'HPL.png': HPLLogo,
    };

    const allCompanyData = {
        1: [
            {
                logo: logoMap['LongThanh.png'],
                name: language === 'vi' ? 'Tập đoàn Long Thành' : 'Long Thanh Corp',
                industry: language === 'vi' ? 'Xây dựng' : 'Construction',
            },
            {
                logo: logoMap['Samsung.png'],
                name: language === 'vi' ? 'Samsung Việt Nam' : 'Samsung Vietnam',
                industry: language === 'vi' ? 'Công nghệ' : 'Technology',
            },
            {
                logo: logoMap['MB.png'],
                name: language === 'vi' ? 'Ngân hàng MB' : 'MB Bank',
                industry: language === 'vi' ? 'Tài chính' : 'Finance',
            },
            {
                logo: logoMap['NEC.png'],
                name: language === 'vi' ? 'Công ty NEC' : 'NEC Corporation',
                industry: language === 'vi' ? 'Công nghệ' : 'Technology',
            },
            {
                logo: logoMap['LG.png'],
                name: language === 'vi' ? 'Công ty LG' : 'LG Electronics',
                industry: language === 'vi' ? 'Điện tử' : 'Electronics',
            },
            {
                logo: logoMap['Naver.png'],
                name: language === 'vi' ? 'Công ty Naver' : 'Naver Corporation',
                industry: language === 'vi' ? 'Công nghệ' : 'Technology',
            },
            {
                logo: logoMap['Google.png'],
                name: language === 'vi' ? 'Công ty Google' : 'Google Inc',
                industry: language === 'vi' ? 'Công nghệ' : 'Technology',
            },
            {
                logo: logoMap['Microsoft.png'],
                name: language === 'vi' ? 'Công ty Microsoft' : 'Microsoft Corp',
                industry: language === 'vi' ? 'Công nghệ' : 'Technology',
            },
            {
                logo: logoMap['Apple.png'],
                name: language === 'vi' ? 'Công ty Apple' : 'Apple Inc',
                industry: language === 'vi' ? 'Công nghệ' : 'Technology',
            },
        ],
        2: [
            {
                logo: logoMap['IBM.png'],
                name: language === 'vi' ? 'Tập đoàn IBM' : 'IBM Corporation',
                industry: language === 'vi' ? 'Công nghệ' : 'Technology',
            },
            {
                logo: logoMap['AWS.png'],
                name: language === 'vi' ? 'Dịch vụ Web Amazon' : 'Amazon Web Services',
                industry: language === 'vi' ? 'Đám mây' : 'Cloud',
            },
            {
                logo: logoMap['Shopee.png'],
                name: language === 'vi' ? 'Shopee Việt Nam' : 'Shopee Vietnam',
                industry: language === 'vi' ? 'Thương mại điện tử' : 'E-commerce',
            },
            {
                logo: logoMap['Oracle.png'],
                name: language === 'vi' ? 'Oracle Việt Nam' : 'Oracle Vietnam',
                industry: language === 'vi' ? 'Cơ sở dữ liệu' : 'Database',
            },
            {
                logo: logoMap['Grab.png'],
                name: language === 'vi' ? 'Grab Việt Nam' : 'Grab Vietnam',
                industry: language === 'vi' ? 'Giao thông' : 'Transportation',
            },
            {
                logo: logoMap['Netflix.png'],
                name: language === 'vi' ? 'Công nghệ Netflix' : 'Netflix Technology',
                industry: language === 'vi' ? 'Giải trí' : 'Entertainment',
            },
            {
                logo: logoMap['Adobe.png'],
                name: language === 'vi' ? 'Hệ thống Adobe' : 'Adobe Systems',
                industry: language === 'vi' ? 'Phần mềm' : 'Software',
            },
            {
                logo: logoMap['TikTok.png'],
                name: language === 'vi' ? 'Công nghệ TikTok' : 'TikTok Technology',
                industry: language === 'vi' ? 'Mạng xã hội' : 'Social Media',
            },
            {
                logo: logoMap['Visa.png'],
                name: 'Visa Inc.',
                industry: language === 'vi' ? 'Thanh toán' : 'Payment',
            },
        ],
        3: [
            {
                logo: logoMap['Dược.png'],
                name: language === 'vi' ? 'Công Ty Cổ phần Tâm Dược' : 'Tam Duoc JSC',
                industry: language === 'vi' ? 'Dược phẩm' : 'Pharmaceutical',
            },
            {
                logo: logoMap['Longhai.png'],
                name: language === 'vi' ? 'Công ty Bất động sản Long Hải' : 'Long Hai Real Estate',
                industry: language === 'vi' ? 'Bất động sản' : 'Real Estate',
            },
            {
                logo: logoMap['Chungphat.png'],
                name: language === 'vi' ? 'Công Ty Chung Phát' : 'Chung Phat Company',
                industry: language === 'vi' ? 'Dịch vụ' : 'Services',
            },
            {
                logo: logoMap['Kaiyi.png'],
                name: language === 'vi' ? 'Công Ty Đầu tư Quốc tế Kaiyi' : 'Kaiyi International Investment',
                industry: language === 'vi' ? 'Đầu tư' : 'Investment',
            },
            {
                logo: logoMap['Xaydung.png'],
                name: language === 'vi' ? 'Công Ty Cổ phần Xây Dựng Số 5' : 'Construction Company No.5 JSC',
                industry: language === 'vi' ? 'Xây dựng' : 'Construction',
            },
            {
                logo: logoMap['HPL.png'],
                name: language === 'vi' ? 'Công Ty Du lịch HPLS' : 'HPLS Tourism Company',
                industry: language === 'vi' ? 'Du lịch' : 'Tourism',
            },
            {
                logo: logoMap['LongThanh.png'],
                name: language === 'vi' ? 'Tập đoàn Long Thành' : 'Long Thanh Corp',
                industry: language === 'vi' ? 'Kế toán' : 'Accounting',
            },
            {
                logo: logoMap['Samsung.png'],
                name: language === 'vi' ? 'Samsung Display' : 'Samsung Display',
                industry: language === 'vi' ? 'Màn hình' : 'Display',
            },
            {
                logo: logoMap['MB.png'],
                name: language === 'vi' ? 'MB Ageas Life' : 'MB Ageas Life',
                industry: language === 'vi' ? 'Bảo hiểm' : 'Insurance',
            },
        ],
    };

    const companyData = allCompanyData[currentPage] || [];

    return (
        <div className={cx('home-page')}>
            {/* Hero Section */}
            <div className={cx('hero-section')}>
                <div className={cx('container')}>
                    <div className={cx('hero-content')}>
                        <div className={cx('hero-image')}>
                            <img src={LookJobsImg} alt="Company Search" />
                        </div>
                        <h1 className={cx('hero-title')}>{t.findCompany}</h1>
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
                            <label>{language === 'vi' ? 'Quy mô công ty' : 'Company Size'}</label>
                            <select className={cx('filter-select')}>
                                <option>{language === 'vi' ? 'Chọn quy mô' : 'Choose size'}</option>
                                <option>1-50 {language === 'vi' ? 'nhân viên' : 'employees'}</option>
                                <option>51-200 {language === 'vi' ? 'nhân viên' : 'employees'}</option>
                                <option>201-1000 {language === 'vi' ? 'nhân viên' : 'employees'}</option>
                                <option>1000+ {language === 'vi' ? 'nhân viên' : 'employees'}</option>
                            </select>
                        </div>
                        <div className={cx('filter-item')}>
                            <label>{language === 'vi' ? 'Ngành nghề' : 'Industry'}</label>
                            <select className={cx('filter-select')}>
                                <option>{language === 'vi' ? 'Chọn ngành nghề' : 'Choose industry'}</option>
                                <option>{language === 'vi' ? 'Công nghệ' : 'Technology'}</option>
                                <option>{language === 'vi' ? 'Tài chính' : 'Finance'}</option>
                                <option>{language === 'vi' ? 'Y tế' : 'Healthcare'}</option>
                                <option>{language === 'vi' ? 'Giáo dục' : 'Education'}</option>
                            </select>
                        </div>
                        <div className={cx('filter-item')}>
                            <label>{language === 'vi' ? 'Địa điểm' : 'Location'}</label>
                            <select className={cx('filter-select')}>
                                <option>{language === 'vi' ? 'Chọn địa điểm' : 'Choose location'}</option>
                                <option>{language === 'vi' ? 'Hà Nội' : 'Hanoi'}</option>
                                <option>{language === 'vi' ? 'Hồ Chí Minh' : 'Ho Chi Minh City'}</option>
                                <option>{language === 'vi' ? 'Đà Nẵng' : 'Da Nang'}</option>
                            </select>
                        </div>
                        <div className={cx('filter-item')}>
                            <label>{language === 'vi' ? 'Loại hình' : 'Company Type'}</label>
                            <select className={cx('filter-select')}>
                                <option>{language === 'vi' ? 'Chọn loại hình' : 'Choose type'}</option>
                                <option>{language === 'vi' ? 'Công ty tư nhân' : 'Private Company'}</option>
                                <option>{language === 'vi' ? 'Công ty đại chúng' : 'Public Company'}</option>
                                <option>{language === 'vi' ? 'Startup' : 'Startup'}</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Companies Grid */}
            <div className={cx('jobs-section')}>
                <div className={cx('container')}>
                    <div className={cx('jobs-grid')}>
                        {companyData.map((company, index) => (
                            <div className={cx('job-card')} key={index}>
                                <div className={cx('job-header')}>
                                    <img src={company.logo} alt={company.name} className={cx('company-logo')} 
                                         onError={(e) => {
                                             e.target.src = 'https://via.placeholder.com/60x60?text=Logo';
                                         }} />
                                    <div className={cx('job-info')}>
                                        <h3 className={cx('job-title')}>{company.name}</h3>
                                        <p className={cx('company-name')}>{company.industry}</p>
                                    </div>
                                </div>
                                <button className={cx('apply-btn')} 
                                        onClick={() => {
                                            if (company.name.includes('Samsung')) {
                                                navigate('/company-detail');
                                            }
                                        }}>
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

export default Company;
