import React, { useContext, useEffect, useMemo, useState } from 'react';
import styles from './CompanyDetail.module.scss';
import classNames from 'classnames/bind';
import translations from '~/component/Translation';
import { AuthContext } from '~/context/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import { createCompanyPlaceholder, mergeCompanies, mergeJobs, normalizeCompany } from '~/user/component/shared/companyData';

const cx = classNames.bind(styles);

if (!document.querySelector('link[href*="fontawesome"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
    document.head.appendChild(link);
}

const CompanyDetail = () => {
    const { api, language } = useContext(AuthContext);
    const [data, setData] = useState(null);
    const [allCompanies, setAllCompanies] = useState([]);
    const [allJobs, setAllJobs] = useState([]);
    const { id } = useParams();
    const navigate = useNavigate();
    const t = translations[language];

    useEffect(() => {
        const fetchCompanyDetail = async () => {
            try {
                const [companyRes, companyListRes, jobsRes] = await Promise.all([
                    api.get(`employer/${id}`),
                    api.get('employer'),
                    api.get('jobs'),
                ]);

                const companies = mergeCompanies(companyListRes.data || []);
                const detailCompany = companyRes.data ? normalizeCompany(companyRes.data) : companies.find((company) => company._id === id);

                setAllCompanies(companies);
                setAllJobs(mergeJobs(jobsRes.data || []));
                setData(detailCompany || companies.find((company) => company._id === id) || null);
            } catch (error) {
                console.error(error);
                const companies = mergeCompanies([]);
                const jobs = mergeJobs([]);
                setAllCompanies(companies);
                setAllJobs(jobs);
                setData(companies.find((company) => company._id === id) || null);
            }
        };

        fetchCompanyDetail();
    }, [api, id]);

    const suggestedCompanies = useMemo(
        () => allCompanies.filter((company) => company._id !== id).slice(0, 3),
        [allCompanies, id],
    );

    const companyJobs = useMemo(() => {
        if (!data?.company_name) {
            return [];
        }

        return allJobs
            .filter((job) => job.company_name?.toLowerCase() === data.company_name.toLowerCase())
            .slice(0, 6);
    }, [allJobs, data]);

    if (!data) {
        return (
            <div className={cx('mainLayout')}>
                <div className={cx('contentSection')} style={{ width: '100%' }}>
                    <p>{language === 'vi' ? 'Đang tải thông tin công ty...' : 'Loading company details...'}</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className={cx('banner')}>
                <div className={cx('bannerContent')}>
                    <div className={cx('logoContainer')}>
                        <img
                            src={data.logo}
                            alt={data.company_name}
                            onError={(e) => {
                                e.currentTarget.src = createCompanyPlaceholder(data.company_name);
                            }}
                        />
                    </div>
                    <div className={cx('companyInfo')}>
                        <h1>{data.company_name}</h1>
                        <p className={cx('industry')}>{data.industry}</p>
                        <div className={cx('details')}>
                            <p>
                                <i className="fas fa-map-marker-alt"></i>
                                {data.address}
                            </p>
                            <p>
                                <i className="fas fa-users"></i>
                                {data.sizeLabel}
                            </p>
                            <p>
                                <i className="fas fa-briefcase"></i>
                                {companyJobs.length} {language === 'vi' ? 'vị trí đang tuyển' : 'open positions'}
                            </p>
                        </div>
                        <button className={cx('viewJobsBtn')} onClick={() => navigate('/jobs')}>
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
                                <p>{data.sizeLabel}</p>
                            </div>
                            <div className={cx('infoItem')}>
                                <span>{language === 'vi' ? 'Địa chỉ' : 'Address'}</span>
                                <p>{data.address}</p>
                            </div>
                            <div className={cx('infoItem')}>
                                <span>{t.website}</span>
                                <p>
                                    {data.website ? (
                                        <a href={data.website} target="_blank" rel="noopener noreferrer">
                                            {data.website}
                                        </a>
                                    ) : (
                                        language === 'vi' ? 'Đang cập nhật website' : 'Website updating'
                                    )}
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
                            {companyJobs.length > 0 ? (
                                companyJobs.map((job) => (
                                    <div key={job.id} className={cx('jobItem')}>
                                        <div className={cx('jobHeader')}>
                                            <h3 className={cx('jobTitle')}>{job.title}</h3>
                                            <span className={cx('jobType')}>{job.typeLabel}</span>
                                        </div>
                                        <p className={cx('jobDepartment')}>{job.industry}</p>
                                        <p className={cx('jobLocation')}>
                                            <i className="fas fa-map-marker-alt"></i>
                                            {job.location}
                                        </p>
                                        <p className={cx('jobLocation')}>
                                            <i className="fas fa-money-bill-wave"></i>
                                            {job.salaryLabel}
                                        </p>
                                        <p className={cx('jobLocation')}>
                                            <i className="fas fa-briefcase"></i>
                                            {job.experience}
                                        </p>
                                        <button className={cx('applyBtn')} onClick={() => navigate(`/job/${job.id}`)}>
                                            {language === 'vi' ? 'Xem chi tiết' : 'View details'}
                                        </button>
                                    </div>
                                ))
                            ) : (
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
                                        onError={(e) => {
                                            e.currentTarget.src = createCompanyPlaceholder(company.company_name);
                                        }}
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
