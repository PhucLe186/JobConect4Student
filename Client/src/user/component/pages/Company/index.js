import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import style from './Company.module.scss';
import LookJobsImg from '~/asset/img/LookJobs.png';
import translations from '~/component/Translation';
import { AuthContext } from '~/context/AuthContext';
import { createCompanyPlaceholder, mergeCompanies } from '~/user/component/shared/companyData';

const cx = classNames.bind(style);

if (!document.querySelector('link[href*="fontawesome"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
    document.head.appendChild(link);
}

const Company = () => {
    const navigate = useNavigate();
    const { api, language } = useContext(AuthContext);
    const [currentPage, setCurrentPage] = useState(1);
    const [companyData, setCompanyData] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [filterSize, setFilterSize] = useState('');
    const [filterIndustry, setFilterIndustry] = useState('');
    const [filterLocation, setFilterLocation] = useState('');
    const companiesPerPage = 9;
    const t = translations[language];

    const industryOptions = useMemo(
        () => Array.from(new Set(companyData.map((company) => company.industry).filter(Boolean))).slice(0, 12),
        [companyData],
    );

    const locationOptions = useMemo(
        () => Array.from(new Set(companyData.map((company) => company.address).filter(Boolean))).slice(0, 12),
        [companyData],
    );

    const filteredCompanies = companyData.filter((company) => {
        const keyword = searchKeyword.trim().toLowerCase();
        const matchKeyword =
            !keyword ||
            company.company_name?.toLowerCase().includes(keyword) ||
            company.industry?.toLowerCase().includes(keyword) ||
            company.description?.toLowerCase().includes(keyword) ||
            company.address?.toLowerCase().includes(keyword);
        const matchIndustry = !filterIndustry || company.industry === filterIndustry;
        const matchLocation = !filterLocation || company.address === filterLocation;
        const matchSize =
            !filterSize ||
            (() => {
                const size = Number(company.size);
                if (filterSize === '1-50') return size >= 1 && size <= 50;
                if (filterSize === '50-200') return size > 50 && size <= 200;
                if (filterSize === '201-1000') return size > 200 && size <= 1000;
                if (filterSize === '1000+') return size > 1000;
                return true;
            })();

        return matchKeyword && matchIndustry && matchLocation && matchSize;
    });

    const totalCompanies = filteredCompanies.length;
    const totalPages = Math.ceil(totalCompanies / companiesPerPage);
    const startIndex = (currentPage - 1) * companiesPerPage;
    const currentCompanyPage = filteredCompanies.slice(startIndex, startIndex + companiesPerPage);

    const handleSearch = (e) => {
        setSearchKeyword(e.target.value);
        setCurrentPage(1);
    };

    const handleFilterChange = (setter) => (e) => {
        setter(e.target.value);
        setCurrentPage(1);
    };

    useEffect(() => {
        const fetchCompany = async () => {
            try {
                const res = await api.get('employer');
                setCompanyData(mergeCompanies(res.data || []));
            } catch (error) {
                console.error('API Error:', error);
                setCompanyData(mergeCompanies([]));
            }
        };

        fetchCompany();
    }, [api]);

    const sizeOptions = [
        { label: t.choose_size || t.Choose_size, value: '' },
        { label: `1-50 ${t.employees}`, value: '1-50' },
        { label: `50-200 ${t.employees}`, value: '50-200' },
        { label: `201-1000 ${t.employees}`, value: '201-1000' },
        { label: `1000+ ${t.employees}`, value: '1000+' },
    ];

    return (
        <div className={cx('home-page')}>
            <div className={cx('hero-section')}>
                <div className={cx('container')}>
                    <div className={cx('hero-content')}>
                        <div className={cx('hero-image')}>
                            <img src={LookJobsImg} alt="Company Search" />
                        </div>
                        <h1 className={cx('hero-title')}>{t.findCompany}</h1>
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

            <div className={cx('filter-section')}>
                <div className={cx('container')}>
                    <div className={cx('filter-row')}>
                        <div className={cx('filter-item')}>
                            <label>{language === 'vi' ? 'Quy mô công ty' : 'Company Size'}</label>
                            <select
                                className={cx('filter-select')}
                                value={filterSize}
                                onChange={handleFilterChange(setFilterSize)}
                            >
                                {sizeOptions.map((item) => (
                                    <option key={item.value || 'all'} value={item.value}>
                                        {item.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className={cx('filter-item')}>
                            <label>{language === 'vi' ? 'Ngành nghề' : 'Industry'}</label>
                            <select
                                className={cx('filter-select')}
                                value={filterIndustry}
                                onChange={handleFilterChange(setFilterIndustry)}
                            >
                                <option value="">{language === 'vi' ? 'Chọn ngành nghề' : 'Choose industry'}</option>
                                {industryOptions.map((item) => (
                                    <option key={item} value={item}>
                                        {item}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className={cx('filter-item')}>
                            <label>{language === 'vi' ? 'Địa điểm' : 'Location'}</label>
                            <select
                                className={cx('filter-select')}
                                value={filterLocation}
                                onChange={handleFilterChange(setFilterLocation)}
                            >
                                <option value="">{language === 'vi' ? 'Chọn địa điểm' : 'Choose location'}</option>
                                {locationOptions.map((item) => (
                                    <option key={item} value={item}>
                                        {item}
                                    </option>
                                ))}
                                <option value="Hà Nội">{language === 'vi' ? 'Hà Nội' : 'Hanoi'}</option>
                                <option value="Hồ Chí Minh">
                                    {language === 'vi' ? 'Hồ Chí Minh' : 'Ho Chi Minh City'}
                                </option>
                                <option value="Đà Nẵng">{language === 'vi' ? 'Đà Nẵng' : 'Da Nang'}</option>
                                <option value="Cần Thơ">{language === 'vi' ? 'Cần Thơ' : 'Can Tho'}</option>
                                <option value="Hải Phòng">{language === 'vi' ? 'Hải Phòng' : 'Hai Phong'}</option>
                                <option value="Bình Dương">{language === 'vi' ? 'Bình Dương' : 'Binh Duong'}</option>
                                <option value="Đồng Nai">{language === 'vi' ? 'Đồng Nai' : 'Dong Nai'}</option>
                            </select>
                        </div>
                        <div className={cx('filter-item')}>
                            <label>{language === 'vi' ? 'Tổng số công ty' : 'Total companies'}</label>
                            <div className={cx('summary-box')}>
                                <strong>{totalCompanies}</strong>
                                <span>{language === 'vi' ? 'công ty đang hiển thị' : 'companies shown'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={cx('jobs-section')}>
                <div className={cx('container')}>
                    {filteredCompanies.length === 0 && companyData.length > 0 && (
                        <p style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
                            {language === 'vi' ? 'Không tìm thấy công ty phù hợp.' : 'No companies found.'}
                        </p>
                    )}
                    <div className={cx('jobs-grid')}>
                        {currentCompanyPage.map((company) => (
                            <div className={cx('job-card')} key={company._id}>
                                <div className={cx('job-header')}>
                                    <img
                                        src={company.logo}
                                        alt={company.company_name}
                                        className={cx('company-logo')}
                                        onError={(e) => {
                                            e.currentTarget.src = createCompanyPlaceholder(company.company_name);
                                        }}
                                    />
                                    <div className={cx('job-info')}>
                                        <h3 className={cx('job-title')}>{company.company_name}</h3>
                                        <p className={cx('company-name')}>{company.industry}</p>
                                    </div>
                                </div>

                                <p className={cx('company-description')}>{company.shortDescription}</p>

                                <div className={cx('company-meta-list')}>
                                    <div className={cx('company-meta-item')}>
                                        <i className="fas fa-location-dot"></i>
                                        <span>{company.address}</span>
                                    </div>
                                    <div className={cx('company-meta-item')}>
                                        <i className="fas fa-users"></i>
                                        <span>{company.sizeLabel}</span>
                                    </div>
                                    <div className={cx('company-meta-item')}>
                                        <i className="fas fa-globe"></i>
                                        <span>
                                            {company.website ||
                                                (language === 'vi' ? 'Đang cập nhật website' : 'Website updating')}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    className={cx('apply-btn')}
                                    onClick={() => {
                                        navigate(`/company/${company._id}`);
                                    }}
                                >
                                    {t.seeMore}
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className={cx('pagination-wrapper')}>
                        <button
                            className={cx('page-btn')}
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            {t.previous}
                        </button>
                        {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
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
                            disabled={currentPage === totalPages || totalPages === 0}
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
