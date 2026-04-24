import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './Job.module.scss';
import translations from '~/component/Translation';
import { AuthContext } from '~/context/AuthContext';
import { createCompanyPlaceholder, mergeJobs, normalizeJob } from '~/user/component/shared/companyData';
import { buildProfileSuggestionCriteria, rankJobsByCriteria } from '~/user/component/shared/jobSuggestionUtils';
import { analyzeCvMatch } from './cvMatchUtils';

const cx = classNames.bind(styles);
const INITIAL_APPLICATION_FORM = {
    fullName: '',
    email: '',
    phone: '',
    desiredPosition: '',
    address: '',
    gpa: '',
    level: '',
    skillsSummary: '',
};
const LEVEL_OPTIONS = ['Intern', 'Fresher', 'Junior', 'Middle', 'Senior'];
const LEVEL_RANK = { intern: 0, fresher: 1, junior: 2, middle: 3, senior: 4 };
const FORM_SKILL_KEYWORDS = [
    'frontend', 'backend', 'fullstack', 'html', 'css', 'javascript', 'typescript',
    'react', 'vue', 'angular', 'node', 'express', 'nestjs', 'java', 'python', 'php',
    'laravel', 'mysql', 'sql', 'mongodb', 'docker', 'git', 'figma', 'english',
    'communication', 'teamwork',
];
const MAX_CV_FILE_SIZE = 5 * 1024 * 1024;

if (!document.querySelector('link[href*="fontawesome"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
    document.head.appendChild(link);
}

const normalizeCompare = (value = '') =>
    value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/node\.js/g, 'node')
        .replace(/react\.js/g, 'react')
        .replace(/vue\.js/g, 'vue')
        .replace(/next\.js/g, 'nextjs')
        .replace(/c\+\+/g, 'cplusplus')
        .replace(/c#/g, 'csharp')
        .replace(/[^a-z0-9\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

const unique = (items) => Array.from(new Set((items || []).filter(Boolean)));

const tokenizeCompare = (value = '') =>
    normalizeCompare(value)
        .split(' ')
        .filter((token) => token.length >= 2);

const findCanonicalLevel = (value = '') => {
    const normalized = normalizeCompare(value);

    if (!normalized) return '';
    if (normalized.includes('thuc tap') || normalized.includes('trainee') || normalized.includes('intern')) return 'intern';
    if (normalized.includes('fresher') || normalized.includes('graduate') || normalized.includes('new grad')) return 'fresher';
    if (normalized.includes('junior')) return 'junior';
    if (normalized.includes('middle') || normalized.includes('mid')) return 'middle';
    if (normalized.includes('senior') || normalized.includes('lead')) return 'senior';
    return '';
};

const getCriterionLabel = (key, language) => {
    const labels = {
        position: language === 'vi' ? 'chức vụ' : 'position',
        level: language === 'vi' ? 'level' : 'level',
        address: language === 'vi' ? 'địa chỉ' : 'address',
        skills: language === 'vi' ? 'kỹ năng' : 'skills',
        gpa: 'GPA',
    };

    return labels[key] || key;
};

const getToneByScore = (score) => {
    if (score >= 80) return 'strong';
    if (score >= 60) return 'good';
    if (score >= 40) return 'medium';
    return 'low';
};

const Job = () => {
    const { api, language, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const { id } = useParams();
    const t = translations[language] || {};
    const [favorites, setFavorites] = useState({});
    const [jobData, setJobData] = useState({});
    const [suggestedJobs, setSuggestedJobs] = useState([]);
    const [showApplyPopup, setShowApplyPopup] = useState(false);
    const [applyOption, setApplyOption] = useState('');
    const [applicationForm, setApplicationForm] = useState(INITIAL_APPLICATION_FORM);
    const [coverLetter, setCoverLetter] = useState('');
    const [uploadedCvName, setUploadedCvName] = useState('');
    const [uploadedCvFile, setUploadedCvFile] = useState(null);
    const [cvMatchResult, setCvMatchResult] = useState(null);
    const [formScoreResult, setFormScoreResult] = useState(null);
    const [isAnalyzingCv, setIsAnalyzingCv] = useState(false);
    const [isSubmittingApplication, setIsSubmittingApplication] = useState(false);
    const [cvAnalysisError, setCvAnalysisError] = useState('');
    const [applyNotice, setApplyNotice] = useState('');

    const popupIntro = useMemo(() => {
        if (language === 'vi') {
            if (!cvMatchResult) {
                return 'Tải CV trước để hệ thống chấm 5 tiêu chí: level, chức vụ, địa chỉ, kỹ năng và GPA. Sau khi xong, 2 lựa chọn ứng tuyển sẽ hiện ra.';
            }

            return 'CV đã được phân tích. Bây giờ bạn có thể chọn nhập form cơ bản hoặc chuyển qua tạo CV, sau đó hệ thống chấm điểm tiếp.';
        }

        if (!cvMatchResult) {
            return 'Upload your CV first so the system can score it by level, position, address, skills, and GPA before showing the next options.';
        }

        return 'Your CV has been analyzed. You can now fill the quick form or continue to the CV builder for the next scoring step.';
    }, [cvMatchResult, language]);

    const formatJobDate = (value) => (value ? new Date(value).toLocaleDateString('vi-VN') : '--');

    const closeApplyPopup = () => {
        setShowApplyPopup(false);
        setApplyOption('');
        setApplicationForm(INITIAL_APPLICATION_FORM);
        setCoverLetter('');
        setUploadedCvName('');
        setUploadedCvFile(null);
        setCvMatchResult(null);
        setFormScoreResult(null);
        setIsAnalyzingCv(false);
        setIsSubmittingApplication(false);
        setCvAnalysisError('');
        setApplyNotice('');
    };

    const getMatchHeadline = (score) => {
        if (language === 'vi') {
            if (score >= 80) return 'Hồ sơ của bạn rất phù hợp với công việc này';
            if (score >= 60) return 'Hồ sơ của bạn khá phù hợp với công việc này';
            if (score >= 40) return 'Hồ sơ của bạn phù hợp ở mức trung bình với công việc này';
            return 'Hồ sơ của bạn chưa phù hợp cao với công việc này';
        }
        if (score >= 80) return 'Your profile is a strong match for this job';
        if (score >= 60) return 'Your profile is a good match for this job';
        if (score >= 40) return 'Your profile is a moderate match for this job';
        return 'Your profile is not a strong match for this job yet';
    };

    const buildFormScoreResult = () => {
        const normalizedDesiredPosition = normalizeCompare(applicationForm.desiredPosition);
        const normalizedJobTitle = normalizeCompare(jobData.title);
        const desiredTokens = tokenizeCompare(applicationForm.desiredPosition);
        const jobTitleTokens = tokenizeCompare(jobData.title);
        const matchedPositionTokens = jobTitleTokens.filter((token) => desiredTokens.includes(token));
        const missingPositionTokens = jobTitleTokens.filter((token) => !desiredTokens.includes(token));
        const positionScore =
            normalizedDesiredPosition && normalizedJobTitle && normalizedDesiredPosition.includes(normalizedJobTitle)
                ? 95
                : jobTitleTokens.length > 0
                    ? Math.round(30 + (matchedPositionTokens.length / jobTitleTokens.length) * 60)
                    : 65;

        const expectedLevel = findCanonicalLevel(jobData.level);
        const currentLevel = findCanonicalLevel(applicationForm.level);
        const levelDistance =
            expectedLevel && currentLevel && typeof LEVEL_RANK[expectedLevel] === 'number' && typeof LEVEL_RANK[currentLevel] === 'number'
                ? Math.abs(LEVEL_RANK[expectedLevel] - LEVEL_RANK[currentLevel])
                : null;
        const levelScore = !expectedLevel ? 65 : !currentLevel ? 30 : levelDistance === 0 ? 92 : levelDistance === 1 ? 72 : 45;

        const addressTokens = tokenizeCompare(applicationForm.address);
        const jobAddressTokens = tokenizeCompare(jobData.location);
        const matchedAddressTokens = jobAddressTokens.filter((token) => addressTokens.includes(token));
        const addressScore =
            addressTokens.length > 0 && normalizeCompare(applicationForm.address).includes(normalizeCompare(jobData.location))
                ? 92
                : jobAddressTokens.length > 0
                    ? matchedAddressTokens.length > 0
                        ? Math.round(35 + (matchedAddressTokens.length / jobAddressTokens.length) * 45)
                        : 28
                    : 65;

        const normalizedSkills = normalizeCompare(applicationForm.skillsSummary);
        const normalizedJobContent = normalizeCompare(`${jobData.title || ''} ${jobData.requirements || ''} ${jobData.description || ''}`);
        const expectedSkillTerms = FORM_SKILL_KEYWORDS.filter((keyword) => normalizedJobContent.includes(keyword)).slice(0, 8);
        const matchedSkillTerms = expectedSkillTerms.filter((keyword) => normalizedSkills.includes(keyword));
        const missingSkillTerms = expectedSkillTerms.filter((keyword) => !normalizedSkills.includes(keyword));
        const skillsScore =
            expectedSkillTerms.length > 0
                ? Math.round(30 + (matchedSkillTerms.length / expectedSkillTerms.length) * 65)
                : applicationForm.skillsSummary.trim().length >= 20
                    ? 70
                    : 45;

        const rawGpa = Number(applicationForm.gpa || 0);
        const normalizedGpa = rawGpa > 4 && rawGpa <= 10 ? (rawGpa / 10) * 4 : rawGpa;
        const gpaScore = normalizedGpa >= 3.4 ? 94 : normalizedGpa >= 3.0 ? 82 : normalizedGpa >= 2.6 ? 65 : normalizedGpa > 0 ? 48 : 30;

        const criteriaScores = [
            {
                key: 'level',
                score: levelScore,
                detail: expectedLevel
                    ? currentLevel
                        ? levelDistance === 0
                            ? language === 'vi' ? `Level bạn chọn đã trùng với mức ${applicationForm.level}.` : `Your selected level matches ${applicationForm.level}.`
                            : language === 'vi' ? `Bạn chọn ${applicationForm.level}, trong khi tin đăng ưu tiên ${jobData.level}.` : `You selected ${applicationForm.level}, while the role prefers ${jobData.level}.`
                        : language === 'vi' ? 'Bạn chưa chọn level hiện tại.' : 'Current level is still missing.'
                    : language === 'vi' ? 'Tin đăng chưa yêu cầu level cụ thể.' : 'This job does not specify a strict level.',
                matchedKeywords: levelScore >= 70 && applicationForm.level ? [applicationForm.level] : [],
                missingKeywords: levelScore < 60 ? [jobData.level || (language === 'vi' ? 'Level yêu cầu' : 'Required level')] : [],
            },
            {
                key: 'position',
                score: positionScore,
                detail: matchedPositionTokens.length > 0
                    ? language === 'vi'
                        ? `Form đã có ${matchedPositionTokens.length}/${jobTitleTokens.length || 1} từ khóa trùng với chức vụ ${jobData.title || '--'}.`
                        : `The form matches ${matchedPositionTokens.length}/${jobTitleTokens.length || 1} position keywords from ${jobData.title || '--'}.`
                    : language === 'vi'
                        ? `Chức vụ bạn nhập chưa sát với vị trí ${jobData.title || '--'}.`
                        : `The entered position is not close to ${jobData.title || '--'} yet.`,
                matchedKeywords: matchedPositionTokens,
                missingKeywords: missingPositionTokens.slice(0, 3),
            },
            {
                key: 'address',
                score: addressScore,
                detail: matchedAddressTokens.length > 0
                    ? language === 'vi'
                        ? `Địa chỉ bạn nhập đang gần với khu vực ${jobData.location || '--'}.`
                        : `The provided address is close to ${jobData.location || '--'}.`
                    : language === 'vi'
                        ? `Địa chỉ bạn nhập chưa gần rõ với nơi làm việc ${jobData.location || '--'}.`
                        : `The provided address is not clearly close to ${jobData.location || '--'}.`,
                matchedKeywords: matchedAddressTokens,
                missingKeywords: addressScore < 60 ? [jobData.location || (language === 'vi' ? 'Địa chỉ làm việc' : 'Work location')] : [],
            },
            {
                key: 'skills',
                score: skillsScore,
                detail: matchedSkillTerms.length > 0
                    ? language === 'vi'
                        ? `Form đã khớp ${matchedSkillTerms.length}/${expectedSkillTerms.length || 1} kỹ năng nổi bật.`
                        : `The form matches ${matchedSkillTerms.length}/${expectedSkillTerms.length || 1} highlighted skills.`
                    : language === 'vi'
                        ? 'Kỹ năng bạn nhập chưa bắt được nhóm kỹ năng chính của công việc.'
                        : 'The entered skills do not capture the key skills of this job yet.',
                matchedKeywords: matchedSkillTerms,
                missingKeywords: missingSkillTerms.slice(0, 4),
            },
            {
                key: 'gpa',
                score: gpaScore,
                detail: rawGpa
                    ? language === 'vi'
                        ? `Hệ thống ghi nhận GPA ${applicationForm.gpa}${rawGpa > 4 ? '/10' : '/4'}.`
                        : `The system recorded GPA ${applicationForm.gpa}${rawGpa > 4 ? '/10' : '/4'}.`
                    : language === 'vi'
                        ? 'Bạn chưa nhập GPA.'
                        : 'GPA is missing.',
                matchedKeywords: gpaScore >= 70 && applicationForm.gpa ? [`GPA ${applicationForm.gpa}`] : [],
                missingKeywords: gpaScore < 60 ? ['GPA'] : [],
            },
        ];

        const finalScore = Math.round(criteriaScores.reduce((sum, item) => sum + item.score, 0) / criteriaScores.length);

        return {
            score: finalScore,
            tone: getToneByScore(finalScore),
            criteriaScores,
            matchedKeywords: unique(criteriaScores.flatMap((item) => item.matchedKeywords)).slice(0, 8),
            missingKeywords: unique(criteriaScores.flatMap((item) => item.missingKeywords)).slice(0, 8),
            note:
                language === 'vi'
                    ? 'Điểm này là lượt chấm tiếp theo từ form bổ sung bạn vừa điền, vẫn theo 5 tiêu chí tương tự CV.'
                    : 'This is the follow-up score from the extra form, using the same five criteria as the CV step.',
        };
    };

    const handleCvUpload = async (event) => {
        const file = event.target.files?.[0];

        if (!file) return;

        const extension = file.name.split('.').pop()?.toLowerCase();
        if (!['pdf', 'doc', 'docx'].includes(extension)) {
            setUploadedCvName('');
            setUploadedCvFile(null);
            setCvMatchResult(null);
            setApplyOption('');
            setFormScoreResult(null);
            setCvAnalysisError(language === 'vi' ? 'Chỉ hỗ trợ file PDF, DOC hoặc DOCX.' : 'Only PDF, DOC, and DOCX files are supported.');
            event.target.value = '';
            return;
        }

        if (file.size > MAX_CV_FILE_SIZE) {
            setUploadedCvName('');
            setUploadedCvFile(null);
            setCvMatchResult(null);
            setApplyOption('');
            setFormScoreResult(null);
            setCvAnalysisError(language === 'vi' ? 'File CV đang quá 5MB. Vui lòng chọn file nhẹ hơn.' : 'The CV file is larger than 5MB.');
            event.target.value = '';
            return;
        }

        setUploadedCvName(file.name);
        setUploadedCvFile(file);
        setIsAnalyzingCv(true);
        setCvAnalysisError('');
        setCvMatchResult(null);
        setApplyOption('');
        setFormScoreResult(null);
        setApplyNotice('');

        try {
            const result = await analyzeCvMatch(file, jobData);
            setCvMatchResult(result);
            setApplyNotice(
                language === 'vi'
                    ? `CV đã được chấm ${result.score}% theo 5 tiêu chí. Bạn có thể chọn một trong 2 cách ứng tuyển bên dưới.`
                    : `Your CV scored ${result.score}% across the five criteria. You can now choose one of the two apply options below.`,
            );
        } catch (error) {
            console.error('Error analyzing CV:', error);
            setUploadedCvName('');
            setUploadedCvFile(null);
            setCvMatchResult(null);
            setApplyOption('');
            setFormScoreResult(null);
            setApplyNotice('');
            setCvAnalysisError(
                language === 'vi'
                    ? 'Không thể đọc file CV này. Bạn thử file khác hoặc đổi sang PDF/DOCX để dễ phân tích hơn.'
                    : 'The system could not read this CV file. Please try another PDF/DOCX file.',
            );
        } finally {
            setIsAnalyzingCv(false);
            event.target.value = '';
        }
    };

    const handleScoreForm = () => {
        if (!cvMatchResult) {
            alert(language === 'vi' ? 'Vui lòng upload CV và đợi hệ thống chấm điểm trước.' : 'Please upload your CV and wait for the scoring first.');
            return;
        }

        if (!applyOption) {
            alert(language === 'vi' ? 'Vui lòng chọn một cách ứng tuyển.' : 'Please choose an apply option.');
            return;
        }

        if (applyOption === 'create') {
            navigate('/cv_builder');
            closeApplyPopup();
            return;
        }

        const requiredFields = [
            applicationForm.fullName,
            applicationForm.email,
            applicationForm.phone,
            applicationForm.desiredPosition,
            applicationForm.address,
            applicationForm.gpa,
            applicationForm.level,
            applicationForm.skillsSummary,
        ];

        if (requiredFields.some((value) => !String(value).trim())) {
            alert(
                language === 'vi'
                    ? 'Vui lòng nhập đầy đủ thông tin form cơ bản trước khi chấm điểm tiếp.'
                    : 'Please complete the quick form before continuing the second scoring step.',
            );
            return;
        }

        const result = buildFormScoreResult();
        setFormScoreResult(result);
        setApplyNotice(
            language === 'vi'
                ? `CV đã được chấm ${cvMatchResult.score}%, và form bổ sung hiện được chấm thêm ${result.score}%.`
                : `Your CV scored ${cvMatchResult.score}%, and the additional form is now scored at ${result.score}%.`,
        );
    };

    const handleSubmitApplication = async () => {
        if (!user) {
            alert(language === 'vi' ? 'Vui lòng đăng nhập trước khi ứng tuyển.' : 'Please sign in before applying.');
            return;
        }

        if (!uploadedCvFile) {
            alert(language === 'vi' ? 'Vui lòng tải CV lên trước khi nộp hồ sơ.' : 'Please upload your CV before submitting.');
            return;
        }

        if (applyOption === 'form' && !formScoreResult) {
            alert(language === 'vi' ? 'Vui lòng chấm điểm form bổ sung trước khi nộp hồ sơ.' : 'Please score the quick form before submitting.');
            return;
        }

        setIsSubmittingApplication(true);

        try {
            const submitData = new FormData();
            submitData.append('jobId', String(jobData.id || jobData._id || id || ''));
            submitData.append('fullName', applicationForm.fullName.trim());
            submitData.append('email', applicationForm.email.trim());
            submitData.append('phone', applicationForm.phone.trim());
            submitData.append('coverLetter', coverLetter.trim());
            submitData.append('cv', uploadedCvFile);

            const response = await api.post('applications/apply-with-details', submitData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            alert(response?.data?.status || (language === 'vi' ? 'Ứng tuyển thành công!' : 'Application submitted successfully!'));
            closeApplyPopup();
        } catch (error) {
            console.error('Error applying for job:', error);
            alert(
                error?.response?.data?.message ||
                    (language === 'vi'
                        ? 'Có lỗi xảy ra khi nộp hồ sơ ứng tuyển.'
                        : 'Something went wrong while submitting your application.'),
            );
        } finally {
            setIsSubmittingApplication(false);
        }
    };

    const handleApplySubmit = handleScoreForm;

    const buildFeedbackSummary = (result) => {
        const lowCriteria = (result.criteriaScores || [])
            .filter((criterion) => criterion.score < 60)
            .map((criterion) => getCriterionLabel(criterion.key, language));
        const highlightKeywords = (result.matchedKeywords || []).slice(0, 3);
        const missingKeywords = (result.missingKeywords || []).slice(0, 4);
        const feedback = [];

        feedback.push(
            language === 'vi'
                ? result.score >= 80
                    ? 'Nhận xét: Hồ sơ của bạn đang có độ phù hợp cao với vị trí này.'
                    : result.score >= 60
                        ? 'Nhận xét: Hồ sơ của bạn khá ổn, đã có nền tảng phù hợp để ứng tuyển.'
                        : result.score >= 40
                            ? 'Nhận xét: Hồ sơ đang ở mức trung bình, vẫn cần bổ sung thêm để nổi bật hơn.'
                            : 'Nhận xét: Hồ sơ hiện vẫn phù hợp thấp, nên bổ sung thêm trước khi nộp.'
                : result.score >= 80
                    ? 'Feedback: your profile is already a strong fit for this role.'
                    : result.score >= 60
                        ? 'Feedback: your profile is fairly solid and has a good base for this role.'
                        : result.score >= 40
                            ? 'Feedback: your profile is moderate and still needs a bit more work.'
                            : 'Feedback: your profile is still weak for this role and should be improved first.',
        );

        if (missingKeywords.length > 0) {
            feedback.push(
                language === 'vi'
                    ? `Đang thiếu hoặc chưa thể hiện rõ: ${missingKeywords.join(', ')}.`
                    : `Still missing or not clearly shown: ${missingKeywords.join(', ')}.`,
            );
        }

        if (lowCriteria.length > 0) {
            feedback.push(
                language === 'vi'
                    ? `Nên ưu tiên cải thiện: ${lowCriteria.join(', ')}.`
                    : `Priority areas to improve: ${lowCriteria.join(', ')}.`,
            );
        } else if (highlightKeywords.length > 0) {
            feedback.push(
                language === 'vi'
                    ? `Điểm đang ổn hiện tại: ${highlightKeywords.join(', ')}.`
                    : `Current strengths: ${highlightKeywords.join(', ')}.`,
            );
        }

        return feedback;
    };

    const renderMatchCard = (result, title, description) => (
        <div className={cx('match-card', `match-card--${result.tone}`)}>
            <div className={cx('match-card-header')}>
                <div>
                    <span className={cx('match-label')}>{title}</span>
                    <strong>{getMatchHeadline(result.score)}</strong>
                </div>
                <div className={cx('match-score')}>{result.score}%</div>
            </div>
            <div className={cx('match-progress')}>
                <span style={{ width: `${result.score}%` }}></span>
            </div>
            <p className={cx('match-note')}>{description || result.note}</p>
            <div className={cx('match-feedback')}>
                {buildFeedbackSummary(result).map((item) => (
                    <p key={item} className={cx('match-feedback-item')}>
                        {item}
                    </p>
                ))}
            </div>
        </div>
    );

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get(`jobs/${id}`);
                if (response.data) {
                    setJobData(normalizeJob(response.data));
                    return;
                }
                const fallbackJob = mergeJobs([]).find((job) => job.id === id);
                if (fallbackJob) setJobData(fallbackJob);
            } catch (error) {
                const fallbackJob = mergeJobs([]).find((job) => job.id === id);
                if (fallbackJob) {
                    setJobData(fallbackJob);
                    return;
                }
                if (error.response) alert(error.response?.data?.message);
                else alert(language === 'vi' ? 'Loi ket noi toi server' : 'Server connection error');
            }
        };

        const buildSuggestedJobs = async (jobs) => {
            let rankedJobs = jobs;
            if (user) {
                try {
                    const profileRes = await api.get('student');
                    const criteria = buildProfileSuggestionCriteria(profileRes.data || {});
                    rankedJobs = rankJobsByCriteria(jobs, criteria);
                } catch (error) {
                    console.error('Error fetching student profile for suggestions:', error);
                }
            }
            return rankedJobs.filter((job) => job.id !== id).slice(0, 3);
        };

        const fetchSuggestedJobs = async () => {
            try {
                const response = await api.get('jobs');
                setSuggestedJobs(await buildSuggestedJobs(mergeJobs(response.data || [])));
            } catch (error) {
                console.error('Error fetching suggested jobs:', error);
                setSuggestedJobs(await buildSuggestedJobs(mergeJobs([])));
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
                            src={jobData.logo}
                            alt="Company Logo"
                            onError={(event) => {
                                event.currentTarget.src = createCompanyPlaceholder(jobData.company_name || jobData.title);
                            }}
                        />
                    </div>
                    <div className={cx('jobInfo')}>
                        <h1>{jobData.title}</h1>
                        <p className={cx('companyName')}>{jobData.company_name}</p>
                        <div className={cx('jobDetail')}><i className="fas fa-map-marker-alt"></i><span>{jobData.location}</span></div>
                        <div className={cx('jobDetail')}><i className="fas fa-briefcase"></i><span>{jobData.experience}</span></div>
                        <div className={cx('jobDetail')}><i className="fas fa-clock"></i><span>{jobData.job_type}</span></div>
                        <div className={cx('jobDetail')}>
                            <i className="fas fa-calendar-alt"></i>
                            <span>{t.from} {formatJobDate(jobData.createdAt || jobData.created_at)} {t.to} {formatJobDate(jobData.deadline)}</span>
                        </div>
                        <div className={cx('buttons')}>
                            <button className={cx('applyBtn')} onClick={() => setShowApplyPopup(true)}>{t.applyNow}</button>
                            <button className={cx('saveBtn')}>{t.save}</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className={cx('mainContent')}>
                <div className={cx('contentMain')}>
                    <div className={cx('contentSection')}>
                        <h2>{t.jobDescription}</h2>
                        <p><strong>{jobData.title}</strong></p>
                        <p>{jobData.description}</p>
                    </div>
                    <div className={cx('contentSection')}>
                        <h2>{t.requirements}</h2>
                        <p>{jobData.requirements}</p>
                    </div>
                    <div className={cx('contentSection')}>
                        <h2>{t.experienceSkills}</h2>
                        <div className={cx('skillsContent')}>
                            <div className={cx('skillColumn')}>
                                <div className={cx('skillItem')}><span>{t.jobType}</span><p>{jobData.job_type}</p></div>
                                <div className={cx('skillItem')}><span>{t.level}</span><p>{jobData.level || '--'}</p></div>
                                <div className={cx('skillItem')}><span>{t.education}</span><p>{t.graduated}</p></div>
                            </div>
                            <div className={cx('skillColumn')}>
                                <div className={cx('skillItem')}><span>{t.Experience}</span><p>{jobData.experience}</p></div>
                                <div className={cx('skillItem')}><span>{t.programmingLang}</span><p>C/C++, Java, Python</p></div>
                                <div className={cx('skillItem')}><span>{t.industry}</span><p>{jobData.industry}</p></div>
                            </div>
                        </div>
                    </div>
                    <div className={cx('contentSection')}>
                        <h2>{t.contactInfo}</h2>
                        <p><strong>{t.applicationContact}</strong></p>
                        <p>Email: <a href={`mailto:${jobData.email || ''}`}>{jobData.email || '--'}</a></p>
                        <p>{t.phone}: <span>{jobData.phone || '--'}</span></p>
                        <p>{t.address}: <span>{jobData.location || '--'}</span></p>
                        <p>{t.workingHours}: <span>{jobData.workingHours || '--'}</span></p>
                    </div>
                </div>

                <div className={cx('sidebar')}>
                    <div className={cx('suggestionCard')}>
                        <div className={cx('suggestionButton')}>
                            <div className={cx('btn')} onClick={() => navigate('/job-suggestions')}><i className="fa-solid fa-bell"></i>{t.jobSuggestions}</div>
                        </div>
                        <p className={cx('suggestionCaption')}>
                            {language === 'vi' ? 'Danh sach nay duoc uu tien theo 5 tieu chi: Level, cong viec, dia chi, ky nang va GPA.' : 'This list is prioritized by level, job, address, skills, and GPA.'}
                        </p>
                        <div className={cx('jobsList')}>
                            {suggestedJobs.map((job) => (
                                <div key={job.id} className={cx('jobItem')} style={{ cursor: 'pointer' }} onClick={() => navigate(`/job/${job.id}`)}>
                                    <div className={cx('jobLogo')}>
                                        <img src={job.logo} alt={job.company_name} onError={(event) => { event.currentTarget.src = createCompanyPlaceholder(job.company_name); }} />
                                    </div>
                                    <div className={cx('jobDetails')}>
                                        <div className={cx('jobTitle')}>{job.title}</div>
                                        <div className={cx('jobCompany')}>{job.company_name}</div>
                                        {user && typeof job.suggestionScore === 'number' ? <div className={cx('jobSuggestionScore')}>{language === 'vi' ? 'Do phu hop' : 'Match'}: {job.suggestionScore}%</div> : null}
                                    </div>
                                    <div
                                        className={`${styles.heartIcon} ${favorites[job.id] ? styles.active : styles.inactive}`}
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            setFavorites((prev) => ({ ...prev, [job.id]: !prev[job.id] }));
                                        }}
                                    >
                                        <i className={favorites[job.id] ? 'fa-solid fa-heart' : 'fa-regular fa-heart'}></i>
                                    </div>
                                </div>
                            ))}
                            {suggestedJobs.length === 0 ? <p style={{ textAlign: 'center', color: '#888', padding: '12px', fontSize: '13px' }}>{language === 'vi' ? 'Dang tai...' : 'Loading...'}</p> : null}
                        </div>
                    </div>
                </div>
            </div>

            {showApplyPopup ? (
                <div className={cx('popup-overlay')} onClick={closeApplyPopup}>
                    <div className={cx('popup-content', 'popup-content--wide')} onClick={(event) => event.stopPropagation()}>
                        <div className={cx('popup-header')}>
                            <h3>{language === 'vi' ? 'Ứng tuyển việc làm' : 'Apply for Job'}</h3>
                            <button className={cx('popup-close')} onClick={closeApplyPopup}>x</button>
                        </div>

                        <div className={cx('popup-body')}>
                            <div className={cx('job-info')}>
                                <h4>{jobData.title}</h4>
                                <p>{jobData.company_name}</p>
                            </div>

                            <div className={cx('apply-intro')}>{popupIntro}</div>

                            <div className={cx('popup-field')}>
                                <label className={cx('popup-label')}>{language === 'vi' ? 'Bước 1: Upload CV trước' : 'Step 1: Upload your CV first'} <span className={cx('required')}>*</span></label>
                                <input className={cx('popup-file-input')} type="file" accept=".pdf,.doc,.docx" onChange={handleCvUpload} />
                                <div className={cx('upload-hint')}>
                                        {language === 'vi'
                                        ? 'Hệ thống đọc file PDF/DOC/DOCX và chấm theo 5 tiêu chí: level, chức vụ, địa chỉ, kỹ năng, GPA.'
                                        : 'The system reads PDF/DOC/DOCX files and scores five criteria: level, position, address, skills, and GPA.'}
                                </div>

                                {uploadedCvName ? (
                                    <div className={cx('uploaded-file')}>
                                        <i className="fas fa-file-alt"></i>
                                        <span>{uploadedCvName}</span>
                                    </div>
                                ) : null}

                                {cvAnalysisError ? <div className={cx('apply-notice', 'apply-notice--error')}>{cvAnalysisError}</div> : null}

                                {isAnalyzingCv ? (
                                    <div className={cx('match-card', 'match-card--loading')}>
                                        <div className={cx('match-card-header')}>
                                            <div>
                                                <span className={cx('match-label')}>{language === 'vi' ? 'Đang chấm CV' : 'Analyzing CV'}</span>
                                                <strong>{language === 'vi' ? 'Hệ thống đang đọc CV và đối chiếu 5 tiêu chí...' : 'The system is reading the CV against five criteria...'}</strong>
                                            </div>
                                            <div className={cx('match-score', 'match-score--loading')}>...</div>
                                        </div>
                                        <p className={cx('match-note')}>{language === 'vi' ? 'Vui lòng đợi trong giây lát để nhận kết quả.' : 'Please wait a moment for the result.'}</p>
                                    </div>
                                ) : null}

                                {cvMatchResult ? renderMatchCard(
                                    cvMatchResult,
                                    language === 'vi' ? 'Kết quả chấm CV vừa upload' : 'Uploaded CV score',
                                    language === 'vi' ? 'Đây là lượt chấm đầu tiên từ file CV bạn vừa tải lên.' : 'This is the first score from the CV file you uploaded.',
                                ) : null}
                            </div>

                            {cvMatchResult ? (
                                <>
                                    <div className={cx('section-divider')}><span>{language === 'vi' ? 'Bước 2: Chọn cách ứng tuyển tiếp theo' : 'Step 2: Choose what to do next'}</span></div>

                                    <div className={cx('popup-field')}>
                                        <label className={cx('popup-label')}>{language === 'vi' ? 'Chọn cách ứng tuyển' : 'Choose an apply option'} <span className={cx('required')}>*</span></label>
                                        <div className={cx('cv-options')}>
                                            <label className={cx('cv-option')}>
                                                <input type="radio" name="applyOption" value="form" checked={applyOption === 'form'} onChange={(event) => { setApplyOption(event.target.value); setFormScoreResult(null); }} />
                                                <span>{language === 'vi' ? 'Nhập form cơ bản' : 'Fill quick profile form'}</span>
                                            </label>
                                            <label className={cx('cv-option')}>
                                                <input type="radio" name="applyOption" value="create" checked={applyOption === 'create'} onChange={(event) => { setApplyOption(event.target.value); setFormScoreResult(null); }} />
                                                <span>{language === 'vi' ? 'Qua tạo CV' : 'Go to CV builder'}</span>
                                            </label>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className={cx('apply-notice')}>
                                    {language === 'vi' ? 'Hai lựa chọn ứng tuyển sẽ hiện sau khi CV được chấm xong.' : 'The two application options will appear after the CV is scored.'}
                                </div>
                            )}

                            {applyOption === 'form' && cvMatchResult ? (
                                <>
                                    <div className={cx('apply-notice')}>
                                        {language === 'vi'
                                            ? 'Bước 3: Điền form cơ bản để hệ thống chấm điểm thêm một lần nữa cùng 5 tiêu chí.'
                                            : 'Step 3: Complete the quick form for a second scoring pass using the same five criteria.'}
                                    </div>

                                    <div className={cx('basic-form-grid')}>
                                        <div className={cx('popup-field')}>
                                            <label className={cx('popup-label')}>{language === 'vi' ? 'Họ và tên' : 'Full name'} <span className={cx('required')}>*</span></label>
                                            <input className={cx('popup-input')} value={applicationForm.fullName} onChange={(event) => setApplicationForm((prev) => ({ ...prev, fullName: event.target.value }))} placeholder={language === 'vi' ? 'Nhập họ và tên' : 'Enter your full name'} />
                                        </div>
                                        <div className={cx('popup-field')}>
                                            <label className={cx('popup-label')}>Email <span className={cx('required')}>*</span></label>
                                            <input className={cx('popup-input')} type="email" value={applicationForm.email} onChange={(event) => setApplicationForm((prev) => ({ ...prev, email: event.target.value }))} placeholder="name@example.com" />
                                        </div>
                                        <div className={cx('popup-field')}>
                                            <label className={cx('popup-label')}>{language === 'vi' ? 'Số điện thoại' : 'Phone number'} <span className={cx('required')}>*</span></label>
                                            <input className={cx('popup-input')} value={applicationForm.phone} onChange={(event) => setApplicationForm((prev) => ({ ...prev, phone: event.target.value }))} placeholder={language === 'vi' ? 'Nhập số điện thoại' : 'Enter your phone'} />
                                        </div>
                                        <div className={cx('popup-field')}>
                                            <label className={cx('popup-label')}>{language === 'vi' ? 'Chức vụ mong muốn' : 'Desired position'} <span className={cx('required')}>*</span></label>
                                            <input className={cx('popup-input')} value={applicationForm.desiredPosition} onChange={(event) => setApplicationForm((prev) => ({ ...prev, desiredPosition: event.target.value }))} placeholder={jobData.title || (language === 'vi' ? 'Ví dụ: Frontend Developer' : 'Ex: Frontend Developer')} />
                                        </div>
                                        <div className={cx('popup-field')}>
                                            <label className={cx('popup-label')}>{language === 'vi' ? 'Địa chỉ hiện tại' : 'Current address'} <span className={cx('required')}>*</span></label>
                                            <input className={cx('popup-input')} value={applicationForm.address} onChange={(event) => setApplicationForm((prev) => ({ ...prev, address: event.target.value }))} placeholder={language === 'vi' ? 'Ví dụ: Thủ Đức, TP.HCM' : 'Ex: Thu Duc, Ho Chi Minh City'} />
                                        </div>
                                        <div className={cx('popup-field')}>
                                            <label className={cx('popup-label')}>GPA <span className={cx('required')}>*</span></label>
                                            <input className={cx('popup-input')} type="number" step="0.1" min="0" max="10" value={applicationForm.gpa} onChange={(event) => setApplicationForm((prev) => ({ ...prev, gpa: event.target.value }))} placeholder="3.2" />
                                        </div>
                                        <div className={cx('popup-field')}>
                                            <label className={cx('popup-label')}>{language === 'vi' ? 'Level hiện tại' : 'Current level'} <span className={cx('required')}>*</span></label>
                                            <select className={cx('popup-select')} value={applicationForm.level} onChange={(event) => setApplicationForm((prev) => ({ ...prev, level: event.target.value }))}>
                                                <option value="">{language === 'vi' ? 'Chọn level' : 'Choose level'}</option>
                                                {LEVEL_OPTIONS.map((level) => <option key={level} value={level}>{level}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    <div className={cx('popup-field')}>
                                        <label className={cx('popup-label')}>{language === 'vi' ? 'Tóm tắt kỹ năng' : 'Skills summary'} <span className={cx('required')}>*</span></label>
                                        <textarea className={cx('popup-textarea')} rows={4} value={applicationForm.skillsSummary} onChange={(event) => setApplicationForm((prev) => ({ ...prev, skillsSummary: event.target.value }))} placeholder={language === 'vi' ? 'Ví dụ: React, Node.js, Figma, giao tiếp, teamwork...' : 'Ex: React, Node.js, Figma, communication, teamwork...'} />
                                    </div>

                                    <div className={cx('popup-field')}>
                                        <label className={cx('popup-label')}>{language === 'vi' ? 'Giới thiệu thêm (tùy chọn)' : 'Additional note (optional)'}</label>
                                        <textarea className={cx('popup-textarea')} rows={4} value={coverLetter} onChange={(event) => setCoverLetter(event.target.value)} placeholder={language === 'vi' ? 'Bạn có thể viết ngắn gọn về mục tiêu hoặc điểm mạnh của mình...' : 'You can briefly describe your goals or strengths...'} />
                                    </div>
                                </>
                            ) : null}

                            {applyOption === 'create' && cvMatchResult ? (
                                <div className={cx('popup-field')}>
                                    <div className={cx('create-cv-info')}>
                                        <i className="fas fa-info-circle"></i>
                                        <span>
                                            {language === 'vi'
                                                ? 'Bạn sẽ được chuyển sang trang tạo CV. Sau khi tạo xong, bạn có thể quay lại để tiếp tục ứng tuyển.'
                                                : 'You will be redirected to the CV builder. After that, you can return here to continue applying.'}
                                        </span>
                                    </div>
                                </div>
                            ) : null}

                            {applyNotice ? <div className={cx('apply-score-banner')}>{applyNotice}</div> : null}

                            {formScoreResult ? renderMatchCard(
                                formScoreResult,
                                language === 'vi' ? 'Kết quả chấm điểm từ form bổ sung' : 'Follow-up score from the quick form',
                                language === 'vi' ? 'Đây là lượt chấm thứ hai sau khi bạn điền thêm thông tin trong form.' : 'This is the second scoring pass after you completed the quick form.',
                            ) : null}

                            {applyOption === 'form' && formScoreResult ? (
                                <div className={cx('inline-submit-actions')}>
                                    <button
                                        className={cx('popup-btn', 'popup-btn--apply')}
                                        onClick={handleSubmitApplication}
                                        disabled={isAnalyzingCv || isSubmittingApplication}
                                    >
                                        {isSubmittingApplication
                                            ? language === 'vi' ? 'Đang nộp CV...' : 'Submitting CV...'
                                            : language === 'vi' ? 'Nộp CV ứng tuyển' : 'Submit application'}
                                    </button>
                                </div>
                            ) : null}
                        </div>

                        <div className={cx('popup-actions')}>
                            <button className={cx('popup-btn', 'popup-btn--cancel')} onClick={closeApplyPopup}>{language === 'vi' ? 'Hủy' : 'Cancel'}</button>
                            <button className={cx('popup-btn', 'popup-btn--submit')} onClick={handleApplySubmit} disabled={isAnalyzingCv || isSubmittingApplication || !cvMatchResult || !applyOption}>
                                {applyOption === 'create'
                                    ? language === 'vi' ? 'Đi đến tạo CV' : 'Go to CV Builder'
                                    : applyOption === 'form'
                                        ? language === 'vi' ? 'Chấm điểm tiếp từ form' : 'Score the quick form'
                                        : language === 'vi' ? 'Chọn cách ứng tuyển' : 'Choose an apply option'}
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default Job;
