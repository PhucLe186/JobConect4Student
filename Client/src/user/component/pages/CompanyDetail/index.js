import React, { useContext, useEffect, useState } from 'react';
import styles from './CompanyDetail.module.scss';
import classNames from 'classnames/bind';
import translations from '~/component/Translation';
import { AuthContext } from '~/context/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);
const CompanyDetail = ({ onPageChange }) => {
    const { api, language } = useContext(AuthContext);
    const [data, setData] = useState([]);
    const [suggestedCompanies, setSuggestedCompanies] = useState([]);
    const [companyJobs, setCompanyJobs] = useState([]);
    const { id } = useParams();
    const navigate = useNavigate();
    const t = translations[language];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get(`employer/${id}`);
                if (res.data) setData(res.data);
            } catch (error) {
                console.error(error);
            }
        };
        const fetchSuggestedCompanies = async () => {
            try {
                const res = await api.get('employer');
                if (res.data) {
                    // Loại bỏ công ty hiện tại khỏi danh sách gợi ý
                    setSuggestedCompanies(res.data.filter((c) => c._id !== id).slice(0, 3));
                }
            } catch (error) {
                console.error(error);
            }
        };
        const fetchCompanyJobs = async () => {
            try {
                const res = await api.get('jobs');
                if (res.data) {
                    // Lấy jobs của công ty hiện tại (sẽ lọc sau khi có data)
                    setCompanyJobs(res.data.slice(0, 3));
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
        fetchSuggestedCompanies();
        fetchCompanyJobs();
    }, [api, id]);


    return (
        <div>
            <div className={cx('banner')}>
                <div className={cx('bannerContent')}>
                    <div className={cx('logoContainer')}>
                        <img src={data.logo} alt="Samsung Logo" />
                    </div>
                    <div className={cx('companyInfo')}>
                        <h1>{data.name}</h1>
                        <p className={cx('industry')}>{data.industry}</p>
                        <div className={cx('details')}>
                            <p>
                                <i className="fas fa-map-marker-alt"></i>
                                {data.address}
                            </p>
                            <p>
                                <i className="fas fa-users"></i>
                                {data.size}
                            </p>
                            <p>
                                <i className="fas fa-calendar-alt"></i>
                                {t.founded}: {data.founded}
                            </p>
                        </div>
                        <button className={cx('viewJobsBtn')} onClick={() => onPageChange(1, 'samsung')}>
                            {t.viewJobs}
                        </button>
                    </div>
                </div>
            </div>

            <div className={cx('mainLayout')}>
                <div className={cx('contentMain')}>
                    <div className={cx('contentSection')}>
                        <h2>{t.generalInfo}</h2>
                        <div className={cx('generalInfoContent')}>
                            <div className={cx('infoItem')}>
                                <span>{t.industry}</span>
                                <p>{data.industry}</p>
                            </div>
                            <div className={cx('infoItem')}>
                                <span>{t.companySize}</span>
                                <p>{data.size}</p>
                            </div>
                            <div className={cx('infoItem')}>
                                <span>{t.website}</span>
                                <p>
                                    <a href="https://www.samsung.com/vn" target="_blank" rel="noopener noreferrer">
                                        {data.website}
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className={cx('contentSection')}>
                        <h2>{t.companyDescription}</h2>
                        <p>{data.description}</p>
                    </div>

                    <div className={cx('contentSection')}>
                        <h2>{language === 'vi' ? 'Các vị trí tuyển dụng' : 'Job Openings'}</h2>
                        <div className={cx('jobsList')}>
                            {companyJobs.length > 0 ? companyJobs.map((job, index) => (
                                <div key={index} className={cx('jobItem')}>
                                    <div className={cx('jobHeader')}>
                                        <h3 className={cx('jobTitle')}>{job.title}</h3>
                                        <span className={cx('jobType')}>{job.job_type}</span>
                                    </div>
                                    <p className={cx('jobLocation')}>
                                        <i className="fas fa-map-marker-alt"></i>
                                        {job.location}
                                    </p>
                                    <button
                                        className={cx('applyBtn')}
                                        onClick={() => navigate(`/job/${job.id}`)}
                                    >
                                        {language === 'vi' ? 'Ứng tuyển' : 'Apply Now'}
                                    </button>
                                </div>
                            )) : (
                                <p style={{ color: '#888', fontSize: '14px' }}>
                                    {language === 'vi' ? 'Chưa có vị trí tuyển dụng.' : 'No job openings.'}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div className={cx('sidebar')}>
                    <div className={cx('suggestionButton')}>
                        <div className={cx('btn')} onClick={() => navigate('/company')}>
                            <i className="fa-solid fa-building"></i>
                            {t.companySuggestions}
                        </div>
                    </div>

                    <div className={cx('companiesList')}>
                        {suggestedCompanies.map((company) => (
                            <div
                                key={company._id}
                                className={cx('companyItem')}
                                style={{ cursor: 'pointer' }}
                                onClick={() => navigate(`/company/${company._id}`)}
                            >
                                <div className={cx('companyLogo')}>
                                    <img
                                        src={company.logo}
                                        alt={company.company_name}
                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/24x24?text=Co'; }}
                                    />
                                </div>
                                <div className={cx('companyName')}>{company.company_name}</div>
                                <div className={cx('heartIcon')}>
                                    <i className="fa-regular fa-heart"></i>
                                </div>
                            </div>
                        ))}
                        {suggestedCompanies.length === 0 && (
                            <p style={{ textAlign: 'center', color: '#888', padding: '12px', fontSize: '13px' }}>
                                {language === 'vi' ? 'Đang tải...' : 'Loading...'}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyDetail;