const STOP_WORDS = new Set([
    'a',
    'an',
    'and',
    'are',
    'as',
    'at',
    'ban',
    'bang',
    'bi',
    'by',
    'cac',
    'can',
    'cho',
    'co',
    'cua',
    'da',
    'dang',
    'de',
    'den',
    'duoc',
    'for',
    'from',
    'gan',
    'hay',
    'is',
    'khi',
    'khong',
    'la',
    'lam',
    'len',
    'mot',
    'neu',
    'nhung',
    'of',
    'or',
    'qua',
    'se',
    'tai',
    'the',
    'thi',
    'this',
    'to',
    'tren',
    'trong',
    'tu',
    'va',
    'voi',
    'with',
    'you',
    'your',
]);

const SHORT_KEYWORDS = new Set(['ai', 'bi', 'qa', 'ui', 'ux']);

const KNOWN_KEYWORDS = [
    'frontend',
    'backend',
    'fullstack',
    'html',
    'css',
    'javascript',
    'typescript',
    'react',
    'nextjs',
    'vue',
    'vuejs',
    'angular',
    'nodejs',
    'express',
    'nestjs',
    'java',
    'spring',
    'python',
    'django',
    'flask',
    'php',
    'laravel',
    'ruby',
    'rails',
    'golang',
    'cplusplus',
    'csharp',
    'dotnet',
    'aspnet',
    'sql',
    'mysql',
    'postgresql',
    'mongodb',
    'redis',
    'graphql',
    'rest',
    'api',
    'aws',
    'azure',
    'docker',
    'kubernetes',
    'git',
    'figma',
    'photoshop',
    'illustrator',
    'canva',
    'seo',
    'excel',
    'powerbi',
    'tableau',
    'testing',
    'jest',
    'cypress',
    'selenium',
    'manual testing',
    'automation testing',
    'data analysis',
    'machine learning',
    'problem solving',
    'customer service',
    'communication',
    'leadership',
    'sales',
    'marketing',
    'english',
    'agile',
    'scrum',
];

const MAX_JOB_TERMS = 14;
const MIN_CONTENT_LENGTH = 60;
const XML_ENTRY_NAME = 'word/document.xml';
const LOCATION_IGNORED_TOKENS = new Set(['dia', 'chi', 'so', 'duong', 'street', 'road', 'ward', 'phuong', 'quan', 'district', 'city']);
const LEVEL_ALIASES = [
    { key: 'intern', label: 'Intern', terms: ['intern', 'thuc tap', 'thuc tap sinh', 'trainee'] },
    { key: 'fresher', label: 'Fresher', terms: ['fresher', 'new grad', 'graduate'] },
    { key: 'junior', label: 'Junior', terms: ['junior'] },
    { key: 'middle', label: 'Middle', terms: ['middle', 'mid', 'mid level', 'mid-level'] },
    { key: 'senior', label: 'Senior', terms: ['senior', 'lead', 'expert'] },
];
const LEVEL_RANK = {
    intern: 0,
    fresher: 1,
    junior: 2,
    middle: 3,
    senior: 4,
};

const normalizeText = (value = '') =>
    value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/asp\.net/g, ' aspnet ')
        .replace(/node\.js/g, ' nodejs ')
        .replace(/next\.js/g, ' nextjs ')
        .replace(/vue\.js/g, ' vuejs ')
        .replace(/react\.js/g, ' react ')
        .replace(/power\s*bi/g, ' powerbi ')
        .replace(/manual\s*test(ing)?/g, ' manual testing ')
        .replace(/automation\s*test(ing)?/g, ' automation testing ')
        .replace(/data\s*analysis/g, ' data analysis ')
        .replace(/machine\s*learning/g, ' machine learning ')
        .replace(/problem\s*solving/g, ' problem solving ')
        .replace(/customer\s*service/g, ' customer service ')
        .replace(/front[\s-]*end/g, ' frontend ')
        .replace(/back[\s-]*end/g, ' backend ')
        .replace(/full[\s-]*stack/g, ' fullstack ')
        .replace(/c\+\+/g, ' cplusplus ')
        .replace(/c#/g, ' csharp ')
        .replace(/\.net/g, ' dotnet ')
        .replace(/ui\/ux/g, ' ui ux ')
        .replace(/[^a-z0-9\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

const isUsefulToken = (token) => {
    if (!token || /^\d+$/.test(token)) {
        return false;
    }

    if (SHORT_KEYWORDS.has(token)) {
        return true;
    }

    return token.length >= 3 && !STOP_WORDS.has(token);
};

const addWeight = (termsMap, term, weight) => {
    if (!term || !weight) {
        return;
    }

    termsMap.set(term, (termsMap.get(term) || 0) + weight);
};

const collectTerms = (input, weight, termsMap) => {
    const normalized = normalizeText(input);
    if (!normalized) {
        return;
    }

    KNOWN_KEYWORDS.forEach((keyword) => {
        if (normalized.includes(keyword)) {
            addWeight(termsMap, keyword, weight + 1);
        }
    });

    normalized.split(' ').forEach((token) => {
        if (isUsefulToken(token)) {
            addWeight(termsMap, token, weight);
        }
    });
};

const getJobTerms = (jobData = {}) => {
    const weightedTerms = new Map();

    collectTerms(jobData.title, 5, weightedTerms);
    collectTerms(jobData.requirements, 4, weightedTerms);
    collectTerms(jobData.description, 3, weightedTerms);
    collectTerms(jobData.industry, 2, weightedTerms);
    collectTerms(jobData.level, 2, weightedTerms);
    collectTerms(jobData.experience, 2, weightedTerms);
    collectTerms(jobData.job_type, 1, weightedTerms);

    return Array.from(weightedTerms.entries())
        .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
        .slice(0, MAX_JOB_TERMS)
        .map(([term, weight]) => ({ term, weight }));
};

const getPrintableText = (value = '') =>
    value
        .replace(/[^\x20-\x7E\u00A0-\u024F\u1E00-\u1EFF]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

const decodePdfLiteral = (value) =>
    value
        .slice(1, -1)
        .replace(/\\([nrtbf()\\])/g, (_, escapedChar) => {
            const map = {
                '\\': '\\',
                '(': '(',
                ')': ')',
                b: '\b',
                f: '\f',
                n: '\n',
                r: '\r',
                t: '\t',
            };

            return map[escapedChar] || escapedChar;
        })
        .replace(/\\([0-7]{1,3})/g, (_, octalValue) => String.fromCharCode(parseInt(octalValue, 8)))
        .replace(/\\\r?\n/g, '');

const decodeUtf16Be = (bytes) => {
    let result = '';

    for (let index = 0; index + 1 < bytes.length; index += 2) {
        result += String.fromCharCode((bytes[index] << 8) | bytes[index + 1]);
    }

    return result;
};

const decodePdfHex = (value) => {
    const cleaned = value.replace(/[<>\s]/g, '');
    if (cleaned.length < 8 || cleaned.length % 2 !== 0) {
        return '';
    }

    const bytes = new Uint8Array(cleaned.match(/.{2}/g).map((part) => parseInt(part, 16)));
    if (bytes[0] === 0xfe && bytes[1] === 0xff) {
        return decodeUtf16Be(bytes.slice(2));
    }

    return new TextDecoder('latin1').decode(bytes);
};

const extractPdfText = async (file) => {
    const buffer = await file.arrayBuffer();
    const decoded = new TextDecoder('latin1').decode(buffer);
    const literalMatches = decoded.match(/\((?:\\.|[^\\()])+\)/g) || [];
    const hexMatches = decoded.match(/<[\da-fA-F\s]{8,}>/g) || [];

    const literals = literalMatches.slice(0, 2500).map(decodePdfLiteral);
    const hexValues = hexMatches.slice(0, 500).map(decodePdfHex);

    return getPrintableText([...literals, ...hexValues].join(' '));
};

const readUInt16LE = (bytes, offset) => bytes[offset] | (bytes[offset + 1] << 8);

const readUInt32LE = (bytes, offset) =>
    bytes[offset] |
    (bytes[offset + 1] << 8) |
    (bytes[offset + 2] << 16) |
    (bytes[offset + 3] << 24);

const findEndOfCentralDirectory = (bytes) => {
    for (let offset = bytes.length - 22; offset >= 0; offset -= 1) {
        if (readUInt32LE(bytes, offset) === 0x06054b50) {
            return offset;
        }
    }

    return -1;
};

const inflateRaw = async (data) => {
    const decompressionStream = new DecompressionStream('deflate-raw');
    const stream = new Blob([data]).stream().pipeThrough(decompressionStream);
    return new Uint8Array(await new Response(stream).arrayBuffer());
};

const extractZipEntry = async (arrayBuffer, entryName) => {
    const bytes = new Uint8Array(arrayBuffer);
    const directoryEnd = findEndOfCentralDirectory(bytes);

    if (directoryEnd === -1) {
        return '';
    }

    const centralDirectorySize = readUInt32LE(bytes, directoryEnd + 12);
    const centralDirectoryOffset = readUInt32LE(bytes, directoryEnd + 16);
    const utf8Decoder = new TextDecoder('utf-8');
    let pointer = centralDirectoryOffset;
    const endOffset = centralDirectoryOffset + centralDirectorySize;

    while (pointer < endOffset && readUInt32LE(bytes, pointer) === 0x02014b50) {
        const compressionMethod = readUInt16LE(bytes, pointer + 10);
        const compressedSize = readUInt32LE(bytes, pointer + 20);
        const fileNameLength = readUInt16LE(bytes, pointer + 28);
        const extraFieldLength = readUInt16LE(bytes, pointer + 30);
        const fileCommentLength = readUInt16LE(bytes, pointer + 32);
        const localHeaderOffset = readUInt32LE(bytes, pointer + 42);
        const fileNameStart = pointer + 46;
        const fileName = utf8Decoder.decode(bytes.slice(fileNameStart, fileNameStart + fileNameLength));

        if (fileName === entryName) {
            const localFileNameLength = readUInt16LE(bytes, localHeaderOffset + 26);
            const localExtraFieldLength = readUInt16LE(bytes, localHeaderOffset + 28);
            const dataStart = localHeaderOffset + 30 + localFileNameLength + localExtraFieldLength;
            const compressedData = bytes.slice(dataStart, dataStart + compressedSize);

            if (compressionMethod === 0) {
                return utf8Decoder.decode(compressedData);
            }

            if (compressionMethod === 8) {
                const inflatedData = await inflateRaw(compressedData);
                return utf8Decoder.decode(inflatedData);
            }

            return '';
        }

        pointer += 46 + fileNameLength + extraFieldLength + fileCommentLength;
    }

    return '';
};

const extractDocxText = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const xmlContent = await extractZipEntry(arrayBuffer, XML_ENTRY_NAME);

    if (!xmlContent) {
        return '';
    }

    const parser = new DOMParser();
    const documentXml = parser.parseFromString(xmlContent, 'application/xml');
    const textNodes = Array.from(documentXml.getElementsByTagName('w:t'));

    return getPrintableText(textNodes.map((node) => node.textContent || '').join(' '));
};

const extractDocText = async (file) => {
    const buffer = await file.arrayBuffer();
    const decoded = new TextDecoder('latin1').decode(buffer);
    const matchedText = decoded.match(/[A-Za-z0-9@.+#/_-]{2,}/g) || [];
    return getPrintableText(matchedText.join(' '));
};

const extractCvText = async (file) => {
    const extension = file.name.split('.').pop()?.toLowerCase();

    if (extension === 'pdf') {
        return extractPdfText(file);
    }

    if (extension === 'docx') {
        return extractDocxText(file);
    }

    if (extension === 'doc') {
        return extractDocText(file);
    }

    return '';
};

const formatKeyword = (keyword) =>
    keyword
        .replace(/cplusplus/g, 'C++')
        .replace(/csharp/g, 'C#')
        .replace(/nextjs/g, 'Next.js')
        .replace(/nodejs/g, 'Node.js')
        .replace(/vuejs/g, 'Vue.js')
        .replace(/dotnet/g, '.NET')
        .replace(/aspnet/g, 'ASP.NET')
        .replace(/powerbi/g, 'Power BI')
        .replace(/\bapi\b/g, 'API')
        .replace(/\bsql\b/g, 'SQL')
        .replace(/\baws\b/g, 'AWS')
        .replace(/\bseo\b/g, 'SEO')
        .replace(/\bui\b/g, 'UI')
        .replace(/\bux\b/g, 'UX')
        .replace(/\bqa\b/g, 'QA')
        .replace(/\bai\b/g, 'AI')
        .replace(/\bhtml\b/g, 'HTML')
        .replace(/\bcss\b/g, 'CSS');

const createSummary = (score) => {
    if (score >= 80) {
        return 'CV của bạn rất phù hợp với công việc này.';
    }

    if (score >= 60) {
        return 'CV của bạn khá phù hợp với công việc này.';
    }

    if (score >= 40) {
        return 'CV của bạn có một phần phù hợp với công việc này.';
    }

    return 'CV của bạn chưa phù hợp cao với công việc này.';
};

const createTone = (score) => {
    if (score >= 80) {
        return 'strong';
    }

    if (score >= 60) {
        return 'good';
    }

    if (score >= 40) {
        return 'medium';
    }

    return 'low';
};

const tokenizeComparable = (value = '') => normalizeText(value).split(' ').filter(Boolean);

const dedupeList = (items) => Array.from(new Set((items || []).filter(Boolean)));

const formatPhrase = (value = '') =>
    value
        .split(' ')
        .filter(Boolean)
        .map((word) => {
            const formatted = formatKeyword(word);
            return formatted.charAt(0).toUpperCase() + formatted.slice(1);
        })
        .join(' ');

const findCanonicalLevel = (value = '') => {
    const normalized = normalizeText(value);

    if (!normalized) {
        return '';
    }

    const matchedLevel = LEVEL_ALIASES.find(({ terms }) =>
        terms.some((term) => normalized.includes(normalizeText(term))),
    );

    return matchedLevel?.key || '';
};

const getLevelLabel = (value = '') => LEVEL_ALIASES.find((item) => item.key === value)?.label || '';

const scorePositionCriterion = (jobData, normalizedCandidateText, candidateTokens) => {
    const title = String(jobData.title || '').trim();
    const normalizedTitle = normalizeText(title);
    const titleTokens = tokenizeComparable(title).filter(isUsefulToken);

    if (!titleTokens.length) {
        return {
            key: 'position',
            score: 65,
            detail: 'Tin đăng chưa có chức vụ rõ ràng để đối chiếu.',
            matchedKeywords: [],
            missingKeywords: [],
        };
    }

    if (normalizedTitle && normalizedCandidateText.includes(normalizedTitle)) {
        return {
            key: 'position',
            score: 95,
            detail: `CV có nhắc trực tiếp đến vị trí ${title}.`,
            matchedKeywords: [title],
            missingKeywords: [],
        };
    }

    const matchedTokens = titleTokens.filter((token) => candidateTokens.has(token));
    const missingTokens = titleTokens.filter((token) => !candidateTokens.has(token));
    const ratio = matchedTokens.length / titleTokens.length;
    const score = Math.round(30 + ratio * 60);

    return {
        key: 'position',
        score,
        detail:
            matchedTokens.length > 0
                ? `CV đã có ${matchedTokens.length}/${titleTokens.length} từ khóa liên quan đến chức vụ ${title}.`
                : `CV chưa thể hiện rõ sự phù hợp với chức vụ ${title}.`,
        matchedKeywords: matchedTokens.map(formatKeyword),
        missingKeywords: missingTokens.map(formatKeyword),
    };
};

const scoreLevelCriterion = (jobData, normalizedCandidateText) => {
    const expectedLevel = findCanonicalLevel(jobData.level);
    const detectedLevel = findCanonicalLevel(normalizedCandidateText);

    if (!expectedLevel) {
        return {
            key: 'level',
            score: 65,
            detail: 'Tin đăng chưa yêu cầu level cụ thể.',
            matchedKeywords: [],
            missingKeywords: [],
        };
    }

    if (!detectedLevel) {
        return {
            key: 'level',
            score: 30,
            detail: `CV chưa nhận ra rõ level gần với ${getLevelLabel(expectedLevel)}.`,
            matchedKeywords: [],
            missingKeywords: [getLevelLabel(expectedLevel)],
        };
    }

    const distance = Math.abs(LEVEL_RANK[expectedLevel] - LEVEL_RANK[detectedLevel]);
    const score = distance === 0 ? 92 : distance === 1 ? 74 : 48;

    return {
        key: 'level',
        score,
        detail:
            distance === 0
                ? `Level trong CV trùng với mức ${getLevelLabel(expectedLevel)}.`
                : `CV nhận ra level ${getLevelLabel(detectedLevel)}, trong khi tin đăng ưu tiên ${getLevelLabel(expectedLevel)}.`,
        matchedKeywords: distance <= 1 ? [getLevelLabel(detectedLevel)] : [],
        missingKeywords: distance > 0 ? [getLevelLabel(expectedLevel)] : [],
    };
};

const scoreLocationCriterion = (jobData, normalizedCandidateText, candidateTokens) => {
    const location = String(jobData.location || '').trim();
    const normalizedLocation = normalizeText(location);
    const locationTokens = tokenizeComparable(location).filter(
        (token) => token.length > 1 && !LOCATION_IGNORED_TOKENS.has(token),
    );

    if (!locationTokens.length) {
        return {
            key: 'address',
            score: 65,
            detail: 'Tin đăng chưa có địa chỉ để so sánh.',
            matchedKeywords: [],
            missingKeywords: [],
        };
    }

    if (normalizedLocation && normalizedCandidateText.includes(normalizedLocation)) {
        return {
            key: 'address',
            score: 92,
            detail: `CV có địa chỉ trùng hoặc rất gần với khu vực ${location}.`,
            matchedKeywords: [location],
            missingKeywords: [],
        };
    }

    const matchedTokens = locationTokens.filter((token) => candidateTokens.has(token));
    const missingTokens = locationTokens.filter((token) => !candidateTokens.has(token));
    const ratio = matchedTokens.length / locationTokens.length;
    const score = matchedTokens.length > 0 ? Math.round(35 + ratio * 45) : 28;

    return {
        key: 'address',
        score,
        detail:
            matchedTokens.length > 0
                ? `CV có dấu hiệu về khu vực ${formatPhrase(matchedTokens.join(' '))}.`
                : `CV chưa cho thấy sự liên kết rõ với địa chỉ ${location}.`,
        matchedKeywords: matchedTokens.map(formatKeyword),
        missingKeywords: missingTokens.slice(0, 3).map(formatKeyword),
    };
};

const extractGpaInfo = (rawText = '', normalizedText = '') => {
    const candidates = [];
    const pushCandidate = (value, scale, source) => {
        const numericValue = Number(String(value).replace(',', '.'));
        const numericScale = scale ? Number(scale) : numericValue <= 4.5 ? 4 : 10;

        if (!numericValue || Number.isNaN(numericValue) || !numericScale || Number.isNaN(numericScale)) {
            return;
        }

        if (numericValue > numericScale || numericScale > 10) {
            return;
        }

        const normalized = numericScale === 10 ? (numericValue / 10) * 4 : numericValue;
        if (normalized > 4.1) {
            return;
        }

        candidates.push({
            display: `${numericValue}/${numericScale}`,
            normalized,
            source,
        });
    };

    const keywordRegex = /(gpa|cpa|dtb|diem trung binh|diem tich luy)\s*[:-]?\s*(\d{1,2}(?:[.,]\d{1,2})?)(?:\s*\/\s*(4|10))?/gi;
    let matchedKeyword = keywordRegex.exec(normalizedText);
    while (matchedKeyword) {
        pushCandidate(matchedKeyword[2], matchedKeyword[3], 'keyword');
        matchedKeyword = keywordRegex.exec(normalizedText);
    }

    const slashRegex = /(\d{1,2}(?:[.,]\d{1,2})?)\s*\/\s*(4|10)/g;
    let matchedSlash = slashRegex.exec(rawText);
    while (matchedSlash) {
        pushCandidate(matchedSlash[1], matchedSlash[2], 'slash');
        matchedSlash = slashRegex.exec(rawText);
    }

    return candidates.sort((left, right) => {
        if (left.source !== right.source) {
            return left.source === 'keyword' ? -1 : 1;
        }

        return right.normalized - left.normalized;
    })[0];
};

const scoreGpaCriterion = (rawCandidateText, normalizedCandidateText) => {
    const detectedGpa = extractGpaInfo(rawCandidateText, normalizedCandidateText);

    if (!detectedGpa) {
        return {
            key: 'gpa',
            score: 30,
            detail: 'Hệ thống chưa tìm thấy GPA rõ ràng trong CV.',
            matchedKeywords: [],
            missingKeywords: ['GPA'],
            detectedGpa: '--',
        };
    }

    const score =
        detectedGpa.normalized >= 3.4 ? 94 :
        detectedGpa.normalized >= 3.0 ? 82 :
        detectedGpa.normalized >= 2.6 ? 65 :
        48;

    return {
        key: 'gpa',
        score,
        detail: `Phát hiện GPA ${detectedGpa.display} trong CV.`,
        matchedKeywords: [detectedGpa.display],
        missingKeywords: score < 65 ? ['Tăng GPA'] : [],
        detectedGpa: detectedGpa.display,
    };
};

const scoreSkillsCriterion = (jobData, normalizedCandidateText, candidateTokens) => {
    const skillTerms = getJobTerms(jobData).filter(({ term }) => KNOWN_KEYWORDS.includes(term)).slice(0, 8);

    if (!skillTerms.length) {
        return {
            key: 'skills',
            score: 65,
            detail: 'Tin đăng chưa có bộ kỹ năng nổi bật để đối chiếu.',
            matchedKeywords: [],
            missingKeywords: [],
        };
    }

    const matchedTerms = skillTerms.filter(({ term }) =>
        term.includes(' ') ? normalizedCandidateText.includes(term) : candidateTokens.has(term),
    );
    const missingTerms = skillTerms.filter(({ term }) => !matchedTerms.some((item) => item.term === term));
    const totalWeight = skillTerms.reduce((sum, item) => sum + item.weight, 0);
    const matchedWeight = matchedTerms.reduce((sum, item) => sum + item.weight, 0);
    const ratio = totalWeight > 0 ? matchedWeight / totalWeight : 0;
    const score = Math.round(25 + ratio * 70);

    return {
        key: 'skills',
        score,
        detail:
            matchedTerms.length > 0
                ? `CV đã bắt được ${matchedTerms.length}/${skillTerms.length} nhóm kỹ năng quan trọng của tin đăng.`
                : 'CV chưa bắt được nhóm kỹ năng trong mô tả công việc.',
        matchedKeywords: matchedTerms.slice(0, 5).map(({ term }) => formatKeyword(term)),
        missingKeywords: missingTerms.slice(0, 5).map(({ term }) => formatKeyword(term)),
    };
};

export const analyzeCvMatch = async (file, jobData) => {
    const extractedText = await extractCvText(file);
    const rawCandidateText = `${file.name} ${getPrintableText(extractedText)}`.trim();
    const normalizedCandidateText = normalizeText(rawCandidateText);
    const candidateTokens = new Set(normalizedCandidateText.split(' ').filter(Boolean));
    const criteriaScores = [
        scoreLevelCriterion(jobData, normalizedCandidateText),
        scorePositionCriterion(jobData, normalizedCandidateText, candidateTokens),
        scoreLocationCriterion(jobData, normalizedCandidateText, candidateTokens),
        scoreSkillsCriterion(jobData, normalizedCandidateText, candidateTokens),
        scoreGpaCriterion(rawCandidateText, normalizedCandidateText),
    ];

    const score = Math.round(
        criteriaScores.reduce((sum, item) => sum + item.score, 0) / (criteriaScores.length || 1),
    );
    const limitedContent = normalizedCandidateText.length < MIN_CONTENT_LENGTH;
    const matchedKeywords = dedupeList(criteriaScores.flatMap((item) => item.matchedKeywords)).slice(0, 8);
    const missingKeywords = dedupeList(criteriaScores.flatMap((item) => item.missingKeywords)).slice(0, 8);
    const detectedGpa = criteriaScores.find((item) => item.key === 'gpa')?.detectedGpa || '--';

    return {
        score,
        tone: createTone(score),
        summary: createSummary(score),
        matchedKeywords,
        missingKeywords,
        isLimitedContent: limitedContent,
        criteriaScores,
        detectedGpa,
        note: limitedContent
            ? 'Hệ thống đọc được ít nội dung từ file CV, nên kết quả này là mức ước tính cơ bản theo 5 tiêu chí.'
            : 'Kết quả được ước tính từ nội dung CV đã đọc được và 5 tiêu chí: level, chức vụ, địa chỉ, kỹ năng và GPA.',
    };
};
