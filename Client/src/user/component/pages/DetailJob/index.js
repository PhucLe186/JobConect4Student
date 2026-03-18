import React, { useState, useEffect, useContext } from 'react';
import styles from './Job.module.scss';
import translations from '~/component/Translation';
import { AuthContext } from '~/context/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import ApplicationModal from './ApplicationModal';

const cx = classNames.bind(styles);

// Thêm FontAwesome
if (!document.querySelector('link[href*="fontawesome"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
    document.head.appendChild(link);
}

const Job = ({ onBack, onPageChange }) => {
    const { api, language, user } = useContext(AuthContext);
    const [favorites, setFavorites] = useState({});
    const [JobData, setJobData] = useState([]);
    const [suggestedJobs, setSuggestedJobs] = useState([]);
    const [showApplyPopup, setShowApplyPopup] = useState(false);
    const [cvOption, setCvOption] = useState(''); // 'upload' or 'create'
    const [uploadedCV, setUploadedCV] = useState(null);
    const [coverLetter, setCoverLetter] = useState('');
    const navigate = useNavigate();
    const t = translations[language];
    const { id } = useParams();

    const HandleApplications = async (id) => {
        setShowApplyPopup(true);
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const allowedTypes = [
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            ];
            if (allowedTypes.includes(file.type)) {
                setUploadedCV(file);
            } else {
                alert(
                    language === 'vi' ? 'Chỉ chấp nhận file PDF, DOC, DOCX' : 'Only PDF, DOC, DOCX files are allowed',
                );
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

        try {
            const formData = new FormData();
            formData.append('id', JobData._id);
            formData.append('cv', uploadedCV);
            formData.append('coverLetter', coverLetter);

            const res = await api.post('applications', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (res.data.status) {
                alert(res.data.status);
                setShowApplyPopup(false);
                setCvOption('');
                setUploadedCV(null);
                setCoverLetter('');
            }
        } catch (error) {
            if (error.response) {
                alert(error.response?.data?.message);
            } else {
                alert('lỗi kết nối tới server');
            }
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get(`jobs/${id}`);
                if (res.data) setJobData(res.data);
            } catch (error) {
                if (error.response) alert(error.response?.data?.message);
                else alert('lỗi kết nối tới server');
            }
        };
        const fetchSuggestedJobs = async () => {
            try {
                const endpoint = user ? 'jobs/suggestions' : 'jobs';
                const res = await api.get(endpoint);
                if (res.data) setSuggestedJobs(res.data.slice(0, 3));
            } catch {
                try {
                    const res = await api.get('jobs');
                    if (res.data) setSuggestedJobs(res.data.slice(0, 3));
                } catch {}
            }
        };
        fetchData();
        fetchSuggestedJobs();
    }, [api, id, user]);

    return (
        <div className={cx('container')}>
            <div className={cx('jobHeader')}>
                <div className={cx('headerContent')}>
                    <div className={cx('logoContainer')}>
                        <img src={JobData.logo} alt="LG Logo" />
                    </div>
                    <div className={cx('jobInfo')}>
                        <h1>{JobData.title}</h1>
                        <p className={cx('companyName')}>{JobData.company_name}</p>
                        <div className={cx('jobDetail')}>
                            <i className="fas fa-map-marker-alt"></i>
                            <span>{JobData.location}</span>
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
                            <span>
                                {t.from} {new Date(JobData.createdAt).toLocaleDateString('vi-VN')} {t.to}{' '}
                                {new Date(JobData.deadline).toLocaleDateString('vi-VN')}{' '}
                            </span>
                        </div>
                        <div className={cx('buttons')}>
                            <button className={cx('applyBtn')} onClick={HandleApplications}>
                                {t.applyNow}
                            </button>
                            <button className={cx('saveBtn')}>{t.save}</button>
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
                        <p>{JobData.description}</p>
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
                            <div className={cx('btn')} onClick={() => navigate('/job-suggestions')}>
                                <i className="fa-solid fa-bell"></i>
                                {t.jobSuggestions}
                            </div>
                        </div>

                        <div className={cx('jobsList')}>
                            {suggestedJobs.map((job) => (
                                <div
                                    key={job.id}
                                    className={cx('jobItem')}
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => navigate(`/job/${job.id}`)}
                                >
                                    <div className={cx('jobLogo')}>
                                        <img
                                            src={job.logo}
                                            alt={job.company_name}
                                            onError={(e) => { e.target.src = 'https://via.placeholder.com/40x40?text=Co'; }}
                                        />
                                    </div>
                                    <div className={cx('jobDetails')}>
                                        <div className={cx('jobTitle')}>{job.title}</div>
                                        <div className={cx('jobCompany')}>{job.company_name}</div>
                                    </div>
                                    <div
                                        className={`${styles.heartIcon} ${favorites[job.id] ? styles.active : styles.inactive}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setFavorites((prev) => ({ ...prev, [job.id]: !prev[job.id] }));
                                        }}
                                    >
                                        <i className={favorites[job.id] ? 'fa-solid fa-heart' : 'fa-regular fa-heart'}></i>
                                    </div>
                                </div>
                            ))}
                            {suggestedJobs.length === 0 && (
                                <p style={{ textAlign: 'center', color: '#888', padding: '12px', fontSize: '13px' }}>
                                    {language === 'vi' ? 'Đang tải...' : 'Loading...'}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Apply Popup */}
            {showApplyPopup && (
                <div className={cx('popup-overlay')} onClick={() => setShowApplyPopup(false)}>
                    <div className={cx('popup-content')} onClick={(e) => e.stopPropagation()}>
                        <div className={cx('popup-header')}>
                            <h3>{language === 'vi' ? 'Ứng tuyển việc làm' : 'Apply for Job'}</h3>
                            <button className={cx('popup-close')} onClick={() => setShowApplyPopup(false)}>
                                ×
                            </button>
                        </div>

                        <div className={cx('popup-body')}>
                            <div className={cx('job-info')}>
                                <h4>{JobData.title}</h4>
                                <p>{JobData.company_name}</p>
                            </div>

                            <div className={cx('popup-field')}>
                                <label className={cx('popup-label')}>
                                    {language === 'vi' ? 'Chọn tùy chọn CV' : 'Choose CV Option'}{' '}
                                    <span className={cx('required')}>*</span>
                                </label>
                                <div className={cx('cv-options')}>
                                    <label className={cx('cv-option')}>
                                        <input
                                            type="radio"
                                            name="cvOption"
                                            value="upload"
                                            checked={cvOption === 'upload'}
                                            onChange={(e) => setCvOption(e.target.value)}
                                        />
                                        <span>{language === 'vi' ? 'Tải lên CV có sẵn' : 'Upload existing CV'}</span>
                                    </label>
                                    <label className={cx('cv-option')}>
                                        <input
                                            type="radio"
                                            name="cvOption"
                                            value="create"
                                            checked={cvOption === 'create'}
                                            onChange={(e) => setCvOption(e.target.value)}
                                        />
                                        <span>{language === 'vi' ? 'Tạo CV mới' : 'Create new CV'}</span>
                                    </label>
                                </div>
                            </div>

                            {cvOption === 'upload' && (
                                <div className={cx('popup-field')}>
                                    <label className={cx('popup-label')}>
                                        {language === 'vi'
                                            ? 'Tải lên file CV (PDF, DOC, DOCX)'
                                            : 'Upload CV file (PDF, DOC, DOCX)'}
                                    </label>
                                    <input
                                        type="file"
                                        className={cx('popup-file-input')}
                                        accept=".pdf,.doc,.docx"
                                        onChange={handleFileUpload}
                                    />
                                    {uploadedCV && (
                                        <div className={cx('uploaded-file')}>
                                            <i className="fas fa-file"></i>
                                            <span>{uploadedCV.name}</span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {cvOption === 'create' && (
                                <div className={cx('popup-field')}>
                                    <div className={cx('create-cv-info')}>
                                        <i className="fas fa-info-circle"></i>
                                        <span>
                                            {language === 'vi'
                                                ? 'Bạn sẽ được chuyển đến trang tạo CV'
                                                : 'You will be redirected to CV builder page'}
                                        </span>
                                    </div>
                                </div>
                            )}

                            <div className={cx('popup-field')}>
                                <label className={cx('popup-label')}>
                                    {language === 'vi' ? 'Thư xin việc (tùy chọn)' : 'Cover Letter (optional)'}
                                </label>
                                <textarea
                                    className={cx('popup-textarea')}
                                    rows={6}
                                    placeholder={
                                        language === 'vi'
                                            ? 'Viết thư xin việc để tăng cơ hội được tuyển dụng...'
                                            : 'Write a cover letter to increase your chances...'
                                    }
                                    value={coverLetter}
                                    onChange={(e) => setCoverLetter(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className={cx('popup-actions')}>
                            <button
                                className={cx('popup-btn', 'popup-btn--cancel')}
                                onClick={() => setShowApplyPopup(false)}
                            >
                                {language === 'vi' ? 'Hủy' : 'Cancel'}
                            </button>
                            <button
                                className={cx('popup-btn', 'popup-btn--submit')}
                                onClick={handleApplySubmit}
                                disabled={!cvOption}
                            >
                                {cvOption === 'create'
                                    ? language === 'vi'
                                        ? 'Đi đến tạo CV'
                                        : 'Go to CV Builder'
                                    : language === 'vi'
                                      ? 'Gửi ứng tuyển'
                                      : 'Submit Application'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Job;
