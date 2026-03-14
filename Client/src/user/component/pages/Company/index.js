import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import style from './Company.module.scss';
import LookJobsImg from '~/asset/img/LookJobs.png';
import translations from '~/component/Translation';
import { AuthContext } from '~/context/AuthContext';


const cx = classNames.bind(style);

const Company = () => {
    const navigate = useNavigate();
    const {api, language}= useContext(AuthContext)
    const [currentPage, setCurrentPage] = useState(1);
    const [companyData, setCompanyData]= useState([])
    const [searchKeyword, setSearchKeyword] = useState('');
    const [filterSize, setFilterSize] = useState('');
    const [filterIndustry, setFilterIndustry] = useState('');
    const [filterLocation, setFilterLocation] = useState('');

    const companyPages = 9;

    const filteredCompanies = companyData.filter(company => {
        const keyword = searchKeyword.toLowerCase();
        const matchKeyword = !keyword ||
            company.company_name?.toLowerCase().includes(keyword) ||
            company.industry?.toLowerCase().includes(keyword) ||
            company.description?.toLowerCase().includes(keyword);
        const matchIndustry = !filterIndustry || company.industry?.toLowerCase().includes(filterIndustry.toLowerCase());
        const matchLocation = !filterLocation || company.address?.toLowerCase().includes(filterLocation.toLowerCase());
        const matchSize = !filterSize || (() => {
            const s = Number(company.size);
            if (filterSize === '1-50') return s >= 1 && s <= 50;
            if (filterSize === '50-200') return s > 50 && s <= 200;
            if (filterSize === '201-1000') return s > 200 && s <= 1000;
            if (filterSize === '1000+') return s > 1000;
            return true;
        })();
        return matchKeyword && matchIndustry && matchLocation && matchSize;
    });

    const totalCompany = filteredCompanies.length
    const totalPages=Math.ceil(totalCompany/companyPages)
    const startIndex=(currentPage-1)*companyPages
    const endIndex=(startIndex+companyPages)
    const currentCompanypage=filteredCompanies.slice(startIndex, endIndex)

    const handleSearch = (e) => {
        setSearchKeyword(e.target.value);
        setCurrentPage(1);
    };

    const handleFilterChange = (setter) => (e) => {
        setter(e.target.value);
        setCurrentPage(1);
    };

    // Function để tạo hình ảnh cố định cho mỗi công ty
    const getCompanyImage = (company, index) => {
        if (company.logo && company.logo !== '') {
            return company.logo;
        }
        
        // Danh sách hình ảnh cố định
        const defaultImages = [
            'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=60&h=60&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=60&h=60&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1497366216548-37526070297c?w=60&h=60&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=60&h=60&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=60&h=60&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1541746972996-4e0b0f93e586?w=60&h=60&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1560472355-536de3962603?w=60&h=60&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=60&h=60&fit=crop&crop=center'
        ];
        
        // Tạo hash từ tên công ty để chọn hình ảnh cố định
        const companyName = company.company_name || company._id || '';
        const hash = companyName.split('').reduce((a, b) => {
            a = ((a << 5) - a) + b.charCodeAt(0);
            return a & a;
        }, 0);
        
        const imageIndex = Math.abs(hash) % defaultImages.length;
        return defaultImages[imageIndex];
    };


    console.log(currentCompanypage)
    useEffect(()=>{
        const fetchCompany=async()=> {
            const res= await api.get('employer')
            if(res.data) {
                setCompanyData(res.data)
            }
        }
        fetchCompany()
    }, [])

    const t = translations[language];
    const size= [
        {lable: t.choose_size, value: '' },
        {lable: '1-50 '+ t.employees, value: '1-50' },
        {lable: '50-200 '+ t.employees, value: '50-200' },
        {lable: '201-1000 '+ t.employees, value: '201-1000' },
        {lable: '1000+ '+ t.employees, value: '1000+' },
    ]

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
                            <label>{language === 'vi' ? 'Quy mô công ty' : 'Company Size'}</label>
                            <select className={cx('filter-select')} value={filterSize} onChange={handleFilterChange(setFilterSize)}>
                                {size.map((item, idx)=> (
                                    <option key={idx} value={item.value || ''}>{item.lable}</option>
                                ))}
                            </select>
                        </div>
                        <div className={cx('filter-item')}>
                            <label>{language === 'vi' ? 'Ngành nghề' : 'Industry'}</label>
                            <select className={cx('filter-select')} value={filterIndustry} onChange={handleFilterChange(setFilterIndustry)}>
                                <option value="">{language === 'vi' ? 'Chọn ngành nghề' : 'Choose industry'}</option>
                                <option value="Công nghệ">{language === 'vi' ? 'Công nghệ' : 'Technology'}</option>
                                <option value="Tài chính">{language === 'vi' ? 'Tài chính' : 'Finance'}</option>
                                <option value="Y tế">{language === 'vi' ? 'Y tế' : 'Healthcare'}</option>
                                <option value="Giáo dục">{language === 'vi' ? 'Giáo dục' : 'Education'}</option>
                            </select>
                        </div>
                        <div className={cx('filter-item')}>
                            <label>{language === 'vi' ? 'Địa điểm' : 'Location'}</label>
                            <select className={cx('filter-select')} value={filterLocation} onChange={handleFilterChange(setFilterLocation)}>
                                <option value="">{language === 'vi' ? 'Chọn địa điểm' : 'Choose location'}</option>
                                <option value="Hà Nội">{language === 'vi' ? 'Hà Nội' : 'Hanoi'}</option>
                                <option value="Hồ Chí Minh">{language === 'vi' ? 'Hồ Chí Minh' : 'Ho Chi Minh City'}</option>
                                <option value="Đà Nẵng">{language === 'vi' ? 'Đà Nẵng' : 'Da Nang'}</option>
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
                    {filteredCompanies.length === 0 && companyData.length > 0 && (
                        <p style={{textAlign:'center', padding:'20px', color:'#888'}}>
                            {language === 'vi' ? 'Không tìm thấy công ty phù hợp.' : 'No companies found.'}
                        </p>
                    )}
                    <div className={cx('jobs-grid')}>
                        {currentCompanypage.map((company, index) => (
                            <div className={cx('job-card')} key={index}>
                                <div className={cx('job-header')}>
                                    <img
                                        src={getCompanyImage(company, index)}
                                        alt={company.company_name}
                                        className={cx('company-logo')}
                                    />
                                    <div className={cx('job-info')}>
                                        <h3 className={cx('job-title')}>{company.company_name}</h3>
                                        <p className={cx('company-name')}>{company.industry}</p>
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

                    {/* Pagination */}
                    <div className={cx('pagination-wrapper')}>
                        <button
                            className={cx('page-btn')}
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            {t.previous}
                        </button>
                        {Array.from({length: totalPages}, (_, i)=> i+1).map((page) => (
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
