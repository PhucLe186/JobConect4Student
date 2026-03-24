import React, { useState, useEffect, useContext, useRef } from 'react';
import styles from './Job.module.scss';
import translations from '~/component/Translation';
import { AuthContext } from '~/context/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import { analyzeCvMatch } from './cvMatchUtils';
import { createCompanyPlaceholder, mergeJobs, normalizeJob } from '~/user/component/shared/companyData';

const cx = classNames.bind(styles);

if (!document.querySelector('link[href*="fontawesome"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
    document.head.appendChild(link);
}

const Job = () => {
    const { api, language, user } = useContext(AuthContext);
    const [favorites, setFavorites] = useState({});
    const [JobData, setJobData] = useState({});
    const [suggestedJobs, setSuggestedJobs] = useState([]);
    const [showApplyPopup, setShowApplyPopup] = useState(false);
    const [cvOption, setCvOption] = useState('');
    const [uploadedCV, setUploadedCV] = useState(null);
    const [coverLetter, setCoverLetter] = useState('');
    const [cvMatchResult, setCvMatchResult] = useState(null);
    const [cvMatchError, setCvMatchError] = useState('');
    const [isAnalyzingCv, setIsAnalyzingCv] = useState(false);
    const navigate = useNavigate();
    const t = translations[language];
    const { id } = useParams();
    const analysisRequestRef = useRef(0);
    const formatJobDate = (value) => (value ? new Date(value).toLocaleDateString('vi-VN') : '--');
    const isMockJob = String(JobData.id || JobData._id || '').startsWith('mock-job-');

    const resetCvAnalysis = () => {
        analysisRequestRef.current += 1;
        setUploadedCV(null);
        setCvMatchResult(null);
        setCvMatchError('');
        setIsAnalyzingCv(false);
    };

    const closeApplyPopup = () => {
        resetCvAnalysis();
        setShowApplyPopup(false);
        setCvOption('');
        setCoverLetter('');
    };

    const getMatchHeadline = (score) => {
        if (language === 'vi') {
            if (score >= 80) return 'CV của bạn rất phù hợp với công việc này';
            if (score >= 60) return 'CV của bạn khá phù hợp với công việc này';
            if (score >= 40) return 'CV của bạn phù hợp ở mức trung bình với công việc này';
            return 'CV của bạn chưa phù hợp cao với công việc này';
        }

        if (score >= 80) return 'Your CV is a strong match for this job';
        if (score >= 60) return 'Your CV is a good match for this job';
        if (score >= 40) return 'Your CV is a moderate match for this job';
        return 'Your CV is not a strong match for this job yet';
    };

    const getMatchNote = (result) => {
        if (language === 'vi') {
            return result?.isLimitedContent
                ? 'Hệ thống chỉ đọc được một phần nội dung của CV, nên đây là mức phù hợp ước tính.'
                : 'Kết quả được ước tính từ nội dung CV và mô tả công việc hiện tại.';
        }

        return result?.isLimitedContent
            ? 'Only part of the CV content could be read, so this is a basic estimate.'
            : 'This score is estimated from the CV content and the current job description.';
    };

    const handleApplications = () => {
        setShowApplyPopup(true);
    };

    const handleCvOptionChange = (value) => {
        setCvOption(value);
        if (value !== 'upload') {
            resetCvAnalysis();
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files?.[0];

        if (!file) {
            resetCvAnalysis();
            return;
        }

        const allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ];

        if (!allowedTypes.includes(file.type)) {
            alert(language === 'vi' ? 'Chỉ chấp nhận file PDF, DOC, DOCX' : 'Only PDF, DOC, DOCX files are allowed');
            e.target.value = '';
            resetCvAnalysis();
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert(language === 'vi' ? 'File không được vượt quá 5MB' : 'File size must be under 5MB');
            e.target.value = '';
            resetCvAnalysis();
            return;
        }

        const requestId = analysisRequestRef.current + 1;
        analysisRequestRef.current = requestId;
        setUploadedCV(file);
        setCvMatchResult(null);
        setCvMatchError('');
        setIsAnalyzingCv(true);

        try {
            const analysisResult = await analyzeCvMatch(file, JobData);
            if (requestId !== analysisRequestRef.current) {
                return;
            }
            setCvMatchResult(analysisResult);
        } catch (error) {
            console.error('CV analysis failed:', error);
            if (requestId !== analysisRequestRef.current) {
                return;
            }
            setCvMatchError(
                language === 'vi'
                    ? 'Không thể phân tích CV này. Bạn vẫn có thể nộp hồ sơ, nhưng chưa hiển thị được mức độ phù hợp.'
                    : 'This CV could not be analyzed. You can still submit it, but the match score is unavailable.',
            );
        } finally {
            if (requestId === analysisRequestRef.current) {
                setIsAnalyzingCv(false);
            }
        }
    };

    const handleCreateCV = () => {
        navigate('/cv_builder');
        closeApplyPopup();
    };

    const handleApplySubmit = async () => {
        if (cvOption === 'upload' && !uploadedCV) {
            alert(language === 'vi' ? 'Vui lòng tải lên CV' : 'Please upload your CV');
            return;
        }

        if (cvOption === 'upload' && isAnalyzingCv) {
            alert(language === 'vi' ? 'Hệ thống đang phân tích CV, vui lòng đợi một chút' : 'Your CV is being analyzed, please wait');
            return;
        }

        if (cvOption === 'create') {
            handleCreateCV();
            return;
        }

        try {
            if (isMockJob) {
                alert(
                    language === 'vi'
                        ? 'Tin tuyển dụng mẫu này chỉ dùng để hiển thị giao diện, chưa thể nộp hồ sơ trực tiếp.'
                        : 'This sample job is for display only and cannot accept applications yet.',
                );
                return;
            }

            const formData = new FormData();
            formData.append('id', JobData._id);
            formData.append('cv', uploadedCV);
            formData.append('coverLetter', coverLetter);

            const res = await api.post('applications', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (res.data.status) {
                alert(res.data.status);
                closeApplyPopup();
            }
        } catch (error) {
            if (error.response) {
                alert(error.response?.data?.message);
            } else {
                alert(language === 'vi' ? 'Lỗi kết nối tới server' : 'Server connection error');
            }
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get(`jobs/${id}`);
                if (res.data) {
                    setJobData(normalizeJob(res.data));
                    return;
                }

                const fallbackJob = mergeJobs([]).find((job) => job.id === id);
                if (fallbackJob) {
                    setJobData(fallbackJob);
                }
            } catch (error) {
                const fallbackJob = mergeJobs([]).find((job) => job.id === id);
                if (fallbackJob) {
                    setJobData(fallbackJob);
                    return;
                }

                if (error.response) alert(error.response?.data?.message);
                else alert(language === 'vi' ? 'Lỗi kết nối tới server' : 'Server connection error');
            }
        };

        const fetchSuggestedJobs = async () => {
            try {
                const endpoint = user ? 'jobs/suggestions' : 'jobs';
                const res = await api.get(endpoint);
                if (res.data) setSuggestedJobs(mergeJobs(res.data).filter((job) => job.id !== id).slice(0, 3));
            } catch {
                try {
                    const res = await api.get('jobs');
                    if (res.data) setSuggestedJobs(mergeJobs(res.data).filter((job) => job.id !== id).slice(0, 3));
                } catch {
                    setSuggestedJobs(mergeJobs([]).filter((job) => job.id !== id).slice(0, 3));
                }
            }
        };

        fetchData();
        fetchSuggestedJobs();
    }, [api, id, language, user]);

    return (
        <div className={cx('container')}>
            <div className={cx('jobHeader')}>
                <div className={cx('headerContent')}>
                    <div className={cx('logoContainer')}>
                        <img
                            src={JobData.logo}
                            alt="Company Logo"
                            onError={(e) => {
                                e.currentTarget.src = createCompanyPlaceholder(JobData.company_name || JobData.title);
                            }}
                        />
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
                                {t.from} {formatJobDate(JobData.createdAt || JobData.created_at)} {t.to}{' '}
                                {formatJobDate(JobData.deadline)}{' '}
                            </span>
                        </div>
                        <div className={cx('buttons')}>
                            <button className={cx('applyBtn')} onClick={handleApplications}>
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
                            Email: <a href={`mailto:${JobData.email || ''}`}>{JobData.email || '--'}</a>
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
                                            onError={(e) => {
                                                e.currentTarget.src = createCompanyPlaceholder(job.company_name);
                                            }}
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

            {showApplyPopup && (
                <div className={cx('popup-overlay')} onClick={closeApplyPopup}>
                    <div className={cx('popup-content')} onClick={(e) => e.stopPropagation()}>
                        <div className={cx('popup-header')}>
                            <h3>{language === 'vi' ? 'Ứng tuyển việc làm' : 'Apply for Job'}</h3>
                            <button className={cx('popup-close')} onClick={closeApplyPopup}>
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
                                            onChange={(e) => handleCvOptionChange(e.target.value)}
                                        />
                                        <span>{language === 'vi' ? 'Tải lên CV có sẵn' : 'Upload existing CV'}</span>
                                    </label>
                                    <label className={cx('cv-option')}>
                                        <input
                                            type="radio"
                                            name="cvOption"
                                            value="create"
                                            checked={cvOption === 'create'}
                                            onChange={(e) => handleCvOptionChange(e.target.value)}
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

                                    {isAnalyzingCv && (
                                        <div className={cx('match-card', 'match-card--loading')}>
                                            <div className={cx('match-card-header')}>
                                                <div>
                                                    <span className={cx('match-label')}>
                                                        {language === 'vi' ? 'Mức độ phù hợp CV' : 'CV match score'}
                                                    </span>
                                                    <strong>{language === 'vi' ? 'Đang phân tích CV...' : 'Analyzing CV...'}</strong>
                                                </div>
                                                <div className={cx('match-score', 'match-score--loading')}>
                                                    <i className="fas fa-spinner fa-spin"></i>
                                                </div>
                                            </div>
                                            <p className={cx('match-note')}>
                                                {language === 'vi'
                                                    ? 'Hệ thống đang đối chiếu nội dung CV với mô tả công việc.'
                                                    : 'The system is comparing your CV with the job description.'}
                                            </p>
                                        </div>
                                    )}

                                    {cvMatchError && !isAnalyzingCv && (
                                        <div className={cx('match-card', 'match-card--low')}>
                                            <div className={cx('match-card-header')}>
                                                <div>
                                                    <span className={cx('match-label')}>
                                                        {language === 'vi' ? 'Mức độ phù hợp CV' : 'CV match score'}
                                                    </span>
                                                    <strong>{language === 'vi' ? 'Chưa phân tích được CV' : 'CV analysis unavailable'}</strong>
                                                </div>
                                                <div className={cx('match-score')}>--</div>
                                            </div>
                                            <p className={cx('match-note')}>{cvMatchError}</p>
                                        </div>
                                    )}

                                    {cvMatchResult && !isAnalyzingCv && (
                                        <div className={cx('match-card', `match-card--${cvMatchResult.tone}`)}>
                                            <div className={cx('match-card-header')}>
                                                <div>
                                                    <span className={cx('match-label')}>
                                                        {language === 'vi' ? 'Mức độ phù hợp CV' : 'CV match score'}
                                                    </span>
                                                    <strong>{getMatchHeadline(cvMatchResult.score)}</strong>
                                                </div>
                                                <div className={cx('match-score')}>{cvMatchResult.score}%</div>
                                            </div>

                                            <div className={cx('match-progress')}>
                                                <span style={{ width: `${cvMatchResult.score}%` }}></span>
                                            </div>

                                            <p className={cx('match-note')}>{getMatchNote(cvMatchResult)}</p>

                                            {cvMatchResult.matchedKeywords.length > 0 && (
                                                <div className={cx('match-keywords')}>
                                                    <span className={cx('match-keywords-title')}>
                                                        {language === 'vi' ? 'Điểm mạnh khớp' : 'Matching strengths'}
                                                    </span>
                                                    <div className={cx('match-chip-list')}>
                                                        {cvMatchResult.matchedKeywords.map((keyword) => (
                                                            <span key={keyword} className={cx('match-chip', 'match-chip--positive')}>
                                                                {keyword}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {cvMatchResult.missingKeywords.length > 0 && (
                                                <div className={cx('match-keywords')}>
                                                    <span className={cx('match-keywords-title')}>
                                                        {language === 'vi' ? 'Từ khóa còn thiếu' : 'Missing keywords'}
                                                    </span>
                                                    <div className={cx('match-chip-list')}>
                                                        {cvMatchResult.missingKeywords.map((keyword) => (
                                                            <span key={keyword} className={cx('match-chip', 'match-chip--neutral')}>
                                                                {keyword}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
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
                            <button className={cx('popup-btn', 'popup-btn--cancel')} onClick={closeApplyPopup}>
                                {language === 'vi' ? 'Hủy' : 'Cancel'}
                            </button>
                            <button
                                className={cx('popup-btn', 'popup-btn--submit')}
                                onClick={handleApplySubmit}
                                disabled={!cvOption || isAnalyzingCv}
                            >
                                {cvOption === 'create'
                                    ? language === 'vi'
                                        ? 'Đi đến tạo CV'
                                        : 'Go to CV Builder'
                                    : isAnalyzingCv
                                      ? language === 'vi'
                                          ? 'Đang phân tích...'
                                          : 'Analyzing...'
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
