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
        return 'CV cua ban rat phu hop voi cong viec nay.';
    }

    if (score >= 60) {
        return 'CV cua ban kha phu hop voi cong viec nay.';
    }

    if (score >= 40) {
        return 'CV cua ban co mot phan phu hop voi cong viec nay.';
    }

    return 'CV cua ban chua phu hop cao voi cong viec nay.';
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

export const analyzeCvMatch = async (file, jobData) => {
    const jobTerms = getJobTerms(jobData);
    const extractedText = await extractCvText(file);
    const normalizedCandidateText = normalizeText(`${file.name} ${extractedText}`);
    const candidateTokens = new Set(normalizedCandidateText.split(' ').filter(Boolean));

    const matchedTerms = jobTerms.filter(({ term }) =>
        term.includes(' ') ? normalizedCandidateText.includes(term) : candidateTokens.has(term),
    );
    const missingTerms = jobTerms.filter(({ term }) => !matchedTerms.some((item) => item.term === term));
    const totalWeight = jobTerms.reduce((sum, item) => sum + item.weight, 0);
    const matchedWeight = matchedTerms.reduce((sum, item) => sum + item.weight, 0);

    const score = totalWeight > 0 ? Math.max(0, Math.min(100, Math.round((matchedWeight / totalWeight) * 100))) : 0;
    const limitedContent = normalizedCandidateText.length < MIN_CONTENT_LENGTH;

    return {
        score,
        tone: createTone(score),
        summary: createSummary(score),
        matchedKeywords: matchedTerms.slice(0, 6).map(({ term }) => formatKeyword(term)),
        missingKeywords: missingTerms.slice(0, 6).map(({ term }) => formatKeyword(term)),
        isLimitedContent: limitedContent,
        note: limitedContent
            ? 'He thong doc duoc it noi dung tu file CV, nen ket qua nay la muc uoc tinh co ban.'
            : 'Ket qua duoc uoc tinh tu noi dung CV da doc duoc va mo ta cong viec hien tai.',
    };
};
