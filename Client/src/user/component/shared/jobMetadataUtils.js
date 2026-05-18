export const JOB_LEVEL_OPTIONS = ['Intern', 'Fresher', 'Junior', 'Middle', 'Senior', 'Lead'];

const LEVEL_DEFINITIONS = [
    { key: 'intern', label: 'Intern', terms: ['intern', 'thuc tap', 'thuc tap sinh', 'trainee'] },
    { key: 'fresher', label: 'Fresher', terms: ['fresher', 'new grad', 'graduate'] },
    { key: 'junior', label: 'Junior', terms: ['junior'] },
    { key: 'middle', label: 'Middle', terms: ['middle', 'mid level', 'mid-level', 'mid'] },
    { key: 'senior', label: 'Senior', terms: ['senior', 'expert'] },
    { key: 'lead', label: 'Lead', terms: ['team lead', 'technical lead', 'lead'] },
];

const LEGACY_LEVEL_MAP = {
    'thuc tap sinh': 'Intern',
    'nhan vien': 'Junior',
    'truong nhom': 'Lead',
    'truong pho phong': 'Lead',
    'quan ly giam sat': 'Lead',
    'truong chi nhanh': 'Lead',
    'pho giam doc': 'Lead',
    'giam doc': 'Lead',
};

const LEVEL_RANK = {
    intern: 0,
    fresher: 1,
    junior: 2,
    middle: 3,
    senior: 4,
    lead: 5,
};

const TECHNOLOGY_PATTERNS = [
    { label: 'JavaScript', terms: ['javascript'] },
    { label: 'TypeScript', terms: ['typescript'] },
    { label: 'React', terms: ['react'] },
    { label: 'Vue', terms: ['vue'] },
    { label: 'Angular', terms: ['angular'] },
    { label: 'Node.js', terms: ['nodejs', 'node'] },
    { label: 'NestJS', terms: ['nestjs'] },
    { label: 'Express', terms: ['express'] },
    { label: 'Java', terms: ['java'] },
    { label: 'Python', terms: ['python'] },
    { label: 'PHP', terms: ['php'] },
    { label: 'C++', terms: ['cplusplus'] },
    { label: 'C#', terms: ['csharp'] },
    { label: 'C', terms: ['c'] },
    { label: 'SQL', terms: ['sql'] },
    { label: 'MySQL', terms: ['mysql'] },
    { label: 'PostgreSQL', terms: ['postgresql', 'postgres'] },
    { label: 'MongoDB', terms: ['mongodb'] },
    { label: 'Redis', terms: ['redis'] },
    { label: 'HTML', terms: ['html'] },
    { label: 'CSS', terms: ['css'] },
    { label: 'Docker', terms: ['docker'] },
    { label: 'Laravel', terms: ['laravel'] },
    { label: 'Spring Boot', terms: ['spring boot', 'springboot'] },
];

const escapeRegExp = (value = '') => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const normalizeCompareText = (value = '') =>
    String(value)
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/node\.js/g, 'nodejs')
        .replace(/react\.js/g, 'react')
        .replace(/vue\.js/g, 'vue')
        .replace(/next\.js/g, 'nextjs')
        .replace(/spring boot/g, 'springboot')
        .replace(/c\+\+/g, 'cplusplus')
        .replace(/c#/g, 'csharp')
        .replace(/[^a-z0-9\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

const matchesNormalizedTerm = (normalizedText, term) => {
    const escapedTerm = escapeRegExp(term.trim());
    return new RegExp(`(^|\\s)${escapedTerm}(?=\\s|$)`).test(normalizedText);
};

export const getCanonicalLevelKey = (value = '') => {
    const normalized = normalizeCompareText(value);

    if (!normalized) {
        return '';
    }

    const matchedLevel = LEVEL_DEFINITIONS.find((item) =>
        item.terms.some((term) => matchesNormalizedTerm(normalized, term)),
    );

    return matchedLevel?.key || '';
};

export const getLevelLabel = (value = '') => {
    const levelKey = LEVEL_DEFINITIONS.some((item) => item.key === value) ? value : getCanonicalLevelKey(value);
    return LEVEL_DEFINITIONS.find((item) => item.key === levelKey)?.label || '';
};

const inferLevelFromJob = (job = {}) => {
    const titleLevel = getLevelLabel(job.title || '');
    if (titleLevel) {
        return titleLevel;
    }

    if (job.job_type === 'internship') {
        return 'Intern';
    }

    const normalizedExperience = normalizeCompareText(job.experience || '');

    if (normalizedExperience.includes('4 nam tro len') || normalizedExperience.includes('5 nam')) {
        return 'Senior';
    }

    if (matchesNormalizedTerm(normalizedExperience, '4 nam') || matchesNormalizedTerm(normalizedExperience, '3 nam')) {
        return 'Middle';
    }

    if (matchesNormalizedTerm(normalizedExperience, '2 nam')) {
        return 'Junior';
    }

    if (
        matchesNormalizedTerm(normalizedExperience, '1 nam') ||
        normalizedExperience.includes('duoi 1 nam') ||
        normalizedExperience.includes('khong yeu cau')
    ) {
        return 'Fresher';
    }

    return '';
};

export const normalizeJobLevel = (job = {}) => {
    const directLevel = getLevelLabel(job.level || '');
    if (directLevel) {
        return directLevel;
    }

    const normalizedLegacyLevel = normalizeCompareText(job.level || '');
    if (LEGACY_LEVEL_MAP[normalizedLegacyLevel]) {
        return LEGACY_LEVEL_MAP[normalizedLegacyLevel];
    }

    return inferLevelFromJob(job);
};

export const getLevelRank = (value = '') => {
    const levelKey = LEVEL_DEFINITIONS.some((item) => item.key === value) ? value : getCanonicalLevelKey(value);
    return typeof LEVEL_RANK[levelKey] === 'number' ? LEVEL_RANK[levelKey] : -1;
};

export const extractProgrammingLanguages = (job = {}) => {
    const normalizedText = normalizeCompareText(`${job.title || ''} ${job.requirements || ''} ${job.description || ''}`);

    return TECHNOLOGY_PATTERNS.filter((item) =>
        item.terms.some((term) => matchesNormalizedTerm(normalizedText, term)),
    ).map((item) => item.label);
};
