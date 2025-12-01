import React, { useContext, useEffect, useState } from 'react';
import styles from './CompanyDetail.module.scss';
import classNames from 'classnames/bind';
import SamsungLogo from '~/asset/img/Samsung.png';
import translations from '~/component/Translation';
import { AuthContext } from '~/context/AuthContext';
import { useParams } from 'react-router-dom';



const cx= classNames.bind(styles)
const CompanyDetail = ({onPageChange}) => {
    const {api,language}= useContext(AuthContext);
    const [data, setData]= useState([])
    const { id }= useParams()
    const t = translations[language];
    

    useEffect(()=> {
        const fetchData=async ()=> {
            try{
                const res= await api.get(`employer/${id}`)
                if(res.data) {
                    setData(res.data)
                }
            }catch(error) {
                console.error(error)
            }
        }
        fetchData()
    }, [])
    console.log(data)


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
                                {t.founded}: {data.email}
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
                            {[
                                {
                                    title: language === 'vi' ? 'Kỹ sư phần mềm' : 'Software Engineer',
                                    department: language === 'vi' ? 'Phòng IT' : 'IT Department',
                                    location: language === 'vi' ? 'Hồ Chí Minh' : 'Ho Chi Minh City',
                                    type: 'Full-time'
                                },
                                {
                                    title: language === 'vi' ? 'Chuyên viên Marketing' : 'Marketing Specialist',
                                    department: language === 'vi' ? 'Phòng Marketing' : 'Marketing Department',
                                    location: language === 'vi' ? 'Hà Nội' : 'Hanoi',
                                    type: 'Full-time'
                                },
                                {
                                    title: language === 'vi' ? 'Nhân viên kinh doanh' : 'Sales Executive',
                                    department: language === 'vi' ? 'Phòng kinh doanh' : 'Sales Department',
                                    location: language === 'vi' ? 'Đà Nẵng' : 'Da Nang',
                                    type: 'Full-time'
                                }
                            ].map((job, index) => (
                                <div key={index} className={cx('jobItem')}>
                                    <div className={cx('jobHeader')}>
                                        <h3 className={cx('jobTitle')}>{job.title}</h3>
                                        <span className={cx('jobType')}>{job.type}</span>
                                    </div>
                                    <p className={cx('jobDepartment')}>{job.department}</p>
                                    <p className={cx('jobLocation')}>
                                        <i className="fas fa-map-marker-alt"></i>
                                        {job.location}
                                    </p>
                                    <button className={cx('applyBtn')}>
                                        {language === 'vi' ? 'Ứng tuyển' : 'Apply Now'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className={cx('sidebar')}>
                    <div className={cx('suggestionButton')}>
                        <div className={cx('btn')} onClick={() => alert(t.alertMessage)}>
                            <i className="fa-solid fa-building"></i>
                            {t.companySuggestions}
                        </div>
                    </div>

                    <div className={cx('companiesList')}>
                        {[
                            { logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg', name: language === 'vi' ? 'Google Việt Nam' : 'Google Vietnam' },
                            { logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg', name: language === 'vi' ? 'Microsoft Việt Nam' : 'Microsoft Vietnam' },
                            { logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg', name: language === 'vi' ? 'Apple Việt Nam' : 'Apple Vietnam' }
                        ].map((company, index) => (
                            <div key={index} className={cx('companyItem')}>
                                <div className={cx('companyLogo')}>
                                    <img src={company.logo} alt="logo" onError={(e) => { e.target.src = 'https://via.placeholder.com/24x24?text=Logo'; }} />
                                </div>
                                <div className={cx('companyName')}>{company.name}</div>
                                <div className={cx('heartIcon')} onClick={() => alert(t.alertMessage)}>
                                    <i className="fa-regular fa-heart"></i>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyDetail;