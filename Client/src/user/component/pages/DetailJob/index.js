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

const FEEDBACK_NOISE_KEYWORDS = new Set([
    'ho',
    'chi',
    'minh',
    'thanh',
    'pho',
    'tp',
    'hcm',
    'ha',
    'noi',
    'hn',
    'city',
    'district',
    'ward',
    'quan',
    'phuong',
]);

const formatFeedbackList = (items, language) => {
    const cleaned = unique(items).filter(Boolean);

    if (!cleaned.length) return '';
    if (cleaned.length === 1) return cleaned[0];

    const lastSeparator = language === 'vi' ? ' và ' : ' and ';
    return `${cleaned.slice(0, -1).join(', ')}${lastSeparator}${cleaned[cleaned.length - 1]}`;
};

const sanitizeFeedbackKeywords = (items) =>
    unique(items)
        .map((item) => String(item || '').trim())
        .filter(Boolean)
        .filter((item) => {
            const normalized = normalizeCompare(item);

            if (!normalized) return false;
            if (normalized.length < 3 && !['ai', 'ui', 'ux', 'qa'].includes(normalized)) return false;
            return !FEEDBACK_NOISE_KEYWORDS.has(normalized);
        });

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

const getFeedbackCriterionLabel = (key, language) => {
    const labels = {
        position: language === 'vi' ? 'vị trí ứng tuyển' : 'target position',
        level: language === 'vi' ? 'level kinh nghiệm' : 'experience level',
        address: language === 'vi' ? 'khu vực làm việc' : 'work location',
        skills: language === 'vi' ? 'kỹ năng chính' : 'core skills',
        gpa: 'GPA',
    };

    return labels[key] || getCriterionLabel(key, language);
};

const getCriterionActionLabel = (key, language, options = {}) => {
    const skillKeywords = options.skillKeywords || [];

    if (language === 'vi') {
        if (key === 'position') return 'vị trí mong muốn';
        if (key === 'level') return 'level kinh nghiệm';
        if (key === 'address') return 'khu vực có thể làm việc';
        if (key === 'skills') {
            return skillKeywords.length > 0
                ? `kỹ năng nổi bật như ${skillKeywords.join(', ')}`
                : 'kỹ năng nổi bật';
        }
        if (key === 'gpa') return 'GPA hiện tại';
        return '';
    }

    if (key === 'position') return 'your target position';
    if (key === 'level') return 'your experience level';
    if (key === 'address') return 'your preferred work location';
    if (key === 'skills') {
        return skillKeywords.length > 0
            ? `key skills such as ${skillKeywords.join(', ')}`
            : 'your key skills';
    }
    if (key === 'gpa') return 'your GPA';
    return '';
};

const getToneByScore = (score) => {
    if (score >= 80) return 'strong';
    if (score >= 60) return 'good';
    if (score >= 40) return 'medium';
    return 'low';
};

const isPositiveMatchScore = (score) => Number(score) > 80;

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
    const [uploadedCvPath, setUploadedCvPath] = useState('');
    const [cvMatchResult, setCvMatchResult] = useState(null);
    const [formScoreResult, setFormScoreResult] = useState(null);
    const [isAnalyzingCv, setIsAnalyzingCv] = useState(false);
    const [isSubmittingApplication, setIsSubmittingApplication] = useState(false);
    const [cvAnalysisError, setCvAnalysisError] = useState('');
    const [applyNotice, setApplyNotice] = useState('');
    const [applicationSubmitted, setApplicationSubmitted] = useState(false);
    
    // CV Builder states
    const [myResumes, setMyResumes] = useState([]);
    const [selectedCvId, setSelectedCvId] = useState('');
    const [applyMethod, setApplyMethod] = useState('upload'); // 'upload' or 'builder'

    const isEmployerAccount = user?.type === 'employer';
    const employerApplyBlockedMessage =
        language === 'vi'
            ? 'Tài khoản nhà tuyển dụng không thể nộp CV ứng tuyển. Vui lòng dùng tài khoản sinh viên/ứng viên.'
            : 'Employer accounts cannot submit job applications. Please use a student/candidate account.';

    useEffect(() => {
        if (showApplyPopup && !isEmployerAccount && user) {
            const fetchResumes = async () => {
                try {
                    const response = await api.get('resume');
                    if (response.data && Array.isArray(response.data)) {
                        setMyResumes(response.data);
                    }
                } catch (error) {
                    console.error('Lỗi khi tải danh sách CV:', error);
                }
            };
            fetchResumes();
        }
    }, [showApplyPopup, isEmployerAccount, user, api]);

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
        setUploadedCvPath('');
        setCvMatchResult(null);
        setFormScoreResult(null);
        setIsAnalyzingCv(false);
        setIsSubmittingApplication(false);
        setCvAnalysisError('');
        setApplyNotice('');
        setApplicationSubmitted(false);
        setApplyMethod('upload');
        setSelectedCvId('');
    };

    const handleOpenApplyPopup = () => {
        if (isEmployerAccount) {
            alert(employerApplyBlockedMessage);
            return;
        }

        setShowApplyPopup(true);
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

    const toClientScoreResult = (result, fallbackNote) => {
        const score = Number(result?.match_score || result?.score || 0);
        return {
            score,
            tone: getToneByScore(score),
            criteriaScores: Array.isArray(result?.criteriaScores) ? result.criteriaScores : [],
            matchedKeywords: Array.isArray(result?.matchedKeywords) ? result.matchedKeywords : [],
            missingKeywords: Array.isArray(result?.missingKeywords) ? result.missingKeywords : [],
            note: result?.message || fallbackNote || '',
        };
    };

    const buildFormPayload = (formState) => ({
        full_name: formState.fullName.trim(),
        email: formState.email.trim(),
        phone: formState.phone.trim(),
        position: formState.desiredPosition.trim(),
        address: formState.address.trim(),
        gpa: String(formState.gpa || '').trim(),
        level: String(formState.level || '').trim(),
        skill: formState.skillsSummary.trim(),
        cover_letter: coverLetter.trim(),
    });

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
        if (!['pdf', 'doc', 'docx', 'png', 'jpg', 'jpeg'].includes(extension)) {
            setUploadedCvName('');
            setUploadedCvFile(null);
            setUploadedCvPath('');
            setCvMatchResult(null);
            setApplyOption('');
            setFormScoreResult(null);
            setCvAnalysisError(language === 'vi' ? 'Chỉ hỗ trợ file PDF, DOC, DOCX, PNG, JPG.' : 'Only PDF, DOC, DOCX, PNG, and JPG files are supported.');
            event.target.value = '';
            return;
        }

        if (file.size > MAX_CV_FILE_SIZE) {
            setUploadedCvName('');
            setUploadedCvFile(null);
            setUploadedCvPath('');
            setCvMatchResult(null);
            setApplyOption('');
            setFormScoreResult(null);
            setCvAnalysisError(language === 'vi' ? 'File CV đang quá 5MB. Vui lòng chọn file nhỏ hơn.' : 'The CV file is larger than 5MB.');
            event.target.value = '';
            return;
        }

        setUploadedCvName(file.name);
        setUploadedCvFile(file);
        setUploadedCvPath('');
        setIsAnalyzingCv(true);
        setCvAnalysisError('');
        setCvMatchResult(null);
        setApplyOption('');
        setFormScoreResult(null);
        setApplyNotice('');
        setApplicationSubmitted(false);

        try {
            const submitData = new FormData();
            submitData.append('cv', file);

            const response = await api.post(`applications/apply-smart/${jobData.id || jobData._id || id}`, submitData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const result = response?.data?.data || {};
            const normalizedResult = toClientScoreResult(
                result,
                language === 'vi'
                    ? 'Đây là kết quả chấm tự động từ AI dựa trên CV và JD.'
                    : 'This is the AI screening result based on your CV and the job description.',
            );

            setCvMatchResult({
                ...normalizedResult,
                require_form: Boolean(result?.require_form),
                status: result?.status || '',
            });
            setUploadedCvPath(result?.cvFilePath || '');

            if (result?.formData) {
                setApplicationForm((prev) => ({
                    ...prev,
                    fullName: result.formData.full_name || result.formData.fullName || prev.fullName,
                    email: result.formData.email || prev.email,
                    phone: result.formData.phone || prev.phone,
                    desiredPosition: result.formData.position || prev.desiredPosition || jobData.title || '',
                    address: result.formData.address || prev.address,
                    gpa: result.formData.gpa || prev.gpa,
                    level: result.formData.level || prev.level,
                    skillsSummary: result.formData.skill || prev.skillsSummary,
                }));
            }

            if (result?.require_form) {
                setApplyOption('form');
                setApplyNotice(
                    result?.message ||
                    (language === 'vi'
                        ? `CV đang được AI chấm ${normalizedResult.score}%. Bạn nên bổ sung form để hệ thống chấm lại chính xác hơn.`
                        : `Your CV scored ${normalizedResult.score}%. Please complete the quick form for a more accurate score.`),
                );
                return;
            }

            setApplicationSubmitted(true);
            setApplyNotice(
                result?.message ||
                (language === 'vi'
                    ? `CV đạt ${normalizedResult.score}% và đã được nộp tự động thành công.`
                    : `Your CV scored ${normalizedResult.score}% and has been submitted automatically.`),
            );
        } catch (error) {
            console.error('Error analyzing CV:', error);
            const serverMessage = error?.response?.data?.message || '';
            const isAlreadyApplied =
                error?.response?.status === 409 ||
                serverMessage.includes('đã ứng tuyển') ||
                serverMessage.includes('already applied');

            if (isAlreadyApplied) {
                setUploadedCvName('');
                setUploadedCvFile(null);
                setUploadedCvPath('');
                setCvMatchResult(null);
                setApplyOption('');
                setFormScoreResult(null);
                setApplyNotice('');
                setCvAnalysisError(language === 'vi' ? 'Bạn đã ứng tuyển vị trí này rồi!' : 'You have already applied for this position.');
                return;
            }

            setUploadedCvName('');
            setUploadedCvFile(null);
            setUploadedCvPath('');
            setCvMatchResult(null);
            setApplyOption('');
            setFormScoreResult(null);
            setApplyNotice('');
            setCvAnalysisError(
                language === 'vi'
                    ? 'AI chưa sẵn sàng'
                    : 'AI is not ready',
            );
        } finally {
            setIsAnalyzingCv(false);
            event.target.value = '';
        }
    };

    const handleSelectCvBuilder = async () => {
        if (!selectedCvId) {
            alert(language === 'vi' ? 'Vui lòng chọn một CV từ danh sách.' : 'Please select a CV from the list.');
            return;
        }

        setIsAnalyzingCv(true);
        setCvAnalysisError('');
        setCvMatchResult(null);
        setApplyOption('');
        setFormScoreResult(null);
        setApplyNotice('');
        setApplicationSubmitted(false);

        try {
            const response = await api.post(`applications/apply-cv-builder/${jobData.id || jobData._id || id}`, {
                cvId: selectedCvId
            });

            const result = response?.data?.data || {};
            const normalizedResult = toClientScoreResult(
                result,
                language === 'vi'
                    ? 'Đây là kết quả chấm tự động từ hệ thống dựa trên CV của bạn và JD.'
                    : 'This is the screening result based on your Builder CV and the job description.',
            );

            setCvMatchResult({
                ...normalizedResult,
                require_form: Boolean(result?.require_form),
                status: result?.status || '',
            });

            if (result?.formData) {
                setApplicationForm((prev) => ({
                    ...prev,
                    fullName: result.formData.full_name || result.formData.fullName || prev.fullName,
                    email: result.formData.email || prev.email,
                    phone: result.formData.phone || prev.phone,
                    desiredPosition: result.formData.position || prev.desiredPosition || jobData.title || '',
                    address: result.formData.address || prev.address,
                    gpa: result.formData.gpa || prev.gpa,
                    level: result.formData.level || prev.level,
                    skillsSummary: result.formData.skill || prev.skillsSummary,
                }));
            }

            if (result?.require_form) {
                setApplyOption('form');
                setApplyNotice(
                    result?.message ||
                    (language === 'vi'
                        ? `CV đang được chấm ${normalizedResult.score}%. Bạn nên bổ sung form để hệ thống chấm lại chính xác hơn.`
                        : `Your CV scored ${normalizedResult.score}%. Please complete the quick form for a more accurate score.`),
                );
                return;
            }

            setApplicationSubmitted(true);
            setApplyNotice(
                result?.message ||
                (language === 'vi'
                    ? `CV đạt ${normalizedResult.score}% và đã được nộp tự động thành công.`
                    : `Your CV scored ${normalizedResult.score}% and has been submitted automatically.`),
            );
        } catch (error) {
            console.error('Error analyzing CV Builder:', error);
            const serverMessage = error?.response?.data?.message || '';
            const isAlreadyApplied =
                error?.response?.status === 409 ||
                serverMessage.includes('đã ứng tuyển') ||
                serverMessage.includes('already applied');

            if (isAlreadyApplied) {
                setCvMatchResult(null);
                setApplyOption('');
                setFormScoreResult(null);
                setApplyNotice('');
                setCvAnalysisError(language === 'vi' ? 'Bạn đã ứng tuyển vị trí này rồi!' : 'You have already applied for this position.');
                return;
            }

            setCvMatchResult(null);
            setApplyOption('');
            setFormScoreResult(null);
            setApplyNotice('');
            setCvAnalysisError(
                error?.response?.data?.message || (language === 'vi' ? 'Có lỗi xảy ra khi chấm điểm CV.' : 'Error occurred while scoring CV.')
            );
        } finally {
            setIsAnalyzingCv(false);
        }
    };

    const handleScoreForm = async () => {
        if (!cvMatchResult) {
            alert(language === 'vi' ? 'Vui lòng upload CV và đợi hệ thống chấm điểm trước.' : 'Please upload your CV and wait for the scoring first.');
            return;
        }
        if (!applyOption) {
            alert(language === 'vi' ? 'Vui lòng chọn một cách ứng tuyển.' : 'Please choose an apply option.');
            return;
        }
        if (applicationSubmitted) return;
        if (applyOption === 'create') { navigate('/cv_builder'); closeApplyPopup(); return; }

        const form = applicationForm;
        const requiredFields = [form.fullName, form.email, form.phone, form.desiredPosition, form.address, form.gpa, form.level, form.skillsSummary];
        if (requiredFields.some((value) => !String(value).trim())) {
            alert(language === 'vi' ? 'Vui lòng nhập đầy đủ thông tin form cơ bản trước khi chấm điểm tiếp.' : 'Please complete the quick form before continuing the second scoring step.');
            return;
        }

        // Gọi API thật từ NestJS — không tự tính nữa
        setIsAnalyzingCv(true);
        try {
            const payload = {
                full_name: form.fullName.trim(),
                email: form.email.trim(),
                phone: form.phone.trim(),
                position: form.desiredPosition.trim(),
                address: form.address.trim(),
                gpa: String(form.gpa || '').trim(),
                level: String(form.level || '').trim(),
                skill: form.skillsSummary.trim(),
            };
            const jobId = String(jobData.id || jobData._id || id || '');
            const response = await api.post(`applications/preview-score/${jobId}`, payload);
            const serverResult = response?.data?.data || {};
            const result = {
                score: serverResult.score || 0,
                tone: getToneByScore(serverResult.score || 0),
                criteriaScores: Array.isArray(serverResult.criteriaScores) ? serverResult.criteriaScores : [],
                matchedKeywords: Array.isArray(serverResult.matchedKeywords) ? serverResult.matchedKeywords : [],
                missingKeywords: Array.isArray(serverResult.missingKeywords) ? serverResult.missingKeywords : [],
                note: language === 'vi'
                    ? 'Điểm này là điểm THẬT từ server NestJS, cùng thuật toán với điểm lưu vào DB.'
                    : 'This score is the REAL score from NestJS server, same algorithm as the DB score.',
            };
            setFormScoreResult(result);
            setApplyNotice(
                language === 'vi'
                    ? `Form được NestJS chấm được ${result.score}%. Kiểm tra kết quả bên dưới rồi bấm Nộp CV để hoàn tất.`
                    : `NestJS scored your form ${result.score}%. Review the result below then click Submit to finish.`,
            );
        } catch (error) {
            console.error('Preview score error:', error);
            alert(language === 'vi' ? 'Không thể chấm điểm lúc này. Vui lòng thử lại.' : 'Unable to score right now. Please try again.');
        } finally {
            setIsAnalyzingCv(false);
        }
    };

    const handleSubmitApplication = async () => {
        if (!user) {
            alert(language === 'vi' ? 'Vui lòng đăng nhập trước khi ứng tuyển.' : 'Please sign in before applying.');
            return;
        }

        if (isEmployerAccount) {
            alert(employerApplyBlockedMessage);
            return;
        }

        if (applyMethod === 'upload' && !uploadedCvPath && !uploadedCvFile) {
            alert(language === 'vi' ? 'Thiếu file CV đã upload để nộp hồ sơ.' : 'The uploaded CV file is missing for submission.');
            return;
        }

        if (applyMethod === 'builder' && !selectedCvId) {
            alert(language === 'vi' ? 'Thiếu CV từ CV Builder để nộp hồ sơ.' : 'The Builder CV is missing for submission.');
            return;
        }

        if (!formScoreResult) {
            alert(language === 'vi' ? 'Vui lòng chấm điểm form bổ sung trước khi nộp hồ sơ.' : 'Please score the quick form before submitting.');
            return;
        }

        setIsSubmittingApplication(true);

        try {
            let successMessage = language === 'vi' ? 'Ứng tuyển thành công!' : 'Application submitted successfully!';

            if (uploadedCvPath || (applyMethod === 'builder' && selectedCvId)) {
                const payload = {
                    jobId: String(jobData.id || jobData._id || id || ''),
                    formData: buildFormPayload(applicationForm),
                };
                
                if (applyMethod === 'builder') {
                    payload.cvId = selectedCvId;
                } else {
                    payload.cvFilePath = uploadedCvPath;
                }

                const response = await api.post('applications/submit-final', payload);

                const serverResult = response?.data?.data || {};
                const normalizedResult = toClientScoreResult(
                    serverResult,
                    language === 'vi'
                        ? 'Đây là điểm cuối cùng sau khi hệ thống chấm lại từ form bổ sung.'
                        : 'This is the final score after the server rescored your quick form.',
                );

                setFormScoreResult(normalizedResult);
                setApplicationSubmitted(true);
                setApplyNotice(
                    language === 'vi'
                        ? `Nộp CV thành công. Điểm cuối cùng của hồ sơ là ${normalizedResult.score}%.`
                        : `Application submitted successfully. Your final score is ${normalizedResult.score}%.`,
                );
                successMessage = serverResult?.status || successMessage;
            } else {
                // Fallback: AI không chạy, gửi JSON thay vì multipart
                const jobIdStr = String(jobData.id || jobData._id || id || '');
                const response = await api.post('applications/apply-no-file', {
                    jobId: jobIdStr,
                    fullName: applicationForm.fullName.trim(),
                    email: applicationForm.email.trim(),
                    phone: applicationForm.phone.trim(),
                    coverLetter: coverLetter.trim(),
                });

                setApplicationSubmitted(true);
                setApplyNotice(
                    language === 'vi'
                        ? 'Đã nộp CV thành công bằng luồng dự phòng khi AI tạm thời không sẵn sàng.'
                        : 'Your application was submitted successfully using the fallback flow while AI was unavailable.',
                );
                successMessage = response?.data?.status || successMessage;
            }

            alert(successMessage);
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

    // eslint-disable-next-line no-unused-vars
    const buildFeedbackSummary = (result) => {
        const lowCriteria = (result.criteriaScores || [])
            .filter((criterion) => criterion.score < 60)
            .map((criterion) => getCriterionLabel(criterion.key, language));

        // Lấy missingKeywords từ criteriaScores trước (chính xác hơn),
        // fallback về result.missingKeywords nếu không có criteriaScores (kết quả từ server)
        const missingKeywords = unique(
            (result.criteriaScores || []).flatMap((c) => c.missingKeywords || [])
        ).filter(Boolean).slice(0, 4);

        const resolvedMissing = missingKeywords.length > 0
            ? missingKeywords
            : (result.missingKeywords || []).filter(Boolean).slice(0, 4);

        const highlightKeywords = unique(
            (result.criteriaScores || []).flatMap((c) => c.matchedKeywords || [])
        ).filter(Boolean).slice(0, 3);

        const resolvedHighlight = highlightKeywords.length > 0
            ? highlightKeywords
            : (result.matchedKeywords || []).filter(Boolean).slice(0, 3);

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

        if (resolvedMissing.length > 0) {
            feedback.push(
                language === 'vi'
                    ? `Đang thiếu hoặc chưa thể hiện rõ: ${resolvedMissing.join(', ')}.`
                    : `Still missing or not clearly shown: ${resolvedMissing.join(', ')}.`,
            );
        }

        if (lowCriteria.length > 0) {
            feedback.push(
                language === 'vi'
                    ? `Nên ưu tiên cải thiện: ${lowCriteria.join(', ')}.`
                    : `Priority areas to improve: ${lowCriteria.join(', ')}.`,
            );
        } else if (resolvedHighlight.length > 0) {
            feedback.push(
                language === 'vi'
                    ? `Điểm mạnh hiện tại: ${resolvedHighlight.join(', ')}.`
                    : `Current strengths: ${resolvedHighlight.join(', ')}.`,
            );
        } else if (result.note) {
            feedback.push(result.note);
        }

        return feedback;
    };

    const buildReadableFeedbackSummary = (result) => {
        const criteriaScores = Array.isArray(result.criteriaScores) ? result.criteriaScores : [];
        const lowCriteriaItems = criteriaScores.filter((criterion) => criterion.score < 60);
        const lowCriterionKeys = lowCriteriaItems.map((criterion) => criterion.key);
        const lowCriteriaLabels = lowCriterionKeys.map((key) => getFeedbackCriterionLabel(key, language));

        const missingKeywords = sanitizeFeedbackKeywords(
            criteriaScores.flatMap((criterion) => criterion.missingKeywords || []),
        ).slice(0, 4);

        const resolvedMissing = missingKeywords.length > 0
            ? missingKeywords
            : sanitizeFeedbackKeywords(result.missingKeywords || []).slice(0, 4);

        const highlightKeywords = sanitizeFeedbackKeywords(
            criteriaScores.flatMap((criterion) => criterion.matchedKeywords || []),
        ).slice(0, 3);

        const resolvedHighlight = highlightKeywords.length > 0
            ? highlightKeywords
            : sanitizeFeedbackKeywords(result.matchedKeywords || []).slice(0, 3);

        const skillKeywords = sanitizeFeedbackKeywords(
            criteriaScores.find((criterion) => criterion.key === 'skills')?.missingKeywords || [],
        ).slice(0, 3);

        const actionLabels = unique(
            lowCriterionKeys.map((key) => getCriterionActionLabel(key, language, { skillKeywords })),
        ).filter(Boolean);

        const feedback = [];

        feedback.push(
            language === 'vi'
                ? result.score >= 80
                    ? 'Nhận xét: CV đang thể hiện mức độ phù hợp tốt với vị trí này.'
                    : result.score >= 60
                        ? 'Nhận xét: CV đã có nền tảng phù hợp, nhưng vẫn còn vài điểm cần làm rõ thêm.'
                        : result.score >= 40
                            ? 'Nhận xét: CV mới thể hiện một phần mức độ phù hợp với vị trí này.'
                            : 'Nhận xét: CV hiện chưa cho thấy mức độ phù hợp rõ ràng với vị trí này.'
                : result.score >= 80
                    ? 'Feedback: your CV already shows a strong fit for this role.'
                    : result.score >= 60
                        ? 'Feedback: your CV has a solid base, but a few points still need clarification.'
                        : result.score >= 40
                            ? 'Feedback: your CV currently shows only a partial match for this role.'
                            : 'Feedback: your CV does not clearly show a strong match for this role yet.',
        );

        if (lowCriteriaLabels.length > 0) {
            feedback.push(
                language === 'vi'
                    ? `Các mục cần bổ sung hoặc làm rõ thêm: ${formatFeedbackList(lowCriteriaLabels, language)}.`
                    : `Areas that still need to be clarified: ${formatFeedbackList(lowCriteriaLabels, language)}.`,
            );

            if (actionLabels.length > 0) {
                feedback.push(
                    language === 'vi'
                        ? `Bạn nên ghi rõ hơn ${formatFeedbackList(actionLabels, language)} trong CV để hệ thống đánh giá chính xác hơn.`
                        : `You should make ${formatFeedbackList(actionLabels, language)} clearer in your CV for a more accurate review.`,
                );
            }

            return feedback;
        }

        if (resolvedMissing.length > 0) {
            feedback.push(
                language === 'vi'
                    ? `Bạn có thể bổ sung thêm: ${formatFeedbackList(resolvedMissing, language)}.`
                    : `You can still add: ${formatFeedbackList(resolvedMissing, language)}.`,
            );
        } else if (resolvedHighlight.length > 0) {
            feedback.push(
                language === 'vi'
                    ? `Điểm đang thể hiện khá rõ: ${formatFeedbackList(resolvedHighlight, language)}.`
                    : `Current strengths shown clearly: ${formatFeedbackList(resolvedHighlight, language)}.`,
            );
        } else if (result.note) {
            feedback.push(result.note);
        }

        return feedback;
    };

    const renderMatchCard = (result, title, description) => (
        <div
            className={cx('match-card', `match-card--${result.tone}`, {
                'match-card--positive': isPositiveMatchScore(result.score),
                'match-card--negative': !isPositiveMatchScore(result.score),
            })}
        >
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
                {buildReadableFeedbackSummary(result).map((item) => (
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
                else alert(language === 'vi' ? 'Lỗi kết nối tới server' : 'Server connection error');
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
                            <button
                                className={cx('applyBtn')}
                                onClick={handleOpenApplyPopup}
                                title={isEmployerAccount ? employerApplyBlockedMessage : ''}
                            >
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
                                <div className={cx('skillItem')}><span>{t.programmingLang}</span><p>{jobData.requirements}</p></div>
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
                            {language === 'vi' ? 'Danh sách này được ưu tiên theo 5 tiêu chí: Level, công việc, địa chỉ, kỹ năng và GPA.' : 'This list is prioritized by level, job, address, skills, and GPA.'}
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
                                        {user && typeof job.suggestionScore === 'number' ? <div className={cx('jobSuggestionScore')}>{language === 'vi' ? 'Độ phù hợp' : 'Match'}: {job.suggestionScore}%</div> : null}
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
                            {suggestedJobs.length === 0 ? <p style={{ textAlign: 'center', color: '#888', padding: '12px', fontSize: '13px' }}>{language === 'vi' ? 'Đang tải...' : 'Loading...'}</p> : null}
                        </div>
                    </div>
                </div>
            </div>

            {showApplyPopup ? (
                <div className={cx('popup-overlay')}>
                    <div className={cx('popup-content', 'popup-content--wide')}>
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
                                <label className={cx('popup-label')}>{language === 'vi' ? 'Bước 1: Chọn CV ứng tuyển' : 'Step 1: Choose your CV'} <span className={cx('required')}>*</span></label>
                                
                                <div className={cx('cv-options')} style={{ marginBottom: '15px' }}>
                                    <label className={cx('cv-option')}>
                                        <input type="radio" name="applyMethod" value="upload" checked={applyMethod === 'upload'} onChange={() => { setApplyMethod('upload'); setCvMatchResult(null); setApplyNotice(''); setApplicationSubmitted(false); setApplyOption(''); setFormScoreResult(null); }} />
                                        <span>{language === 'vi' ? 'Tải CV từ máy tính' : 'Upload CV from computer'}</span>
                                    </label>
                                    <label className={cx('cv-option')}>
                                        <input type="radio" name="applyMethod" value="builder" checked={applyMethod === 'builder'} onChange={() => { setApplyMethod('builder'); setCvMatchResult(null); setApplyNotice(''); setApplicationSubmitted(false); setApplyOption(''); setFormScoreResult(null); }} />
                                        <span>{language === 'vi' ? 'Chọn CV đã tạo trên nền tảng' : 'Choose CV from Builder'}</span>
                                    </label>
                                </div>

                                {applyMethod === 'upload' ? (
                                    <>
                                        <input className={cx('popup-file-input')} type="file" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" onChange={handleCvUpload} />
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
                                    </>
                                ) : (
                                    <>
                                        <select 
                                            className={cx('popup-select')} 
                                            value={selectedCvId} 
                                            onChange={(e) => {
                                                setSelectedCvId(e.target.value);
                                                setCvMatchResult(null);
                                                setApplyNotice('');
                                                setApplicationSubmitted(false);
                                                setApplyOption('');
                                                setFormScoreResult(null);
                                            }}
                                        >
                                            <option value="">{language === 'vi' ? '--- Chọn một CV ---' : '--- Select a CV ---'}</option>
                                            {myResumes.map(cv => (
                                                <option key={cv._id} value={cv._id}>
                                                    {cv.title || cv.cv_data?.title || (language === 'vi' ? 'CV Chưa Đặt Tên' : 'Untitled CV')} {cv.is_active ? (language === 'vi' ? '(CV chính)' : '(Main CV)') : ''}
                                                </option>
                                            ))}
                                        </select>
                                        <button 
                                            className={cx('popup-btn', 'popup-btn--apply')} 
                                            style={{ marginTop: '10px' }} 
                                            onClick={handleSelectCvBuilder}
                                            disabled={!selectedCvId || isAnalyzingCv}
                                        >
                                            {language === 'vi' ? 'Chấm điểm CV này' : 'Score this CV'}
                                        </button>
                                        {myResumes.length === 0 && (
                                            <div className={cx('upload-hint')} style={{ color: 'red', marginTop: '10px' }}>
                                                {language === 'vi' ? 'Bạn chưa có CV nào trên hệ thống. Vui lòng tạo CV trước hoặc tải lên từ máy tính.' : 'You have no CVs on the system. Please create a CV or upload from your computer.'}
                                            </div>
                                        )}
                                    </>
                                )}

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

                            {cvMatchResult?.require_form ? (
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
                                    {applicationSubmitted ? (language === 'vi' ? 'CV đã đạt ngưỡng và đã được nộp tự động. Bạn không cần điền thêm form.' : 'Your CV passed the threshold and has already been submitted automatically.') : (language === 'vi' ? 'Hai lựa chọn ứng tuyển sẽ hiện khi CV cần bổ sung thêm thông tin.' : 'The two application options will appear when the CV needs more information.')}
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
                                            <input className={cx('popup-input')} value={applicationForm.address} onChange={(event) => setApplicationForm((prev) => ({ ...prev, address: event.target.value }))} placeholder={language === 'vi' ? 'Ví dụ: Thủ Đức, Hồ Chí Minh' : 'Ex: Thu Duc, Ho Chi Minh City'} />
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
