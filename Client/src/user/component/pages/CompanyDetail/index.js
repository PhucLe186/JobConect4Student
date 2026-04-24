import React, { useContext, useEffect, useRef, useState } from 'react';
import styles from './CompanyDetail.module.scss';
import classNames from 'classnames/bind';
import translations from '~/component/Translation';
import { AuthContext } from '~/context/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

if (!document.querySelector('link[href*="fontawesome"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
    document.head.appendChild(link);
}

const CompanyDetail = () => {
    const { api, language } = useContext(AuthContext);
    const [data, setData] = useState({});
    const [suggestedCompanies, setSuggestedCompanies] = useState([]);
    const [companyJobs, setCompanyJobs] = useState([]);
    const { id } = useParams();
    const navigate = useNavigate();
    const jobsSectionRef = useRef(null);
    const t = translations[language];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [companyRes, companiesRes, jobsRes] = await Promise.all([
                    api.get(`employer/${id}`),
                    api.get('employer'),
                    api.get('jobs'),
                ]);

                const company = companyRes.data || {};
                setData(company);

                if (companiesRes.data) {
                    setSuggestedCompanies(
                        companiesRes.data.filter((c) => c._id !== id).slice(0, 3),
                    );
                }

                if (jobsRes.data) {
                    const filteredJobs = jobsRes.data.filter(
                        (job) =>
                            (company.user_id &&
                                job.employer_id &&
                                String(job.employer_id) === String(company.user_id)) ||
                            (job.company_name &&
                                company.company_name &&
                                job.company_name.trim().toLowerCase() ===
                                    company.company_name.trim().toLowerCase()),
                    );
                    setCompanyJobs(filteredJobs);
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, [api, id]);

    const handleViewJobs = () => {
        if (jobsSectionRef.current) {
            jobsSectionRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }
    };

    return (
        <div>
            <div className={cx('banner')}>
                <div className={cx('bannerContent')}>
                    <div className={cx('logoContainer')}>
                        <img 
                            src={data.logo || 'https://via.placeholder.com/120x120?text=Logo'} 
                            alt={data.company_name || 'Company Logo'} 
                            onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/120x120?text=' + (data.company_name?.charAt(0) || 'C');
                            }}
                        />
                    </div>
                    <div className={cx('companyInfo')}>
                        <h1>{data.company_name}</h1>
                        <p className={cx('industry')}>{data.industry}</p>
                        <div className={cx('details')}>
                            {data.address && (
                                <p>
                                    <i className="fas fa-map-marker-alt"></i>
                                    {data.address}
                                </p>
                            )}
                            {data.size && (
                                <p>
                                    <i className="fas fa-users"></i>
                                    {data.size} {language === 'vi' ? 'nhân viên' : 'employees'}
                                </p>
                            )}
                            <p>
                                <i className="fas fa-briefcase"></i>
                                {companyJobs.length} {language === 'vi' ? 'vị trí đang tuyển' : 'open positions'}
                            </p>
                        </div>
                        <button className={cx('viewJobsBtn')} onClick={handleViewJobs}>
                            {t.viewJobs || (language === 'vi' ? 'Xem việc làm' : 'View Jobs')}
                        </button>
                    </div>
                </div>
            </div>

            <div className={cx('mainLayout')}>
                <div className={cx('contentMain')}>
                    <div className={cx('contentSection')}>
                        <h2>{t.generalInfo || (language === 'vi' ? 'Thông tin chung' : 'General Information')}</h2>
                        <div className={cx('generalInfoContent')}>
                            <div className={cx('infoItem')}>
                                <span>{t.industry || (language === 'vi' ? 'Ngành nghề' : 'Industry')}</span>
                                <p>{data.industry || '-'}</p>
                            </div>
                            <div className={cx('infoItem')}>
                                <span>{t.companySize || (language === 'vi' ? 'Quy mô công ty' : 'Company Size')}</span>
                                <p>{data.size ? `${data.size} ${language === 'vi' ? 'nhân viên' : 'employees'}` : '-'}</p>
                            </div>
                            <div className={cx('infoItem')}>
                                <span>{language === 'vi' ? 'Địa chỉ' : 'Address'}</span>
                                <p>{data.address || '-'}</p>
                            </div>
                            <div className={cx('infoItem')}>
                                <span>{t.website || 'Website'}</span>
                                <p>
                                    {data.website ? (
                                        <a
                                            href={data.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {data.website}
                                        </a>
                                    ) : (
                                        '-'
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className={cx('contentSection')}>
                        <h2>{t.companyDescription || (language === 'vi' ? 'Mô tả công ty' : 'Company Description')}</h2>
                        <p>{data.description || (language === 'vi' ? 'Đang cập nhật thông tin mô tả công ty.' : 'Company description is being updated.')}</p>
                    </div>

                    <div className={cx('contentSection')} ref={jobsSectionRef}>
                        <h2>{language === 'vi' ? 'Các vị trí tuyển dụng' : 'Job Openings'}</h2>
                        <div className={cx('jobsList')}>
                            {companyJobs.length > 0 ? (
                                companyJobs.map((job) => (
                                    <div key={job.id || job._id} className={cx('jobItem')}>
                                        <div className={cx('jobHeader')}>
                                            <h3 className={cx('jobTitle')}>{job.title}</h3>
                                            <span className={cx('jobType')}>{job.job_type}</span>
                                        </div>
                                        <p className={cx('jobDepartment')}>{job.industry}</p>
                                        <p className={cx('jobLocation')}>
                                            <i className="fas fa-map-marker-alt"></i>
                                            {job.location}
                                        </p>
                                        <p className={cx('jobExperience')}>
                                            <i className="fas fa-briefcase"></i>
                                            {job.experience}
                                        </p>
                                        <button
                                            className={cx('applyBtn')}
                                            onClick={() => navigate(`/job/${job.id || job._id}`)}
                                        >
                                            {language === 'vi' ? 'Xem chi tiết' : 'View Details'}
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p style={{ color: '#888', fontSize: '14px' }}>
                                    {language === 'vi'
                                        ? 'Chưa có vị trí tuyển dụng.'
                                        : 'No job openings.'}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div className={cx('sidebar')}>
                    <div className={cx('suggestionButton')}>
                        <div className={cx('btn')} onClick={() => navigate('/company')}>
                            <i className="fa-solid fa-building"></i>
                            {t.companySuggestions || (language === 'vi' ? 'Gợi ý công ty' : 'Company Suggestions')}
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
                                        src={company.logo || 'https://via.placeholder.com/24x24?text=Co'}
                                        alt={company.company_name}
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/24x24?text=' + (company.company_name?.charAt(0) || 'C');
                                        }}
                                    />
                                </div>
                                <div className={cx('companyName')}>
                                    {company.company_name}
                                </div>
                                <div className={cx('heartIcon')}>
                                    <i className="fa-regular fa-heart"></i>
                                </div>
                            </div>
                        ))}
                        {suggestedCompanies.length === 0 && (
                            <p
                                style={{
                                    textAlign: 'center',
                                    color: '#888',
                                    padding: '12px',
                                    fontSize: '13px',
                                }}
                            >
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
