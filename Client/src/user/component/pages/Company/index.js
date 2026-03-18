import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import style from './Company.module.scss';
import LookJobsImg from '~/asset/img/LookJobs.png';
import translations from '~/component/Translation';
import { AuthContext } from '~/context/AuthContext';

const cx = classNames.bind(style);

const MOCK_COMPANIES = [
    { _id: 'm1', company_name: 'VNPT', industry: 'Viễn thông & CNTT', logo: 'VNPT.png' },
    {
        _id: 'm2',
        company_name: 'VinGroup',
        industry: 'Bất động sản & Đa ngành',
        logo: 'https://cdn.haitrieu.com/wp-content/uploads/2022/01/Logo-Vingroup.png',
    },
    {
        _id: 'm3',
        company_name: 'Lazada Vietnam',
        industry: 'Thương mại điện tử',
        logo: 'https://cdn.haitrieu.com/wp-content/uploads/2022/01/Logo-Lazada.png',
    },
    {
        _id: 'm4',
        company_name: 'Zalo',
        industry: 'Mạng xã hội & Công nghệ',
        logo: 'https://cdn.haitrieu.com/wp-content/uploads/2022/01/Logo-Zalo.png',
    },
    {
        _id: 'm5',
        company_name: 'Vinhomes',
        industry: 'Bất động sản',
        logo: 'https://cdn.haitrieu.com/wp-content/uploads/2022/01/Logo-Vinhomes.png',
    },
    {
        _id: 'm6',
        company_name: 'Sacombank',
        industry: 'Tài chính & Ngân hàng',
        logo: 'https://cdn.haitrieu.com/wp-content/uploads/2022/01/Logo-Sacombank-STB.png',
    },
    {
        _id: 'm7',
        company_name: 'Thế Giới Di Động',
        industry: 'Bán lẻ điện tử',
        logo: 'https://cdn.haitrieu.com/wp-content/uploads/2022/01/Logo-The-Gioi-Di-Dong-MWG.png',
    },
    {
        _id: 'm8',
        company_name: 'Haravan',
        industry: 'Công nghệ thương mại',
        logo: 'https://cdn.haitrieu.com/wp-content/uploads/2022/01/Logo-Haravan.png',
    },
    {
        _id: 'm9',
        company_name: 'KMS Technology',
        industry: 'Công nghệ thông tin',
        logo: 'https://cdn.haitrieu.com/wp-content/uploads/2022/01/Logo-KMS-Technology.png',
    },
    {
        _id: 'm10',
        company_name: 'Bosch Vietnam',
        industry: 'Kỹ thuật & Công nghệ',
        logo: 'https://logo.clearbit.com/bosch.com',
    },
    {
        _id: 'm11',
        company_name: 'Samsung Vietnam',
        industry: 'Điện tử & Công nghệ',
        logo: 'https://logo.clearbit.com/samsung.com',
    },
    {
        _id: 'm12',
        company_name: 'Intel Products Vietnam',
        industry: 'Bán dẫn & Công nghệ',
        logo: 'https://logo.clearbit.com/intel.com',
    },
    {
        _id: 'm13',
        company_name: 'Gameloft Vietnam',
        industry: 'Game & Giải trí',
        logo: 'https://logo.clearbit.com/gameloft.com',
    },
    {
        _id: 'm14',
        company_name: 'Ninja Van Vietnam',
        industry: 'Logistics & Vận chuyển',
        logo: 'https://cdn.haitrieu.com/wp-content/uploads/2022/01/Logo-Ninja-Van.png',
    },
    {
        _id: 'm15',
        company_name: 'GHTK',
        industry: 'Logistics & Vận chuyển',
        logo: 'https://cdn.haitrieu.com/wp-content/uploads/2022/05/Logo-GHTK.png',
    },
    {
        _id: 'm16',
        company_name: 'Ahamove',
        industry: 'Logistics & Công nghệ',
        logo: 'https://cdn.haitrieu.com/wp-content/uploads/2022/01/Logo-Ahamove.png',
    },
    {
        _id: 'm17',
        company_name: 'VPBank',
        industry: 'Tài chính & Ngân hàng',
        logo: 'https://cdn.haitrieu.com/wp-content/uploads/2022/01/Logo-VPBank.png',
    },
    {
        _id: 'm18',
        company_name: 'MB Bank',
        industry: 'Tài chính & Ngân hàng',
        logo: 'https://cdn.haitrieu.com/wp-content/uploads/2022/01/Logo-MB-Bank-MBB.png',
    },
    {
        _id: 'm19',
        company_name: 'ACB Bank',
        industry: 'Tài chính & Ngân hàng',
        logo: 'https://cdn.haitrieu.com/wp-content/uploads/2022/01/Logo-ACB.png',
    },
    {
        _id: 'm20',
        company_name: 'Vietcombank',
        industry: 'Tài chính & Ngân hàng',
        logo: 'https://cdn.haitrieu.com/wp-content/uploads/2022/01/Logo-Vietcombank-VCB.png',
    },
    {
        _id: 'm21',
        company_name: 'BIDV',
        industry: 'Tài chính & Ngân hàng',
        logo: 'https://cdn.haitrieu.com/wp-content/uploads/2022/01/Logo-BIDV.png',
    },
    {
        _id: 'm22',
        company_name: 'Vietjet Air',
        industry: 'Hàng không',
        logo: 'https://cdn.haitrieu.com/wp-content/uploads/2022/01/Logo-Vietjet-Air.png',
    },
    {
        _id: 'm23',
        company_name: 'Vietnam Airlines',
        industry: 'Hàng không',
        logo: 'https://cdn.haitrieu.com/wp-content/uploads/2022/01/Logo-Vietnam-Airlines.png',
    },
    {
        _id: 'm24',
        company_name: 'Bamboo Airways',
        industry: 'Hàng không',
        logo: 'https://cdn.haitrieu.com/wp-content/uploads/2022/01/Logo-Bamboo-Airways.png',
    },
    {
        _id: 'm25',
        company_name: 'Sun Group',
        industry: 'Du lịch & Bất động sản',
        logo: 'https://cdn.haitrieu.com/wp-content/uploads/2022/01/Logo-Sun-Group.png',
    },
    {
        _id: 'm26',
        company_name: 'Hoa Phat Group',
        industry: 'Thép & Công nghiệp',
        logo: 'https://cdn.haitrieu.com/wp-content/uploads/2022/01/Logo-Hoa-Phat-Group-HPG.png',
    },
    {
        _id: 'm27',
        company_name: 'Masan Group',
        industry: 'Hàng tiêu dùng & Thực phẩm',
        logo: 'https://cdn.haitrieu.com/wp-content/uploads/2022/01/Logo-Masan-Group-MSN.png',
    },
    {
        _id: 'm28',
        company_name: 'PetroVietnam',
        industry: 'Dầu khí & Năng lượng',
        logo: 'https://cdn.haitrieu.com/wp-content/uploads/2022/01/Logo-PetroVietnam-PVN.png',
    },
    {
        _id: 'm29',
        company_name: 'EVN - Điện lực Việt Nam',
        industry: 'Năng lượng & Điện',
        logo: 'https://cdn.haitrieu.com/wp-content/uploads/2022/01/Logo-EVN.png',
    },
    {
        _id: 'm30',
        company_name: 'Unilever Vietnam',
        industry: 'Hàng tiêu dùng',
        logo: 'https://logo.clearbit.com/unilever.com',
    },
    {
        _id: 'm31',
        company_name: 'Nestlé Vietnam',
        industry: 'Thực phẩm & Đồ uống',
        logo: 'https://logo.clearbit.com/nestle.com',
    },
    {
        _id: 'm32',
        company_name: 'Coca-Cola Vietnam',
        industry: 'Đồ uống',
        logo: 'https://logo.clearbit.com/coca-cola.com',
    },
    {
        _id: 'm33',
        company_name: 'Heineken Vietnam',
        industry: 'Đồ uống',
        logo: 'https://logo.clearbit.com/heineken.com',
    },
    {
        _id: 'm34',
        company_name: 'Abbott Vietnam',
        industry: 'Y tế & Dược phẩm',
        logo: 'https://logo.clearbit.com/abbott.com',
    },
    {
        _id: 'm35',
        company_name: 'Prudential Vietnam',
        industry: 'Bảo hiểm & Tài chính',
        logo: 'https://logo.clearbit.com/prudential.com',
    },
    {
        _id: 'm36',
        company_name: 'Sendo',
        industry: 'Thương mại điện tử',
        logo: 'https://cdn.haitrieu.com/wp-content/uploads/2022/01/Logo-Sendo.png',
    },
    {
        _id: 'm37',
        company_name: 'Nashtech Vietnam',
        industry: 'Công nghệ thông tin',
        logo: 'https://cdn.haitrieu.com/wp-content/uploads/2022/01/Logo-NashTech.png',
    },
    {
        _id: 'm38',
        company_name: 'Axon Active Vietnam',
        industry: 'Phần mềm',
        logo: 'https://logo.clearbit.com/axonactive.com',
    },
    {
        _id: 'm39',
        company_name: 'Fossil Group Vietnam',
        industry: 'Thời trang & Công nghệ',
        logo: 'https://logo.clearbit.com/fossil.com',
    },
    {
        _id: 'm40',
        company_name: 'FPT Telecom',
        industry: 'Viễn thông & Internet',
        logo: 'https://cdn.haitrieu.com/wp-content/uploads/2022/01/Logo-FPT-Telecom.png',
    },
    {
        _id: 'm41',
        company_name: 'VinFast',
        industry: 'Ô tô & Xe máy điện',
        logo: 'https://cdn.haitrieu.com/wp-content/uploads/2022/01/Logo-VinFast.png',
    },
    {
        _id: 'm42',
        company_name: 'Mobifone',
        industry: 'Viễn thông',
        logo: 'https://cdn.haitrieu.com/wp-content/uploads/2022/01/Logo-Mobifone.png',
    },
    {
        _id: 'm43',
        company_name: 'VinaPhone',
        industry: 'Viễn thông',
        logo: 'https://cdn.haitrieu.com/wp-content/uploads/2022/01/Logo-VinaPhone.png',
    },
    {
        _id: 'm44',
        company_name: 'Vietbank',
        industry: 'Tài chính & Ngân hàng',
        logo: 'https://cdn.haitrieu.com/wp-content/uploads/2022/01/Logo-VietBank.png',
    },
    {
        _id: 'm45',
        company_name: 'Agribank',
        industry: 'Tài chính & Ngân hàng',
        logo: 'https://cdn.haitrieu.com/wp-content/uploads/2022/01/Logo-Agribank.png',
    },
];

const Company = () => {
    const navigate = useNavigate();
    const { api, language } = useContext(AuthContext);
    const [currentPage, setCurrentPage] = useState(1);
    const [companyData, setCompanyData] = useState([]);

    const companyPages = 9;
    const totalCompany = companyData.length;
    const totalPages = Math.ceil(totalCompany / companyPages);
    const startIndex = (currentPage - 1) * companyPages;
    const currentCompanypage = companyData.slice(startIndex, startIndex + companyPages);

    useEffect(() => {
        const fetchCompany = async () => {
            try {
                const res = await api.get('employer');
                const apiData = res.data && res.data.length > 0 ? res.data : [];
                const apiNames = new Set(apiData.map((c) => c.company_name.toLowerCase()));
                const filtered = MOCK_COMPANIES.filter((c) => !apiNames.has(c.company_name.toLowerCase()));
                setCompanyData([...apiData, ...filtered]);
            } catch {
                setCompanyData(MOCK_COMPANIES);
            }
        };
        fetchCompany();
    }, []);

    const t = translations[language];
    const size = [
        { lable: t.choose_size },
        { lable: '1-50' + t.employees },
        { lable: '50-200' + t.employees },
        { lable: '201-1000' + t.employees },
        { lable: '1000+' + t.employees },
    ];

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
                                {size.map((item, idx) => (
                                    <option key={idx}>{item.lable}</option>
                                ))}
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
                        {currentCompanypage.map((company, index) => (
                            <div className={cx('job-card')} key={index}>
                                <div className={cx('job-header')}>
                                    <img
                                        src={company.logo}
                                        alt={company.company_name}
                                        className={cx('company-logo')}
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/60x60?text=Logo';
                                        }}
                                    />
                                    <div className={cx('job-info')}>
                                        <h3 className={cx('job-title')}>{company.company_name}</h3>
                                        <p className={cx('company-name')}>{company.industry}</p>
                                    </div>
                                </div>
                                <button className={cx('apply-btn')} onClick={() => navigate(`/company/${company._id}`)}>
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

export default Company;
