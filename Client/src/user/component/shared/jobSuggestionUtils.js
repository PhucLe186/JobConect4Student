const TEXT_STOP_WORDS = new Set([
    'va',
    'voi',
    'cua',
    'cho',
    'tai',
    'tren',
    'trong',
    'mot',
    'nhung',
    'cac',
    'the',
    'and',
    'for',
    'with',
    'from',
    'the',
    'you',
]);

const LEVEL_MATCH_MAP = {
    'Intern': ['Intern', 'Fresher'],
    'Fresher': ['Fresher', 'Intern', 'Junior'],
    'Junior': ['Junior', 'Fresher', 'Middle'],
    'Middle': ['Middle', 'Junior', 'Senior'],
    'Senior': ['Senior', 'Middle'],
};

const DEFAULT_GPA_BY_LEVEL = {
    'Intern': 2.5,
    'Fresher': 2.7,
    'Junior': 3.0,
    'Middle': 3.1,
    'Senior': 3.3,
};

const normalizeText = (value = '') =>
    value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

const tokenize = (value = '') =>
    normalizeText(value)
        .split(' ')
        .filter((token) => token && token.length > 1 && !TEXT_STOP_WORDS.has(token));

const parseGpa = (value) => {
    if (value === null || value === undefined || value === '') {
        return null;
    }

    const normalized = String(value).replace(',', '.').trim();
    const parsed = Number(normalized);

    return Number.isFinite(parsed) ? parsed : null;
};

const extractLocationTokens = (value = '') => {
    const pieces = String(value)
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);

    return new Set(pieces.flatMap((item) => tokenize(item)));
};

const getCandidateLevel = (profile = {}) => {
    if (profile.level) {
        return profile.level;
    }

    const currentYear = new Date().getFullYear();
    const graduationYear = Number(profile.graduation_year);

    if (Number.isFinite(graduationYear) && graduationYear >= currentYear) {
        return 'Intern';
    }

    return 'Fresher';
};

const getJobRequiredGpa = (job = {}) => {
    const directGpa = parseGpa(job.min_gpa || job.required_gpa || job.gpa);
    if (directGpa !== null) {
        return directGpa;
    }

    return DEFAULT_GPA_BY_LEVEL[job.level] || 2.7;
};

const getSkillNames = (profile = {}) =>
    (profile.skills || [])
        .map((skill) => skill?.skill_id?.name || skill?.name || '')
        .map((skillName) => skillName.trim())
        .filter(Boolean);

const calculateKeywordRatio = (query, targetText) => {
    const queryTokens = tokenize(query);
    if (queryTokens.length === 0) {
        return 0;
    }

    const target = normalizeText(targetText);
    const matchedCount = queryTokens.filter((token) => target.includes(token)).length;

    return matchedCount / queryTokens.length;
};

const calculateAddressMatch = (address, location) => {
    const addressTokens = extractLocationTokens(address);
    if (addressTokens.size === 0) {
        return 0;
    }

    const locationText = normalizeText(location);
    const matchedCount = Array.from(addressTokens).filter((token) => locationText.includes(token)).length;

    return matchedCount / addressTokens.size;
};

const calculateSkillRatio = (skills, job) => {
    if (!skills || skills.length === 0) {
        return 0;
    }

    const jobText = normalizeText(`${job.title} ${job.industry} ${job.description} ${job.requirements}`);
    const matchedSkills = skills.filter((skill) => jobText.includes(normalizeText(skill)));

    return matchedSkills.length / skills.length;
};

const isLevelMatch = (candidateLevel, jobLevel) => {
    if (!candidateLevel || !jobLevel) {
        return false;
    }

    const acceptedLevels = LEVEL_MATCH_MAP[candidateLevel] || [candidateLevel];
    return acceptedLevels.includes(jobLevel);
};

export const buildProfileSuggestionCriteria = (profile = {}) => ({
    level: getCandidateLevel(profile),
    jobKeyword: profile.career_goal || profile.major || '',
    address: profile.address || '',
    skills: getSkillNames(profile),
    gpa: parseGpa(profile.gpa),
});

export const rankJobsByCriteria = (jobs = [], criteria = {}) => {
    const candidateSkills = criteria.skills || [];
    const candidateGpa = criteria.gpa ?? null;

    return jobs
        .map((job) => {
            let maxScore = 0;
            let earnedScore = 0;
            const matchedCriteria = [];

            if (criteria.level) {
                maxScore += 20;
                if (isLevelMatch(criteria.level, job.level)) {
                    earnedScore += 20;
                    matchedCriteria.push('Level');
                }
            }

            if (criteria.jobKeyword) {
                maxScore += 20;
                const ratio = calculateKeywordRatio(
                    criteria.jobKeyword,
                    `${job.title} ${job.industry} ${job.description} ${job.requirements}`,
                );
                earnedScore += Math.round(ratio * 20);
                if (ratio >= 0.45) {
                    matchedCriteria.push('Công việc');
                }
            }

            if (criteria.address) {
                maxScore += 15;
                const ratio = calculateAddressMatch(criteria.address, job.location);
                earnedScore += Math.round(ratio * 15);
                if (ratio >= 0.4) {
                    matchedCriteria.push('Địa chỉ');
                }
            }

            if (candidateSkills.length > 0) {
                maxScore += 30;
                const ratio = calculateSkillRatio(candidateSkills, job);
                earnedScore += Math.round(ratio * 30);
                if (ratio > 0) {
                    matchedCriteria.push('Kỹ năng');
                }
            }

            const requiredGpa = getJobRequiredGpa(job);
            if (candidateGpa !== null) {
                maxScore += 15;
                if (candidateGpa >= requiredGpa) {
                    earnedScore += 15;
                    matchedCriteria.push('GPA');
                }
            }

            const suggestionScore = maxScore > 0 ? Math.round((earnedScore / maxScore) * 100) : 0;

            return {
                ...job,
                suggestionScore,
                matchedCriteria,
                requiredGpa,
            };
        })
        .sort((left, right) => {
            if (right.suggestionScore !== left.suggestionScore) {
                return right.suggestionScore - left.suggestionScore;
            }

            return (left.title || '').localeCompare(right.title || '');
        });
};

export const filterJobsBySuggestionCriteria = (jobs = [], filters = {}) =>
    jobs.filter((job) => {
        const matchesLevel = !filters.level || job.level === filters.level;
        const matchesJob =
            !filters.jobKeyword ||
            normalizeText(`${job.title} ${job.description} ${job.industry}`).includes(normalizeText(filters.jobKeyword));
        const matchesAddress =
            !filters.address || normalizeText(job.location).includes(normalizeText(filters.address));
        const matchesSkill =
            !filters.skill ||
            normalizeText(`${job.title} ${job.requirements} ${job.description} ${job.industry}`).includes(
                normalizeText(filters.skill),
            );

        const filterGpa = parseGpa(filters.gpa);
        const matchesGpa = filterGpa === null || filterGpa >= getJobRequiredGpa(job);

        return matchesLevel && matchesJob && matchesAddress && matchesSkill && matchesGpa;
    });

export const getCriteriaSummary = (criteria = {}) => {
    const summary = [];

    if (criteria.level) {
        summary.push({ label: 'Level', value: criteria.level });
    }

    if (criteria.jobKeyword) {
        summary.push({ label: 'Công việc', value: criteria.jobKeyword });
    }

    if (criteria.address) {
        summary.push({ label: 'Địa chỉ', value: criteria.address });
    }

    if (criteria.skills?.length) {
        summary.push({ label: 'Kỹ năng', value: criteria.skills.slice(0, 4).join(', ') });
    }

    if (criteria.gpa !== null && criteria.gpa !== undefined) {
        summary.push({ label: 'GPA', value: String(criteria.gpa) });
    }

    return summary;
};
