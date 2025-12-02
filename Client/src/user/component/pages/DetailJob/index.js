import React, { useState, useEffect, useContext } from 'react';
import styles from './Job.module.scss';
import NaverLogo from '~/asset/img/Naver.png';
import MBLogo from '~/asset/img/MB.png';
import MicrosoftLogo from '~/asset/img/Microsoft.png';
import translations from '~/component/Translation';
import { AuthContext } from '~/context/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import ApplyPopup from './Popup';

const cx= classNames.bind(styles)

// Thêm FontAwesome
if (!document.querySelector('link[href*="fontawesome"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
    document.head.appendChild(link);
}

const Job = () => {
    const {api, language} = useContext(AuthContext);
    const [favorites] = useState({});
    const [JobData, setJobData]= useState([])
    const [showApplyPopup, setShowApplyPopup] = useState(false);
    const [cvOption, setCvOption] = useState(''); // 'upload' or 'create'
    const [uploadedCV, setUploadedCV] = useState(null);
    const [coverLetter, setCoverLetter] = useState('');
    const navigate = useNavigate();
    const t = translations[language];
    const {id}= useParams()



    const HandleApplications=async(id)=> {
        setShowApplyPopup(true);
    }

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (allowedTypes.includes(file.type)) {
                setUploadedCV(file);
            } else {
                alert(language === 'vi' ? 'Chỉ chấp nhận file PDF, DOC, DOCX' : 'Only PDF, DOC, DOCX files are allowed');
            }
        }
    };

    const handleCreateCV = () => {
        navigate('/cv_builder');
        setShowApplyPopup(false);
    };

    const handleApplySubmit = async () => {
        if (cvOption === 'upload' && !uploadedCV) {
            alert(language === 'vi' ? 'Vui lòng tải lên CV' : 'Please upload your CV');
            return;
        }
        if (cvOption === 'create') {
            handleCreateCV();
            return;
        }
        
        try{
            const formData = new FormData();
            formData.append('id', JobData._id);
            formData.append('cv', uploadedCV);
            formData.append('coverLetter', coverLetter);
            
            const res = await api.post('applications', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            if(res.data.status) {
                alert(res.data.status)
                setShowApplyPopup(false);
                setCvOption('');
                setUploadedCV(null);
                setCoverLetter('');
            }
        }catch(error) {
            if(error.response) {
                alert(error.response?.data?.message)
            }
            else {
                alert('lỗi kết nối tới server')
            }
        }
    };

    useEffect(()=> {
        const fetchData=async()=> {
            try{
                const res= await api.get(`jobs/${id}`)
                if(res.data) {
                    setJobData(res.data)
                }
            }catch(error) {
                if(error.response) {
                    alert(error.response?.data?.message)
                }
                else {
                    alert('lỗi kết nối tới server')
                }
            }
        }
        fetchData()
    }, [])
    

    return (
        <div className={cx('container')}>
            <div className={cx('jobHeader')}>
                <div className={cx('headerContent')}>
                    <div className={cx('logoContainer')}>
                        <img
                            src={JobData.logo}
                            alt="LG Logo"
                        />
                    </div>
                    <div className={cx('jobInfo')}>
                        <h1>{JobData.title}</h1>
                        <p className={cx('companyName')}>{JobData.company_name}</p>
                        <div className={cx('jobDetail')}>
                            <i className="fas fa-map-marker-alt"></i>
                            <span>
                               {JobData.location}
                            </span>
                        </div>
                        <div className={cx('jobDetail')}>
                            <i className="fas fa-briefcase"></i>
                            <span>{JobData.experience}</span>
                        </div>
                        <div className={cx('jobDetail')}>
                            <i className="fas fa-clock"></i>
                            <span>{JobData.job_type}</span>
                        </div>
                        <div className={cx('jobDetail')}>
                            <i className="fas fa-calendar-alt"></i>
                            <span>{t.from} {new Date(JobData.createdAt).toLocaleDateString("vi-VN")} {t.to} {new Date(JobData.deadline).toLocaleDateString("vi-VN")} </span>
                        </div>
                        <div className={cx('buttons')}>
                            <button 
                                className={cx('applyBtn')}
                                onClick={() => HandleApplications(JobData._id)}
                            >
                                {t.applyNow}
                            </button>
                            <button className={cx('saveBtn')}>
                                {t.save}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className={cx('mainContent')}>
                <div className={cx('contentMain')}>

                    <div className={cx('contentSection')}>
                        <h2>{t.jobDescription}</h2>
                        <p>
                            <strong>{JobData.title}</strong>
                        </p>
                        <p>
                           {JobData.description}
                        </p>
                    </div>
                    <div className={cx('contentSection')}>
                        <h2>{t.requirements}</h2>
                        <p>{JobData.requirements}</p>
                    </div>

                    <div className={cx('contentSection')}>
                        <h2>{t.experienceSkills}</h2>
                        <div className={cx('skillsContent')}>
                            <div className={cx('skillColumn')}>
                                <div className={cx('skillItem')}>
                                    <span>{t.jobType}</span>
                                    <p>{JobData.job_type}</p>
                                </div>
                                <div className={cx('skillItem')}>
                                    <span>{t.level}</span>
                                    <p>{JobData.level}</p>
                                </div>
                                <div className={cx('skillItem')}>
                                    <span>{t.education}</span>
                                    <p>{t.graduated}</p>
                                </div>
                            </div>
                            <div className={cx('skillColumn')}>
                                <div className={cx('skillItem')}>
                                    <span>{t.Experience}</span>
                                    <p>{JobData.experience}</p>
                                </div>
                                <div className={cx('skillItem')}>
                                    <span>{t.programmingLang}</span>
                                    <p>C/C++, Java, Python</p>
                                </div>
                                <div className={cx('skillItem')}>
                                    <span>{t.industry}</span>
                                    <p>{JobData.industry}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={cx('contentSection')}>
                        <h2>{t.contactInfo}</h2>
                        <p>
                            <strong>{t.applicationContact}</strong>
                        </p>
                        <p>
                            Email: <a href="mailto:vanchisencm2022@gmail.com">{JobData.email}</a>
                        </p>
                        <p>
                            {t.phone}: <span>{JobData.phone}</span>
                        </p>
                        <p>
                            {t.address}: <span>{JobData.location}</span>
                        </p>
                        <p>
                            {t.workingHours}: <span>{JobData.workingHours}</span>
                        </p>
                    
                    </div>
                </div>

                <div className={cx('sidebar')}>
                    <div className={cx('suggestionCard')}>
                        <div className={cx('suggestionButton')}>
                            <div className={cx('btn} onClick={handleJobSuggestionClick')}>
                                <i className="fa-solid fa-bell"></i>
                                {t.jobSuggestions}
                            </div>
                        </div>

                        <div className={cx('jobsList')}>
                        {[
                            {
                                id: 1,
                                logo: NaverLogo,
                                title: 'Dev',
                                company: language === 'vi' ? 'Công Ty công nghệ NAVER' : 'NAVER Technology Company',
                                location: language === 'vi' ? 'Hà Nội' : 'Hanoi',
                                salary: language === 'vi' ? '20 triệu - 40 triệu' : '20M - 40M VND',
                            },
                            {
                                id: 2,
                                logo: MBLogo,
                                title: 'Software Engineer',
                                company: language === 'vi' ? 'Ngân Hàng Quân Đội MB Bank' : 'Military Bank MB Bank',
                                location: language === 'vi' ? 'Thành Phố Hồ Chí Minh' : 'Ho Chi Minh City',
                                salary: language === 'vi' ? '11 triệu - 15 triệu' : '11M - 15M VND',
                            },
                            {
                                id: 3,
                                logo: MicrosoftLogo,
                                title: 'Cloud Developer',
                                company:
                                    language === 'vi'
                                        ? 'Công Ty phần mềm và hỗ trợ Microsoft'
                                        : 'Microsoft Software and Support Company',
                                location: language === 'vi' ? 'Hồ Chí Minh' : 'Ho Chi Minh City',
                                salary: language === 'vi' ? '10 triệu - 15 triệu' : '10M - 15M VND',
                            },
                        ].map((job, index) => (
                            <div key={job.id} className={cx('jobItem')}>
                                <div className={cx('jobLogo')}>
                                    <img src={job.logo} alt="logo" />
                                </div>
                                <div className={cx('jobDetails')}>
                                    <div className={cx('jobTitle')}>{job.title}</div>
                                    <div className={cx('jobCompany')}>{job.company}</div>
                                    <div className={cx('jobLocation')}>
                                        <i className="fa-solid fa-location-dot"></i>
                                        {job.location}
                                    </div>
                                    <div className={cx('jobSalary')}>
                                        <i className="fa-solid fa-dollar-sign"></i>
                                        {job.salary}
                                    </div>
                                </div>
                                <div
                                    className={`${styles.heartIcon} ${favorites[job.id] ? styles.active : styles.inactive}`}
                                   
                                >
                                    <i className={favorites[job.id] ? 'fa-solid fa-heart' : 'fa-regular fa-heart'}></i>
                                </div>
                            </div>
                        ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Apply Popup */}
            {showApplyPopup && <ApplyPopup language={language} JobData={JobData} setShowApplyPopup={setShowApplyPopup} api={api} />}
        </div>
    );
};

export default Job;
