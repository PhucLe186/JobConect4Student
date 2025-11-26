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

    const companyPages = 9;
    const totalCompany=companyData.length
    const totalPages=Math.ceil(totalCompany/companyPages)
    const startIndex=(currentPage-1)*companyPages
    const endIndex=(startIndex+companyPages)
    const currentCompanypage=companyData.slice(startIndex, endIndex)


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
        {lable: t.choose_size },
        {lable: '1-50'+t.employees },
        {lable: '50-200'+ t.employees },
        {lable: '201-1000'+t.employees },
        {lable: '1000+'+t.employees },
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
                                {size.map((item, idx)=> (
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
