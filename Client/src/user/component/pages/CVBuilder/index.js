import React, { useContext, useEffect, useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { FaCalendarAlt, FaEnvelope, FaLink, FaMapMarkerAlt, FaPhoneAlt } from 'react-icons/fa';
import { AuthContext } from '~/context/AuthContext';
import styles from './CVBuilder.module.scss';

const MAX_SKILLS = 10;
const MAX_INTERESTS = 6;
const MAX_EXPERIENCES = 5;
const MAX_BULLETS = 4;
const MAX_AWARDS = 4;
const MAX_CERTIFICATIONS = 4;
const DESIGNER_MAX_EXPERIENCES = 4;
const DESIGNER_MAX_BULLETS = 3;
const DESIGNER_MAX_SKILLS = 6;
const DESIGNER_MAX_INTERESTS = 4;
const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;
const LEFT_COLUMN_WIDTH = 63;
const RIGHT_COLUMN_X = 69;
const RIGHT_CONTENT_WIDTH = 132;
const PDF_FONT_NAME = 'SegoeUI';
const PDF_FONT_BOLD_NAME = 'SegoeUISemibold';
const PDF_BULLET_TEXT_INDENT = 4.5;
const LIST_LIMITS = {
    skills: MAX_SKILLS,
    interests: MAX_INTERESTS,
};
const PDF_FONT_SCALE = 1.06;
const PDF_LINE_HEIGHT_SCALE = 1.05;

let pdfFontAssetsPromise = null;

const CONTACT_FIELDS = [
    { key: 'phone', label: 'Điện thoại', Icon: FaPhoneAlt, placeholder: '0943009243' },
    { key: 'birth', label: 'Ngày sinh', Icon: FaCalendarAlt, placeholder: '31/12/2003' },
    { key: 'email', label: 'Email', Icon: FaEnvelope, placeholder: 'ban@example.com' },
    { key: 'website', label: 'LinkedIn / Hồ sơ cá nhân', Icon: FaLink, placeholder: 'linkedin.com/in/ban' },
    { key: 'address', label: 'Địa chỉ', Icon: FaMapMarkerAlt, placeholder: 'Quận 2, Hồ Chí Minh' },
];

const CV_THEMES = [
    {
        id: 'earth',
        label: 'Nâu ấm',
        description: 'Cổ điển, chuyên nghiệp',
        swatches: ['#56362a', '#704739', '#cde0ec'],
        colors: {
            leftStart: '#56362a',
            leftEnd: '#3a241c',
            badge: '#704739',
            section: '#5c3829',
            sectionLine: '#36271f',
            rightStart: '#eef3f7',
            rightMid: '#fafcfd',
            rightEnd: '#edf5fb',
            shapePrimary: '#cde0ec',
            shapeSecondary: '#e3ecf3',
        },
    },
    {
        id: 'ocean',
        label: 'Xanh biển',
        description: 'Hiện đại, sáng sạch',
        swatches: ['#0f4c5c', '#16697a', '#b9dde7'],
        colors: {
            leftStart: '#0f4c5c',
            leftEnd: '#0b2e39',
            badge: '#16697a',
            section: '#146072',
            sectionLine: '#0b3a47',
            rightStart: '#edf8fb',
            rightMid: '#fbfeff',
            rightEnd: '#e3f2f7',
            shapePrimary: '#b9dde7',
            shapeSecondary: '#dceef3',
        },
    },
    {
        id: 'emerald',
        label: 'Ngọc lục',
        description: 'Tươi nhưng vẫn trang nhã',
        swatches: ['#15524c', '#1d6b63', '#c5e5d6'],
        colors: {
            leftStart: '#15524c',
            leftEnd: '#0d332f',
            badge: '#1d6b63',
            section: '#1f5e57',
            sectionLine: '#0f3b36',
            rightStart: '#edf7f3',
            rightMid: '#fbfefd',
            rightEnd: '#e4f2eb',
            shapePrimary: '#c5e5d6',
            shapeSecondary: '#dff1e7',
        },
    },
    {
        id: 'royal',
        label: 'Xanh đậm',
        description: 'Mạnh mẽ, kỹ thuật',
        swatches: ['#234074', '#335694', '#c9d6f2'],
        colors: {
            leftStart: '#234074',
            leftEnd: '#15254b',
            badge: '#335694',
            section: '#2a4c86',
            sectionLine: '#18315e',
            rightStart: '#eef3fb',
            rightMid: '#fbfcff',
            rightEnd: '#e7eef9',
            shapePrimary: '#c9d6f2',
            shapeSecondary: '#e2e9f9',
        },
    },
    {
        id: 'sunset',
        label: 'Cam đất',
        description: 'Nổi bật mà vẫn ấm',
        swatches: ['#7c3f1f', '#a85b28', '#efd3bb'],
        colors: {
            leftStart: '#7c3f1f',
            leftEnd: '#4c2411',
            badge: '#a85b28',
            section: '#8f491d',
            sectionLine: '#5d3017',
            rightStart: '#fbf4ef',
            rightMid: '#fffdfb',
            rightEnd: '#f8ede3',
            shapePrimary: '#efd3bb',
            shapeSecondary: '#f7e6d7',
        },
    },
    {
        id: 'berry',
        label: 'Đỏ rượu',
        description: 'Sang và khác biệt',
        swatches: ['#6b2c3e', '#91435a', '#ecc7d1'],
        colors: {
            leftStart: '#6b2c3e',
            leftEnd: '#421825',
            badge: '#91435a',
            section: '#7e354b',
            sectionLine: '#4d2030',
            rightStart: '#fbf1f3',
            rightMid: '#fffafc',
            rightEnd: '#f8e8ec',
            shapePrimary: '#ecc7d1',
            shapeSecondary: '#f5dde3',
        },
    },
    {
        id: 'graphite',
        label: 'Ghi xám',
        description: 'Tối giản, trung tính',
        swatches: ['#374151', '#4b5563', '#d1d5db'],
        colors: {
            leftStart: '#374151',
            leftEnd: '#1f2937',
            badge: '#4b5563',
            section: '#42505f',
            sectionLine: '#111827',
            rightStart: '#f3f4f6',
            rightMid: '#ffffff',
            rightEnd: '#eef2f7',
            shapePrimary: '#d1d5db',
            shapeSecondary: '#e5e7eb',
        },
    },
    {
        id: 'forest',
        label: 'Rừng xanh',
        description: 'Đậm, gọn và chắc',
        swatches: ['#1f5d3b', '#2f7a50', '#cde6d4'],
        colors: {
            leftStart: '#1f5d3b',
            leftEnd: '#123825',
            badge: '#2f7a50',
            section: '#286847',
            sectionLine: '#163e29',
            rightStart: '#eff8f2',
            rightMid: '#fcfffd',
            rightEnd: '#e7f3ea',
            shapePrimary: '#cde6d4',
            shapeSecondary: '#e3f0e7',
        },
    },
    {
        id: 'coral',
        label: 'San hô',
        description: 'Trẻ, sáng và nổi',
        swatches: ['#a94d3f', '#ca6a5a', '#f0d0ca'],
        colors: {
            leftStart: '#a94d3f',
            leftEnd: '#6a2d23',
            badge: '#ca6a5a',
            section: '#b75b4c',
            sectionLine: '#7d372b',
            rightStart: '#fdf5f3',
            rightMid: '#fffdfd',
            rightEnd: '#f9ece9',
            shapePrimary: '#f0d0ca',
            shapeSecondary: '#f7e3de',
        },
    },
    {
        id: 'amber',
        label: 'Hổ phách',
        description: 'Ấm, rõ và sáng',
        swatches: ['#8a621c', '#b8831f', '#f1ddb0'],
        colors: {
            leftStart: '#8a621c',
            leftEnd: '#573d11',
            badge: '#b8831f',
            section: '#a7751c',
            sectionLine: '#694911',
            rightStart: '#fcf8ee',
            rightMid: '#fffefb',
            rightEnd: '#f8f0dc',
            shapePrimary: '#f1ddb0',
            shapeSecondary: '#f7ecd0',
        },
    },
    {
        id: 'teal',
        label: 'Xanh ngọc',
        description: 'Mát, hiện đại, sạch',
        swatches: ['#0f766e', '#14958a', '#c7ebe8'],
        colors: {
            leftStart: '#0f766e',
            leftEnd: '#084743',
            badge: '#14958a',
            section: '#11857b',
            sectionLine: '#095650',
            rightStart: '#edf9f8',
            rightMid: '#fbfffe',
            rightEnd: '#e4f4f2',
            shapePrimary: '#c7ebe8',
            shapeSecondary: '#def5f3',
        },
    },
    {
        id: 'plum',
        label: 'Mận chín',
        description: 'Đậm, mềm và khác biệt',
        swatches: ['#62426b', '#7a5290', '#e4d5ec'],
        colors: {
            leftStart: '#62426b',
            leftEnd: '#3c2741',
            badge: '#7a5290',
            section: '#6e4784',
            sectionLine: '#4a3156',
            rightStart: '#f8f2fb',
            rightMid: '#fffafe',
            rightEnd: '#f1e8f7',
            shapePrimary: '#e4d5ec',
            shapeSecondary: '#f0e6f5',
        },
    },
];

const CV_THEME_MAP = CV_THEMES.reduce((accumulator, theme) => {
    accumulator[theme.id] = theme;
    return accumulator;
}, {});
const DEFAULT_THEME_ID = CV_THEMES[0]?.id || 'earth';
const REFERENCE_TEMPLATE_ID = 'topcv-reference';
const DESIGNER_TEMPLATE_ID = 'topcv-designer-inline';
const REFERENCE_THEME = {
    id: 'topcv-reference-theme',
    colors: {
        leftStart: '#6f7d7d',
        leftEnd: '#3f4747',
        badge: '#6f7d7d',
        section: '#6f7d7d',
        sectionLine: '#7b8787',
        rightStart: '#ffffff',
        rightMid: '#ffffff',
        rightEnd: '#ffffff',
        shapePrimary: '#ffffff',
        shapeSecondary: '#ffffff',
    },
};
const DESIGNER_THEME = {
    id: 'topcv-designer-theme',
    colors: {
        leftStart: '#f7efe6',
        leftEnd: '#f7efe6',
        badge: '#d9b5a1',
        section: '#d9b5a1',
        sectionLine: '#c9a792',
        rightStart: '#f7efe6',
        rightMid: '#f7efe6',
        rightEnd: '#f7efe6',
        shapePrimary: '#f7efe6',
        shapeSecondary: '#f7efe6',
    },
};
const CV_TEMPLATES = [
    {
        id: 'jobconnect-flex',
        label: 'Mẫu 1',
        description: 'Giữ bố cục OCR hiện tại và cho phép đổi màu tự do.',
        previewLabel: 'Mẫu hiện tại',
        themeMode: 'custom',
        previewVariant: 'dynamic',
        pdfVariant: 'dynamic',
        lockedThemeName: '',
        labels: {
            objective: 'Mục tiêu nghề nghiệp',
            experience: 'Kinh nghiệm làm việc',
            education: 'Học vấn',
            skills: 'Kỹ năng',
            interests: 'Sở thích',
        },
    },
    {
        id: DESIGNER_TEMPLATE_ID,
        label: 'Mẫu 2',
        description: 'Header ngang, ảnh bên phải, cụm thông tin cuối trang và vẫn cho đổi màu.',
        previewLabel: 'Theo ảnh mới',
        themeMode: 'custom',
        previewVariant: 'designer',
        pdfVariant: 'designer',
        lockedTheme: DESIGNER_THEME,
        lockedThemeName: 'Ivory Designer',
        labels: {
            objective: 'Giới thiệu',
            experience: 'Kinh nghiệm làm việc',
            education: 'Học vấn',
            skills: 'Kỹ năng',
            interests: 'Sở thích',
        },
    },
];
const CV_TEMPLATE_MAP = CV_TEMPLATES.reduce((accumulator, template) => {
    accumulator[template.id] = template;
    return accumulator;
}, {});
const DEFAULT_TEMPLATE_ID = CV_TEMPLATES[0]?.id || 'jobconnect-flex';
const LEGACY_ROLE_LEVEL_PATTERN =
    /^(thực tập sinh|thuc tap sinh|thực tập|thuc tap|trainee|intern|fresher|junior|mid-level|mid level|middle|senior)\b[\s|:/-]*/i;
const LEGACY_ROLE_LEVEL_AT_END_PATTERN =
    /\b(thực tập sinh|thuc tap sinh|thực tập|thuc tap|trainee|intern|fresher|junior|mid-level|mid level|middle|senior)$/i;

const trimValue = (value = '') => value.toString().trim();

const getCvTheme = (themeId) => CV_THEME_MAP[themeId] || CV_THEME_MAP[DEFAULT_THEME_ID];
const getCvTemplate = (templateId) => CV_TEMPLATE_MAP[templateId] || CV_TEMPLATE_MAP[DEFAULT_TEMPLATE_ID];
const getEffectiveTheme = (cvData = {}) =>
    getCvTemplate(cvData.templateId).themeMode === 'locked'
        ? getCvTemplate(cvData.templateId).lockedTheme || DESIGNER_THEME
        : getCvTheme(cvData.themeId);

const splitLegacyHeadline = (headline = '') => {
    const normalizedHeadline = trimValue(headline);

    if (!normalizedHeadline) {
        return { level: '', position: '' };
    }

    const pipeParts = normalizedHeadline.split('|').map(trimValue).filter(Boolean);

    if (pipeParts.length >= 2) {
        return {
            level: pipeParts[0],
            position: pipeParts.slice(1).join(' | '),
        };
    }

    const levelAtStart = normalizedHeadline.match(LEGACY_ROLE_LEVEL_PATTERN);

    if (levelAtStart) {
        return {
            level: trimValue(levelAtStart[1]),
            position: trimValue(normalizedHeadline.slice(levelAtStart[0].length)),
        };
    }

    const levelAtEnd = normalizedHeadline.match(LEGACY_ROLE_LEVEL_AT_END_PATTERN);

    if (levelAtEnd) {
        return {
            level: trimValue(levelAtEnd[1]),
            position: trimValue(normalizedHeadline.slice(0, levelAtEnd.index)),
        };
    }

    return { level: '', position: normalizedHeadline };
};

const getDesiredRoleContent = (cvData = {}) => {
    const legacyHeadline = splitLegacyHeadline(cvData.headline);

    return {
        level: trimValue(cvData.desiredLevel || legacyHeadline.level),
        position: trimValue(cvData.desiredPosition || legacyHeadline.position),
    };
};

const buildDesiredRoleHeadline = (cvData = {}) => {
    const { level, position } = getDesiredRoleContent(cvData);
    return [level, position].filter(Boolean).join(' | ');
};

const getDesiredRolePreviewItems = (cvData = {}) => {
    const { level, position } = getDesiredRoleContent(cvData);

    if (!level && !position) {
        return [
            { key: 'level', text: 'Trình độ', kind: 'level' },
            { key: 'position', text: 'Vị trí ứng tuyển', kind: 'position' },
        ];
    }

    return [
        level ? { key: 'level', text: level, kind: 'level' } : null,
        position ? { key: 'position', text: position, kind: 'position' } : null,
    ].filter(Boolean);
};

const hexToRgb = (hex = '') => {
    const normalized = hex.replace('#', '');
    const value =
        normalized.length === 3
            ? normalized
                  .split('')
                  .map((char) => `${char}${char}`)
                  .join('')
            : normalized;

    return {
        r: Number.parseInt(value.slice(0, 2), 16),
        g: Number.parseInt(value.slice(2, 4), 16),
        b: Number.parseInt(value.slice(4, 6), 16),
    };
};

const hexToRgbaString = (hex, alpha) => {
    const { r, g, b } = hexToRgb(hex);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const getPreviewThemeStyle = (theme) => ({
    '--cv-left-start': theme.colors.leftStart,
    '--cv-left-end': theme.colors.leftEnd,
    '--cv-badge-bg': theme.colors.badge,
    '--cv-section-bg': theme.colors.section,
    '--cv-section-line': theme.colors.sectionLine,
    '--cv-right-start': theme.colors.rightStart,
    '--cv-right-mid': theme.colors.rightMid,
    '--cv-right-end': theme.colors.rightEnd,
    '--cv-shape-primary': hexToRgbaString(theme.colors.shapePrimary, 0.46),
    '--cv-shape-primary-soft': hexToRgbaString(theme.colors.shapePrimary, 0.22),
    '--cv-shape-secondary': hexToRgbaString(theme.colors.shapeSecondary, 0.42),
    '--cv-shape-secondary-soft': hexToRgbaString(theme.colors.shapeSecondary, 0.14),
});

const setDocFillColor = (doc, hex) => {
    const { r, g, b } = hexToRgb(hex);
    doc.setFillColor(r, g, b);
};

const setDocDrawColor = (doc, hex) => {
    const { r, g, b } = hexToRgb(hex);
    doc.setDrawColor(r, g, b);
};

const hasEducationData = (education = {}) => Object.values(education).some((value) => trimValue(value));

const buildEducationHighlights = (education = {}) => {
    const highlights = [];

    if (trimValue(education.gpa)) {
        highlights.push(`GPA: ${education.gpa}`);
    }

    if (trimValue(education.thesis)) {
        highlights.push(`Đồ án tốt nghiệp: ${education.thesis}`);
    }

    return highlights;
};

const normalizeTextListField = (value) => {
    if (Array.isArray(value)) {
        const normalizedItems = value.map(trimValue).filter(Boolean);
        return normalizedItems.length ? normalizedItems : [''];
    }

    if (typeof value === 'string') {
        const normalizedItems = value
            .split(/\r?\n|[;,]/)
            .map(trimValue)
            .filter(Boolean);
        return normalizedItems.length ? normalizedItems : [''];
    }

    return [''];
};

const createEmptyExperience = () => ({
    id: Date.now() + Math.random(),
    position: '',
    company: '',
    start: '',
    end: '',
    bullets: [''],
});

const createEmptyMetaItem = () => ({
    id: Date.now() + Math.random(),
    date: '',
    title: '',
});

const createEmptyCV = () => ({
    templateId: DEFAULT_TEMPLATE_ID,
    themeId: DEFAULT_THEME_ID,
    cvTitle: '',
    fullName: '',
    desiredLevel: '',
    desiredPosition: '',
    headline: '',
    objective: '',
    contacts: {
        phone: '',
        birth: '',
        email: '',
        website: '',
        address: '',
    },
    skills: [''],
    interests: [''],
    awards: [createEmptyMetaItem()],
    certifications: [createEmptyMetaItem()],
    experiences: [createEmptyExperience()],
    education: {
        major: '',
        start: '',
        end: '',
        school: '',
        gpa: '',
        thesis: '',
    },
});

const normalizeCvData = (rawData = {}) => {
    const emptyCV = createEmptyCV();
    const legacyHeadline = splitLegacyHeadline(rawData.headline);
    const desiredLevel = trimValue(rawData.desiredLevel || legacyHeadline.level);
    const desiredPosition = trimValue(rawData.desiredPosition || legacyHeadline.position);
    const rawContacts =
        rawData.contacts && typeof rawData.contacts === 'object' && !Array.isArray(rawData.contacts)
            ? rawData.contacts
            : {};
    const normalizedTemplateId =
        rawData.templateId === REFERENCE_TEMPLATE_ID
            ? DESIGNER_TEMPLATE_ID
            : getCvTemplate(rawData.templateId).id;
    const rawAwards = Array.isArray(rawData.awards) ? rawData.awards : [createEmptyMetaItem()];
    const rawCertifications = Array.isArray(rawData.certifications)
        ? rawData.certifications
        : [createEmptyMetaItem()];
    const rawExperiences =
        Array.isArray(rawData.experiences) && rawData.experiences.length
            ? rawData.experiences
            : [createEmptyExperience()];

    return {
        ...emptyCV,
        ...rawData,
        templateId: normalizedTemplateId,
        themeId: getCvTheme(rawData.themeId).id,
        cvTitle: trimValue(rawData.cvTitle || rawData.title || ''),
        desiredLevel,
        desiredPosition,
        headline:
            buildDesiredRoleHeadline({
                desiredLevel,
                desiredPosition,
                headline: rawData.headline,
            }) || trimValue(rawData.headline || ''),
        contacts: {
            ...emptyCV.contacts,
            phone: trimValue(rawContacts.phone ?? rawData.phone),
            birth: trimValue(rawContacts.birth ?? rawData.birth ?? rawData.dateOfBirth ?? rawData.dateOfbirth),
            email: trimValue(rawContacts.email ?? rawData.email),
            website: trimValue(rawContacts.website ?? rawData.website ?? rawData.linkedin ?? rawData.portfolio),
            address: trimValue(rawContacts.address ?? rawData.address),
        },
        skills: normalizeTextListField(rawData.skills ?? rawData.skill),
        interests: normalizeTextListField(
            rawData.interests ?? rawData.hobbies ?? rawData.hobby ?? rawData.interest,
        ),
        awards: rawAwards.slice(0, MAX_AWARDS).map((item) => ({
            ...createEmptyMetaItem(),
            ...item,
            id: item?.id || Date.now() + Math.random(),
        })),
        certifications: rawCertifications.slice(0, MAX_CERTIFICATIONS).map((item) => ({
            ...createEmptyMetaItem(),
            ...item,
            id: item?.id || Date.now() + Math.random(),
        })),
        experiences: rawExperiences.slice(0, MAX_EXPERIENCES).map((experience) => ({
            ...createEmptyExperience(),
            ...experience,
            id: experience?.id || Date.now() + Math.random(),
            bullets: Array.isArray(experience?.bullets) && experience.bullets.length ? experience.bullets : [''],
        })),
        education: {
            ...emptyCV.education,
            ...(rawData.education || {}),
        },
    };
};

const buildResumeTitle = (cvData) =>
    trimValue(cvData.cvTitle) || buildDesiredRoleHeadline(cvData) || trimValue(cvData.fullName) || 'CV chưa đặt tên';

const formatPeriod = (start = '', end = '', fallback = 'Bắt đầu - Kết thúc') => {
    const from = trimValue(start);
    const to = trimValue(end);

    if (!from && !to) {
        return fallback;
    }

    return `${from || 'Bắt đầu'} - ${to || 'Kết thúc'}`;
};

const formatDisplayDate = (value) => {
    if (!value) {
        return 'Chưa cập nhật';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return 'Chưa cập nhật';
    }

    return date.toLocaleDateString('vi-VN');
};

const getVisibleMetaItems = (items = [], maxItems = MAX_AWARDS) =>
    items
        .map((item) => ({
            ...item,
            date: trimValue(item?.date),
            title: trimValue(item?.title),
        }))
        .filter((item) => item.date || item.title)
        .slice(0, maxItems);

const getDesignerVisibleContacts = (contacts = {}) => {
    return CONTACT_FIELDS.map(({ key }) => key)
        .map((key) => ({
            key,
            value: trimValue(contacts[key]),
        }))
        .filter((item) => item.value)
        .slice(0, CONTACT_FIELDS.length);
};

const DESIGNER_PLACEHOLDER_CONTACTS = [
    { key: 'phone', value: '0123456789' },
    { key: 'birth', value: '31/12/2003' },
    { key: 'email', value: 'ban@example.com' },
    { key: 'website', value: 'linkedin.com/in/ban' },
    { key: 'address', value: 'Quận 7, Hồ Chí Minh' },
];

const normalizeResumeRecord = (resume) => {
    const cvData = normalizeCvData({
        ...(resume?.cv_data || {}),
        templateId: resume?.template_type || resume?.cv_data?.templateId || DEFAULT_TEMPLATE_ID,
        cvTitle: resume?.title || resume?.cv_data?.cvTitle || '',
    });

    return {
        id: resume?.id || '',
        title: resume?.title || buildResumeTitle(cvData),
        template_type: getCvTemplate(resume?.template_type || cvData.templateId).id,
        avatar_data: resume?.avatar_data || '',
        created_at: resume?.created_at || '',
        updated_at: resume?.updated_at || '',
        cv_data: cvData,
    };
};

const arrayBufferToBase64 = (buffer) => {
    const bytes = new Uint8Array(buffer);
    const chunkSize = 0x8000;
    let binary = '';

    for (let index = 0; index < bytes.length; index += chunkSize) {
        const chunk = bytes.subarray(index, index + chunkSize);
        binary += String.fromCharCode(...chunk);
    }

    return window.btoa(binary);
};

const loadFontAsset = async (assetPath) => {
    const response = await fetch(assetPath);

    if (!response.ok) {
        throw new Error(`Không thể tải font PDF: ${assetPath}`);
    }

    return arrayBufferToBase64(await response.arrayBuffer());
};

const ensurePdfFonts = async (doc) => {
    if (!pdfFontAssetsPromise) {
        const basePath = process.env.PUBLIC_URL || '';

        pdfFontAssetsPromise = Promise.all([
            loadFontAsset(`${basePath}/fonts/segoeui.ttf`),
            loadFontAsset(`${basePath}/fonts/seguisb.ttf`),
        ]).then(([normalFont, boldFont]) => ({
            normalFont,
            boldFont,
        }));
    }

    const { normalFont, boldFont } = await pdfFontAssetsPromise;

    doc.addFileToVFS('segoeui.ttf', normalFont);
    doc.addFont('segoeui.ttf', PDF_FONT_NAME, 'normal');
    doc.addFileToVFS('seguisb.ttf', boldFont);
    doc.addFont('seguisb.ttf', PDF_FONT_BOLD_NAME, 'bold');
};

const truncateLineToWidth = (doc, text, maxWidth) => {
    if (!text) {
        return '';
    }

    let truncated = text;

    while (truncated && doc.getTextWidth(`${truncated}...`) > maxWidth) {
        truncated = truncated.slice(0, -1);
    }

    return truncated ? `${truncated}...` : '...';
};

const getWrappedLines = (doc, text, maxWidth, maxLines = Infinity) => {
    const normalizedText = String(text || '').replace(/\r/g, '');

    if (!trimValue(normalizedText)) {
        return [];
    }

    const paragraphs = normalizedText.split('\n');
    let lines = [];

    paragraphs.forEach((paragraph) => {
        const paragraphText = trimValue(paragraph);

        if (!paragraphText) {
            return;
        }

        const wrapped = doc.splitTextToSize(paragraphText, maxWidth);
        lines = lines.concat(wrapped);
    });

    if (lines.length <= maxLines) {
        return lines;
    }

    const limited = lines.slice(0, maxLines);
    limited[maxLines - 1] = truncateLineToWidth(doc, limited[maxLines - 1], maxWidth);
    return limited;
};

const drawTextLines = (doc, lines, x, y, lineHeight, options = {}) => {
    if (!lines.length) {
        return y;
    }

    const { align = 'left' } = options;
    let currentY = y;

    lines.forEach((line) => {
        doc.text(line, x, currentY, { align });
        currentY += lineHeight;
    });

    return currentY;
};

const getFittedPdfFontSize = (doc, text, preferredSize, minSize, maxWidth) => {
    let fontSize = scalePdfFont(preferredSize);
    const minimumFontSize = scalePdfFont(minSize);

    doc.setFontSize(fontSize);

    while (fontSize > minimumFontSize && doc.getTextWidth(text) > maxWidth) {
        fontSize = Number(Math.max(fontSize - 0.2, minimumFontSize).toFixed(2));
        doc.setFontSize(fontSize);
    }

    return fontSize;
};

const drawPdfDesiredRole = (doc, cvData, centerX, startY, maxWidth = 44) => {
    const desiredRoleItems = getDesiredRolePreviewItems(cvData);
    let currentY = startY;

    desiredRoleItems.forEach((item, index) => {
        const isLevelLine = item.kind === 'level' && desiredRoleItems.length > 1;
        const lineWidth = isLevelLine ? maxWidth : maxWidth + 3;

        doc.setFont(PDF_FONT_BOLD_NAME, 'bold');

        const fittedFontSize = getFittedPdfFontSize(
            doc,
            item.text,
            isLevelLine ? 10.8 : 12,
            isLevelLine ? 10 : 10.2,
            lineWidth,
        );
        const shouldKeepSingleLine = doc.getTextWidth(item.text) <= lineWidth;

        doc.setFontSize(fittedFontSize);

        const lines = getWrappedLines(doc, item.text, lineWidth, shouldKeepSingleLine || isLevelLine ? 1 : 2);
        currentY = drawTextLines(
            doc,
            lines,
            centerX,
            currentY + (index === 0 ? 1.5 : 0.45),
            scalePdfLineHeight(isLevelLine ? 4.3 : 5),
            { align: 'center' },
        );
    });

    return currentY;
};

const drawPdfDesiredRoleSingleLine = (doc, cvData, centerX, startY, maxWidth = 46) => {
    const desiredRoleText = buildDesiredRoleHeadline(cvData) || 'Desired Role';

    doc.setFont(PDF_FONT_BOLD_NAME, 'bold');

    const fittedFontSize = getFittedPdfFontSize(doc, desiredRoleText, 11.8, 10, maxWidth);
    doc.setFontSize(fittedFontSize);

    const lines = getWrappedLines(doc, desiredRoleText, maxWidth, 2);

    return drawTextLines(doc, lines, centerX, startY + 1.5, scalePdfLineHeight(lines.length > 1 ? 4.5 : 5), {
        align: 'center',
    });
};

const drawPdfContactIcon = (doc, key, x, y, badgeHex = '#704739') => {
    setDocFillColor(doc, badgeHex);
    doc.setDrawColor(255, 255, 255);
    doc.setLineWidth(0.18);
    doc.circle(x, y, 2.15, 'FD');

    doc.setDrawColor(255, 255, 255);
    doc.setFillColor(255, 255, 255);
    doc.setLineWidth(0.26);

    switch (key) {
        case 'phone':
            doc.roundedRect(x - 0.95, y - 1.3, 1.9, 2.65, 0.26, 0.26, 'S');
            doc.line(x - 0.33, y - 0.86, x + 0.33, y - 0.86);
            doc.circle(x, y + 0.8, 0.08, 'F');
            break;
        case 'birth':
            doc.roundedRect(x - 1.08, y - 1.02, 2.16, 1.95, 0.2, 0.2, 'S');
            doc.line(x - 1.08, y - 0.3, x + 1.08, y - 0.3);
            doc.line(x - 0.52, y - 1.28, x - 0.52, y - 0.66);
            doc.line(x + 0.52, y - 1.28, x + 0.52, y - 0.66);
            doc.line(x - 0.56, y + 0.18, x - 0.08, y + 0.18);
            doc.line(x + 0.08, y + 0.18, x + 0.56, y + 0.18);
            break;
        case 'email':
            doc.roundedRect(x - 1.18, y - 0.82, 2.36, 1.64, 0.14, 0.14, 'S');
            doc.line(x - 1.18, y - 0.82, x, y + 0.06);
            doc.line(x + 1.18, y - 0.82, x, y + 0.06);
            break;
        case 'website':
            doc.circle(x, y, 0.98, 'S');
            doc.line(x - 0.74, y, x + 0.74, y);
            doc.line(x, y - 0.74, x, y + 0.74);
            doc.line(x - 0.48, y - 0.48, x + 0.48, y + 0.48);
            break;
        case 'address':
            doc.circle(x, y - 0.34, 0.7, 'S');
            doc.circle(x, y - 0.34, 0.13, 'F');
            doc.line(x, y + 0.22, x, y + 1.18);
            doc.line(x - 0.38, y + 0.82, x, y + 1.18);
            doc.line(x + 0.38, y + 0.82, x, y + 1.18);
            break;
        default:
            doc.circle(x, y, 0.5, 'F');
            break;
    }
};

const scalePdfFont = (size) => Number((size * PDF_FONT_SCALE).toFixed(2));
const scalePdfLineHeight = (size) => Number((size * PDF_LINE_HEIGHT_SCALE).toFixed(2));

const drawBulletList = (doc, items, startX, startY, contentWidth, maxLinesPerBullet = 2) => {
    let currentY = startY;
    const textX = startX + PDF_BULLET_TEXT_INDENT;
    const textWidth = Math.max(contentWidth - PDF_BULLET_TEXT_INDENT, 16);

    items.forEach((item) => {
        const lines = getWrappedLines(doc, item, textWidth, maxLinesPerBullet);

        if (!lines.length) {
            return;
        }

        doc.setFont(PDF_FONT_BOLD_NAME, 'bold');
        doc.setFontSize(scalePdfFont(10));
        doc.text('•', startX, currentY);
        doc.setFont(PDF_FONT_NAME, 'normal');
        doc.setFontSize(scalePdfFont(9.5));
        currentY = drawTextLines(doc, lines, textX, currentY, scalePdfLineHeight(4.1));
        currentY += 1;
    });

    return currentY;
};

const drawSectionHeader = (doc, label, baselineY, theme) => {
    doc.setFont(PDF_FONT_BOLD_NAME, 'bold');
    doc.setFontSize(scalePdfFont(10.5));
    const badgeWidth = Math.max(doc.getTextWidth(label) + 8.5, 24);

    setDocFillColor(doc, theme.colors.section);
    doc.roundedRect(RIGHT_COLUMN_X - 1.2, baselineY - 4.8, badgeWidth, 7.3, 3.6, 3.6, 'F');
    doc.setTextColor(255, 255, 255);
    doc.text(label, RIGHT_COLUMN_X + 3, baselineY);
    setDocDrawColor(doc, theme.colors.sectionLine);
    doc.setLineWidth(0.25);
    doc.line(RIGHT_COLUMN_X + badgeWidth + 1.8, baselineY - 1.5, PAGE_WIDTH - 8, baselineY - 1.5);
    doc.setTextColor(30, 32, 35);
};

const drawPdfLeftBadge = (doc, label, baselineY, theme) => {
    doc.setFont(PDF_FONT_BOLD_NAME, 'bold');
    doc.setFontSize(10);
    const badgeWidth = Math.max(doc.getTextWidth(label) + 8.5, 20);

    setDocFillColor(doc, theme.colors.badge);
    doc.roundedRect(4.8, baselineY - 4.8, badgeWidth, 7.3, 3.6, 3.6, 'F');
    doc.setTextColor(255, 255, 255);
    doc.text(label, 7.7, baselineY);
};

const createAvatarDataUrl = (source, { size = 500, circular = true, outputType = 'image/png', quality } = {}) =>
    new Promise((resolve, reject) => {
        if (!source) {
            resolve('');
            return;
        }

        if (source.startsWith('data:') && size >= 400 && circular && outputType === 'image/png') {
            resolve(source);
            return;
        }

        const image = new Image();
        image.crossOrigin = 'anonymous';
        image.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const context = canvas.getContext('2d');

            if (!context) {
                resolve(source);
                return;
            }

            context.clearRect(0, 0, size, size);

            if (circular) {
                context.beginPath();
                context.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
                context.closePath();
                context.clip();
            }

            const imageRatio = image.width / image.height;
            const canvasRatio = 1;
            let drawWidth = size;
            let drawHeight = size;
            let offsetX = 0;
            let offsetY = 0;

            if (imageRatio > canvasRatio) {
                drawHeight = size;
                drawWidth = drawHeight * imageRatio;
                offsetX = (size - drawWidth) / 2;
            } else {
                drawWidth = size;
                drawHeight = drawWidth / imageRatio;
                offsetY = (size - drawHeight) / 2;
            }

            context.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
            resolve(canvas.toDataURL(outputType, quality));
        };

        image.onerror = () => reject(new Error('Không thể xử lý ảnh đại diện.'));
        image.src = source;
    });

const drawPdfBackground = (doc, theme) => {
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, 'F');

    setDocFillColor(doc, theme.colors.rightStart);
    doc.rect(LEFT_COLUMN_WIDTH, 0, PAGE_WIDTH - LEFT_COLUMN_WIDTH, PAGE_HEIGHT, 'F');

    if (theme.id === REFERENCE_THEME.id) {
        const splitY = PAGE_HEIGHT * 0.305;

        setDocFillColor(doc, theme.colors.leftStart);
        doc.rect(0, 0, LEFT_COLUMN_WIDTH, splitY, 'F');
        setDocFillColor(doc, theme.colors.leftEnd);
        doc.rect(0, splitY, LEFT_COLUMN_WIDTH, PAGE_HEIGHT - splitY, 'F');
        return;
    }

    setDocFillColor(doc, theme.colors.leftEnd);
    doc.rect(0, 0, LEFT_COLUMN_WIDTH, PAGE_HEIGHT, 'F');

    setDocFillColor(doc, theme.colors.shapePrimary);
    doc.triangle(95, 185, PAGE_WIDTH, 185, 178, PAGE_HEIGHT, 'F');
    setDocFillColor(doc, theme.colors.shapeSecondary);
    doc.triangle(118, 110, PAGE_WIDTH, 110, 192, 240, 'F');
};

/* eslint-disable no-unused-vars */
const drawPdfLeftColumn = async (
    doc,
    cvData,
    avatar,
    theme = REFERENCE_THEME,
    labels = getCvTemplate(REFERENCE_TEMPLATE_ID).labels,
) => {
    const visibleContacts = CONTACT_FIELDS.filter(({ key }) => trimValue(cvData.contacts[key]));
    const visibleSkills = cvData.skills.map(trimValue).filter(Boolean).slice(0, MAX_SKILLS);
    const visibleInterests = cvData.interests.map(trimValue).filter(Boolean).slice(0, MAX_INTERESTS);
    const hasEducation = hasEducationData(cvData.education);
    const educationHighlights = buildEducationHighlights(cvData.education);
    const avatarCenterX = LEFT_COLUMN_WIDTH / 2;
    const avatarCenterY = 28;
    const outerRadius = 19;
    const innerRadius = 16.5;
    const avatarDataUrl = await createAvatarDataUrl(avatar, { size: 420, circular: true });

    doc.setFillColor(255, 255, 255);
    doc.circle(avatarCenterX, avatarCenterY, outerRadius, 'F');

    if (avatarDataUrl) {
        doc.addImage(
            avatarDataUrl,
            'PNG',
            avatarCenterX - innerRadius,
            avatarCenterY - innerRadius,
            innerRadius * 2,
            innerRadius * 2,
        );
    } else {
        doc.setFillColor(239, 241, 244);
        doc.circle(avatarCenterX, avatarCenterY, innerRadius, 'F');
        doc.setFillColor(174, 181, 191);
        doc.circle(avatarCenterX, avatarCenterY - 7.6, 6.4, 'F');
        doc.ellipse(avatarCenterX, avatarCenterY + 8, 11.8, 8.2, 'F');
    }

    doc.setTextColor(255, 255, 255);
    doc.setFont(PDF_FONT_BOLD_NAME, 'bold');
    doc.setFontSize(scalePdfFont(14.5));
    const nameLines = getWrappedLines(doc, trimValue(cvData.fullName) || 'Họ tên ứng viên', 46, 2);
    let currentY = drawTextLines(doc, nameLines, avatarCenterX, 58, scalePdfLineHeight(5.5), {
        align: 'center',
    });

    currentY = drawPdfDesiredRoleSingleLine(doc, cvData, avatarCenterX, currentY);

    doc.setDrawColor(255, 255, 255);
    doc.setLineWidth(0.2);
    currentY += 6;
    const drawLeftDivider = () => {
        doc.line(7, currentY, LEFT_COLUMN_WIDTH - 7, currentY);
        currentY += 6;
    };

    if (visibleContacts.length > 0) {
        drawLeftDivider();
    }

    doc.setFont(PDF_FONT_NAME, 'normal');
    doc.setFontSize(scalePdfFont(9.3));

    visibleContacts.forEach(({ key }) => {
        const lines = getWrappedLines(doc, cvData.contacts[key], 44, 2);

        if (!lines.length) {
            return;
        }

        drawPdfContactIcon(doc, key, 9.4, currentY - 0.15, theme.colors.badge);
        currentY = drawTextLines(doc, lines, 14.2, currentY + 0.15, scalePdfLineHeight(4.15));
        currentY += 1.55;
    });

    if (hasEducation && currentY < PAGE_HEIGHT - 42) {
        drawLeftDivider();
        drawPdfLeftBadge(doc, labels.education, currentY, theme);
        currentY += 6.2;

        if (trimValue(cvData.education.major)) {
            doc.setFont(PDF_FONT_BOLD_NAME, 'bold');
            doc.setFontSize(scalePdfFont(9.5));
            const majorLines = getWrappedLines(doc, cvData.education.major, 44, 2);
            currentY = drawTextLines(doc, majorLines, 7.7, currentY, scalePdfLineHeight(4.15));
        }

        if (trimValue(cvData.education.start) || trimValue(cvData.education.end)) {
            doc.setFont(PDF_FONT_NAME, 'normal');
            doc.setFontSize(scalePdfFont(9.1));
            const periodLines = getWrappedLines(doc, formatPeriod(cvData.education.start, cvData.education.end), 44, 1);
            currentY = drawTextLines(doc, periodLines, 7.7, currentY + 0.4, scalePdfLineHeight(4));
        }

        if (trimValue(cvData.education.school)) {
            doc.setFont(PDF_FONT_NAME, 'normal');
            doc.setFontSize(scalePdfFont(8.95));
            const schoolLines = getWrappedLines(doc, cvData.education.school, 44, 2);
            currentY = drawTextLines(doc, schoolLines, 7.7, currentY + 0.35, scalePdfLineHeight(4));
        }

        educationHighlights.forEach((item) => {
            if (currentY > PAGE_HEIGHT - 12) {
                return;
            }

            const bulletLines = getWrappedLines(doc, item, 39.5, 2);
            if (!bulletLines.length) {
                return;
            }

            doc.setFont(PDF_FONT_BOLD_NAME, 'bold');
            doc.setFontSize(scalePdfFont(9));
            doc.text('•', 9, currentY + 0.8);
            doc.setFont(PDF_FONT_NAME, 'normal');
            doc.setFontSize(scalePdfFont(8.95));
            currentY = drawTextLines(doc, bulletLines, 12.2, currentY + 0.8, scalePdfLineHeight(3.95));
            currentY += 0.6;
        });
    }

    if (visibleSkills.length > 0) {
        drawLeftDivider();
        drawPdfLeftBadge(doc, labels.skills, currentY, theme);
        currentY += 6.5;

        doc.setFont(PDF_FONT_NAME, 'normal');
        doc.setFontSize(scalePdfFont(9.5));
        visibleSkills.forEach((skill) => {
            const skillLines = getWrappedLines(doc, skill, 44, 2);

            if (!skillLines.length || currentY > PAGE_HEIGHT - 8) {
                return;
            }

            doc.setFont(PDF_FONT_BOLD_NAME, 'bold');
            doc.text('•', 9, currentY);
            doc.setFont(PDF_FONT_NAME, 'normal');
            currentY = drawTextLines(doc, skillLines, 12.2, currentY, scalePdfLineHeight(4.1));
            currentY += 1;
        });
    }

    if (visibleInterests.length > 0 && currentY < PAGE_HEIGHT - 30) {
        drawLeftDivider();
        drawPdfLeftBadge(doc, labels.interests, currentY, theme);
        currentY += 6.5;

        doc.setFont(PDF_FONT_NAME, 'normal');
        doc.setFontSize(scalePdfFont(9.4));
        visibleInterests.forEach((interest) => {
            const interestLines = getWrappedLines(doc, interest, 44, 2);

            if (!interestLines.length || currentY > PAGE_HEIGHT - 8) {
                return;
            }

            doc.setFont(PDF_FONT_BOLD_NAME, 'bold');
            doc.text('•', 9, currentY);
            doc.setFont(PDF_FONT_NAME, 'normal');
            currentY = drawTextLines(doc, interestLines, 12.2, currentY, scalePdfLineHeight(4.1));
            currentY += 1;
        });
    }
};

const drawPdfRightColumn = (
    doc,
    cvData,
    theme = REFERENCE_THEME,
    labels = getCvTemplate(REFERENCE_TEMPLATE_ID).labels,
) => {
    const visibleExperiences = cvData.experiences
        .map((experience) => ({
            ...experience,
            bullets: experience.bullets.map(trimValue).filter(Boolean).slice(0, MAX_BULLETS),
        }))
        .filter(
            (experience) =>
                trimValue(experience.position) ||
                trimValue(experience.company) ||
                trimValue(experience.start) ||
                trimValue(experience.end) ||
                experience.bullets.length,
        )
        .slice(0, MAX_EXPERIENCES);
    const hasObjective = Boolean(trimValue(cvData.objective));

    let currentY = 18;
    const startRightSection = (label) => {
        if (currentY > 18) {
            currentY += 2;
        }

        drawSectionHeader(doc, label, currentY, theme);
        currentY += 6;
    };

    if (hasObjective) {
        startRightSection(labels.objective);
        doc.setFont(PDF_FONT_NAME, 'normal');
        doc.setFontSize(scalePdfFont(9.5));
        const objectiveLines = getWrappedLines(doc, cvData.objective, RIGHT_CONTENT_WIDTH, 8);
        currentY = drawTextLines(doc, objectiveLines, RIGHT_COLUMN_X, currentY, scalePdfLineHeight(4.35));
    }

    if (visibleExperiences.length > 0) {
        startRightSection(labels.experience);
    }

    visibleExperiences.forEach((experience) => {
        const hasPeriod = trimValue(experience.start) || trimValue(experience.end);
        const primaryTitle = trimValue(experience.company) || trimValue(experience.position) || 'Project / Role';
        const secondaryTitle =
            trimValue(experience.company) && trimValue(experience.position) ? trimValue(experience.position) : '';
        const roleLines = getWrappedLines(doc, primaryTitle, 82, 2);

        doc.setFont(PDF_FONT_BOLD_NAME, 'bold');
        doc.setFontSize(scalePdfFont(10.2));
        const roleEndY = drawTextLines(doc, roleLines, RIGHT_COLUMN_X, currentY, scalePdfLineHeight(4.3));

        if (hasPeriod) {
            doc.text(formatPeriod(experience.start, experience.end), PAGE_WIDTH - 8, currentY, { align: 'right' });
        }

        currentY = roleEndY;

        if (secondaryTitle) {
            doc.setFont(PDF_FONT_BOLD_NAME, 'bold');
            doc.setFontSize(scalePdfFont(9.7));
            const secondaryLines = getWrappedLines(doc, secondaryTitle, RIGHT_CONTENT_WIDTH, 2);
            currentY = drawTextLines(doc, secondaryLines, RIGHT_COLUMN_X, currentY + 0.3, scalePdfLineHeight(4.05));
        }

        if (experience.bullets.length > 0) {
            doc.setFont(PDF_FONT_NAME, 'normal');
            doc.setFontSize(scalePdfFont(9.5));
            currentY = drawBulletList(doc, experience.bullets, RIGHT_COLUMN_X + 2, currentY + 1.5, 126, 2);
        }

        currentY += 2.2;
    });
};

/* eslint-enable no-unused-vars */
const drawPdfLeftColumnDynamic = async (doc, cvData, avatar, theme) => {
    const visibleContacts = CONTACT_FIELDS.filter(({ key }) => trimValue(cvData.contacts[key]));
    const visibleSkills = cvData.skills.map(trimValue).filter(Boolean).slice(0, MAX_SKILLS);
    const visibleInterests = cvData.interests.map(trimValue).filter(Boolean).slice(0, MAX_INTERESTS);
    const hasEducation = hasEducationData(cvData.education);
    const educationHighlights = buildEducationHighlights(cvData.education);
    const avatarCenterX = LEFT_COLUMN_WIDTH / 2;
    const avatarCenterY = 28;
    const outerRadius = 19;
    const innerRadius = 16.5;
    const avatarDataUrl = await createAvatarDataUrl(avatar, { size: 420, circular: true });

    doc.setFillColor(255, 255, 255);
    doc.circle(avatarCenterX, avatarCenterY, outerRadius, 'F');

    if (avatarDataUrl) {
        doc.addImage(
            avatarDataUrl,
            'PNG',
            avatarCenterX - innerRadius,
            avatarCenterY - innerRadius,
            innerRadius * 2,
            innerRadius * 2,
        );
    } else {
        doc.setFillColor(239, 241, 244);
        doc.circle(avatarCenterX, avatarCenterY, innerRadius, 'F');
        doc.setFillColor(174, 181, 191);
        doc.circle(avatarCenterX, avatarCenterY - 7.6, 6.4, 'F');
        doc.ellipse(avatarCenterX, avatarCenterY + 8, 11.8, 8.2, 'F');
    }

    doc.setTextColor(255, 255, 255);
    doc.setFont(PDF_FONT_BOLD_NAME, 'bold');
    doc.setFontSize(scalePdfFont(14.5));
    const nameLines = getWrappedLines(doc, trimValue(cvData.fullName) || 'Họ tên ứng viên', 46, 2);
    let currentY = drawTextLines(doc, nameLines, avatarCenterX, 58, scalePdfLineHeight(5.5), {
        align: 'center',
    });

    currentY = drawPdfDesiredRole(doc, cvData, avatarCenterX, currentY);

    doc.setDrawColor(255, 255, 255);
    doc.setLineWidth(0.2);
    currentY += 6;

    const drawLeftDivider = () => {
        doc.line(7, currentY, LEFT_COLUMN_WIDTH - 7, currentY);
        currentY += 6;
    };

    if (visibleContacts.length > 0) {
        drawLeftDivider();
        doc.setFont(PDF_FONT_NAME, 'normal');
        doc.setFontSize(scalePdfFont(9.3));

        visibleContacts.forEach(({ key }) => {
            const lines = getWrappedLines(doc, cvData.contacts[key], 44, 2);

            if (!lines.length) {
                return;
            }

            drawPdfContactIcon(doc, key, 9.4, currentY - 0.15, theme.colors.badge);
            currentY = drawTextLines(doc, lines, 14.2, currentY + 0.15, scalePdfLineHeight(4.15));
            currentY += 1.55;
        });
    }

    if (hasEducation && currentY < PAGE_HEIGHT - 42) {
        drawLeftDivider();
        setDocFillColor(doc, theme.colors.badge);
        doc.roundedRect(4.8, currentY - 4.8, 22.5, 7.6, 3.8, 3.8, 'F');
        doc.setFont(PDF_FONT_BOLD_NAME, 'bold');
        doc.setFontSize(scalePdfFont(10.2));
        doc.text('Học vấn', 7.7, currentY);
        currentY += 6.2;

        if (trimValue(cvData.education.major)) {
            doc.setFont(PDF_FONT_BOLD_NAME, 'bold');
            doc.setFontSize(scalePdfFont(9.5));
            const majorLines = getWrappedLines(doc, cvData.education.major, 44, 2);
            currentY = drawTextLines(doc, majorLines, 7.7, currentY, scalePdfLineHeight(4.15));
        }

        if (trimValue(cvData.education.start) || trimValue(cvData.education.end)) {
            doc.setFont(PDF_FONT_NAME, 'normal');
            doc.setFontSize(scalePdfFont(9.1));
            const periodLines = getWrappedLines(doc, formatPeriod(cvData.education.start, cvData.education.end), 44, 1);
            currentY = drawTextLines(doc, periodLines, 7.7, currentY + 0.4, scalePdfLineHeight(4));
        }

        if (trimValue(cvData.education.school)) {
            doc.setFont(PDF_FONT_NAME, 'normal');
            doc.setFontSize(scalePdfFont(8.95));
            const schoolLines = getWrappedLines(doc, cvData.education.school, 44, 2);
            currentY = drawTextLines(doc, schoolLines, 7.7, currentY + 0.35, scalePdfLineHeight(4));
        }

        educationHighlights.forEach((item) => {
            if (currentY > PAGE_HEIGHT - 12) {
                return;
            }

            const bulletLines = getWrappedLines(doc, item, 39.5, 2);
            if (!bulletLines.length) {
                return;
            }

            doc.setFont(PDF_FONT_BOLD_NAME, 'bold');
            doc.setFontSize(scalePdfFont(9));
            doc.text('•', 9, currentY + 0.8);
            doc.setFont(PDF_FONT_NAME, 'normal');
            doc.setFontSize(scalePdfFont(8.95));
            currentY = drawTextLines(doc, bulletLines, 12.2, currentY + 0.8, scalePdfLineHeight(3.95));
            currentY += 0.6;
        });
    }

    if (visibleSkills.length > 0) {
        drawLeftDivider();
        setDocFillColor(doc, theme.colors.badge);
        doc.roundedRect(4.8, currentY - 4.8, 20, 7.6, 3.8, 3.8, 'F');
        doc.setFont(PDF_FONT_BOLD_NAME, 'bold');
        doc.setFontSize(scalePdfFont(10.5));
        doc.text('Kỹ năng', 7.7, currentY);
        currentY += 6.5;

        doc.setFont(PDF_FONT_NAME, 'normal');
        doc.setFontSize(scalePdfFont(9.5));
        visibleSkills.forEach((skill) => {
            const skillLines = getWrappedLines(doc, skill, 44, 2);

            if (!skillLines.length || currentY > PAGE_HEIGHT - 8) {
                return;
            }

            doc.setFont(PDF_FONT_BOLD_NAME, 'bold');
            doc.text('•', 9, currentY);
            doc.setFont(PDF_FONT_NAME, 'normal');
            currentY = drawTextLines(doc, skillLines, 12.2, currentY, scalePdfLineHeight(4.1));
            currentY += 1;
        });
    }

    if (visibleInterests.length > 0 && currentY < PAGE_HEIGHT - 30) {
        drawLeftDivider();
        setDocFillColor(doc, theme.colors.badge);
        doc.roundedRect(4.8, currentY - 4.8, 21, 7.6, 3.8, 3.8, 'F');
        doc.setFont(PDF_FONT_BOLD_NAME, 'bold');
        doc.setFontSize(scalePdfFont(10.2));
        doc.text('Sở thích', 7.7, currentY);
        currentY += 6.5;

        doc.setFont(PDF_FONT_NAME, 'normal');
        doc.setFontSize(scalePdfFont(9.4));
        visibleInterests.forEach((interest) => {
            const interestLines = getWrappedLines(doc, interest, 44, 2);

            if (!interestLines.length || currentY > PAGE_HEIGHT - 8) {
                return;
            }

            doc.setFont(PDF_FONT_BOLD_NAME, 'bold');
            doc.text('•', 9, currentY);
            doc.setFont(PDF_FONT_NAME, 'normal');
            currentY = drawTextLines(doc, interestLines, 12.2, currentY, scalePdfLineHeight(4.1));
            currentY += 1;
        });
    }
};

const drawPdfRightColumnDynamic = (doc, cvData, theme) => {
    const visibleExperiences = cvData.experiences
        .map((experience) => ({
            ...experience,
            bullets: experience.bullets.map(trimValue).filter(Boolean).slice(0, MAX_BULLETS),
        }))
        .filter(
            (experience) =>
                trimValue(experience.position) ||
                trimValue(experience.company) ||
                trimValue(experience.start) ||
                trimValue(experience.end) ||
                experience.bullets.length,
        )
        .slice(0, MAX_EXPERIENCES);
    const hasObjective = Boolean(trimValue(cvData.objective));
    const showEducationInRightColumn = false;

    let currentY = 18;
    const startSection = (label) => {
        if (currentY > 18) {
            currentY += 2;
        }

        drawSectionHeader(doc, label, currentY, theme);
        currentY += 6;
    };

    if (hasObjective) {
        startSection('Mục tiêu nghề nghiệp');
        doc.setFont(PDF_FONT_NAME, 'normal');
        doc.setFontSize(scalePdfFont(9.5));
        const objectiveLines = getWrappedLines(doc, cvData.objective, RIGHT_CONTENT_WIDTH, 8);
        currentY = drawTextLines(doc, objectiveLines, RIGHT_COLUMN_X, currentY, scalePdfLineHeight(4.35));
    }

    if (visibleExperiences.length > 0) {
        startSection('Kinh nghiệm làm việc');
        visibleExperiences.forEach((experience) => {
            const roleLines = getWrappedLines(doc, trimValue(experience.position) || 'Vị trí công việc', 82, 2);
            const hasPeriod = trimValue(experience.start) || trimValue(experience.end);

            doc.setFont(PDF_FONT_BOLD_NAME, 'bold');
            doc.setFontSize(scalePdfFont(10.2));
            const roleEndY = drawTextLines(doc, roleLines, RIGHT_COLUMN_X, currentY, scalePdfLineHeight(4.3));

            if (hasPeriod) {
                doc.text(formatPeriod(experience.start, experience.end), PAGE_WIDTH - 8, currentY, { align: 'right' });
            }

            currentY = roleEndY;

            if (trimValue(experience.company)) {
                doc.setFont(PDF_FONT_NAME, 'normal');
                doc.setFontSize(scalePdfFont(9.5));
                const companyLines = getWrappedLines(doc, experience.company, RIGHT_CONTENT_WIDTH, 2);
                currentY = drawTextLines(doc, companyLines, RIGHT_COLUMN_X, currentY, scalePdfLineHeight(4.1));
            }

            if (experience.bullets.length > 0) {
                doc.setFont(PDF_FONT_NAME, 'normal');
                doc.setFontSize(scalePdfFont(9.5));
                currentY = drawBulletList(doc, experience.bullets, RIGHT_COLUMN_X + 2, currentY + 1.5, 126, 2);
            }

            currentY += 2.2;
        });
    }

    if (showEducationInRightColumn) {
        startSection('Học vấn');

        if (trimValue(cvData.education.major)) {
            doc.setFont(PDF_FONT_NAME, 'normal');
            doc.setFontSize(scalePdfFont(9.3));
            const majorLines = getWrappedLines(doc, cvData.education.major, RIGHT_CONTENT_WIDTH, 2);
            currentY = drawTextLines(doc, majorLines, RIGHT_COLUMN_X, currentY, scalePdfLineHeight(4.2));
        }

        if (trimValue(cvData.education.start) || trimValue(cvData.education.end)) {
            doc.setFont(PDF_FONT_BOLD_NAME, 'bold');
            doc.setFontSize(scalePdfFont(9.4));
            doc.text(formatPeriod(cvData.education.start, cvData.education.end), RIGHT_COLUMN_X, currentY + 1);
            currentY += 5.8;
        }

        if (trimValue(cvData.education.school)) {
            doc.setFont(PDF_FONT_BOLD_NAME, 'bold');
            doc.setFontSize(scalePdfFont(10.2));
            const schoolLines = getWrappedLines(doc, cvData.education.school, RIGHT_CONTENT_WIDTH, 2);
            currentY = drawTextLines(doc, schoolLines, RIGHT_COLUMN_X, currentY, scalePdfLineHeight(4.3));
        }

        const educationBullets = [];

        if (trimValue(cvData.education.gpa)) {
            educationBullets.push(`GPA: ${cvData.education.gpa}`);
        }

        if (trimValue(cvData.education.thesis)) {
            educationBullets.push(`Đồ án tốt nghiệp: ${cvData.education.thesis}`);
        }

        if (educationBullets.length > 0) {
            doc.setFont(PDF_FONT_NAME, 'normal');
            doc.setFontSize(scalePdfFont(9.4));
            drawBulletList(doc, educationBullets, RIGHT_COLUMN_X + 2, currentY + 2, 126, 2);
        }
    }
};

const exportPreviewElementToPdf = async (element, fileName) => {
    if (!element) {
        throw new Error('Không tìm thấy preview để xuất PDF.');
    }

    const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#f7efe6',
        logging: false,
    });

    const imageData = canvas.toDataURL('image/png');
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
    });

    doc.addImage(imageData, 'PNG', 0, 0, PAGE_WIDTH, PAGE_HEIGHT, undefined, 'FAST');
    doc.save(`${fileName}.pdf`);
};

const exportCvToPdf = async (cvData, avatar, previewElement) => {
    const template = getCvTemplate(cvData.templateId);
    const theme = getEffectiveTheme(cvData);

    if (template.pdfVariant === 'designer') {
        await exportPreviewElementToPdf(previewElement, buildResumeTitle(cvData));
        return;
    }

    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
    });

    await ensurePdfFonts(doc);
    drawPdfBackground(doc, theme);

    if (template.pdfVariant === 'reference') {
        await drawPdfLeftColumn(doc, cvData, avatar, theme, template.labels);
        drawPdfRightColumn(doc, cvData, theme, template.labels);
    } else {
        await drawPdfLeftColumnDynamic(doc, cvData, avatar, theme);
        drawPdfRightColumnDynamic(doc, cvData, theme);
    }

    doc.save(`${buildResumeTitle(cvData)}.pdf`);
};

/* eslint-disable no-unused-vars */
function CVPreview({ cvData, avatar, compact = false, articleRef = null }) {
    const theme = REFERENCE_THEME;
    const labels = getCvTemplate(REFERENCE_TEMPLATE_ID).labels;
    const educationHighlights = buildEducationHighlights(cvData.education);
    const desiredRoleText = buildDesiredRoleHeadline(cvData) || 'Desired Role';
    const visibleContacts = CONTACT_FIELDS.filter(({ key }) => trimValue(cvData.contacts[key]));
    const visibleSkills = cvData.skills.map(trimValue).filter(Boolean).slice(0, MAX_SKILLS);
    const visibleInterests = cvData.interests.map(trimValue).filter(Boolean).slice(0, MAX_INTERESTS);
    const visibleExperiences = cvData.experiences
        .map((experience) => ({
            ...experience,
            bullets: experience.bullets.map(trimValue).filter(Boolean).slice(0, MAX_BULLETS),
        }))
        .filter(
            (experience) =>
                trimValue(experience.position) ||
                trimValue(experience.company) ||
                trimValue(experience.start) ||
                trimValue(experience.end) ||
                experience.bullets.length,
        )
        .slice(0, MAX_EXPERIENCES);
    const hasEducation = hasEducationData(cvData.education);
    const isEducationPeriodEmpty = !trimValue(cvData.education.start) && !trimValue(cvData.education.end);

    return (
        <article
            ref={articleRef}
            className={`${styles.cvPage} ${styles.cvPageReference} ${compact ? styles.cvPageCompact : ''}`}
            style={getPreviewThemeStyle(theme)}
        >
            <aside className={styles.leftColumn}>
                <div className={styles.avatarFrame}>
                    <div
                        className={avatar ? styles.avatarPreview : styles.avatarPlaceholder}
                        style={avatar ? { backgroundImage: `url(${avatar})` } : undefined}
                    />
                </div>

                <div className={`${styles.identityBlock} ${styles.identityBlockReference}`}>
                    <h2>{trimValue(cvData.fullName) || 'Họ tên ứng viên'}</h2>
                    <div className={styles.referenceIdentityRole}>{desiredRoleText}</div>
                </div>

                <div className={styles.leftBlock}>
                    {visibleContacts.length > 0 ? (
                        <ul className={styles.contactList}>
                            {visibleContacts.map(({ key, Icon }) => (
                                <li className={styles.contactRow} key={key}>
                                    <span className={styles.contactIcon}>
                                        <Icon />
                                    </span>
                                    <span className={styles.contactValue}>{cvData.contacts[key]}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className={styles.leftPlaceholder}>
                            Điền số điện thoại, email, ngày sinh và địa chỉ để cột trái khớp form mẫu.
                        </p>
                    )}
                </div>

                <div className={styles.leftBlock}>
                    <div className={styles.leftBadge}>{labels.education}</div>
                    {hasEducation ? (
                        <div className={styles.educationAside}>
                            {trimValue(cvData.education.major) && (
                                <div className={styles.educationAsideMajor}>{cvData.education.major}</div>
                            )}

                            <div
                                className={`${styles.educationAsidePeriod} ${
                                    isEducationPeriodEmpty ? styles.periodPlaceholder : ''
                                }`}
                            >
                                {formatPeriod(cvData.education.start, cvData.education.end)}
                            </div>

                            {trimValue(cvData.education.school) && (
                                <div className={styles.educationAsideSchool}>{cvData.education.school}</div>
                            )}

                            {educationHighlights.length > 0 && (
                                <ul className={styles.educationAsideList}>
                                    {educationHighlights.map((item, index) => (
                                        <li key={`education-highlight-${index}`}>{item}</li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ) : (
                        <p className={styles.leftPlaceholder}>
                            Điền trường, ngành, giai đoạn và GPA để phần học vấn nằm ngay giữa thông tin chung với kỹ
                            năng.
                        </p>
                    )}
                </div>

                <div className={styles.leftBlock}>
                    <div className={styles.leftBadge}>{labels.skills}</div>
                    {visibleSkills.length > 0 ? (
                        <ul className={styles.skillList}>
                            {visibleSkills.map((skill, index) => (
                                <li key={`preview-skill-${index}`}>{skill}</li>
                            ))}
                        </ul>
                    ) : (
                        <p className={styles.leftPlaceholder}>
                            Thêm các kỹ năng chính như Python, React, SQL, Docker...
                        </p>
                    )}
                </div>

                {visibleInterests.length > 0 && (
                    <div className={styles.leftBlock}>
                        <div className={styles.leftBadge}>{labels.interests}</div>
                        <ul className={styles.interestList}>
                            {visibleInterests.map((interest, index) => (
                                <li key={`preview-interest-${index}`}>{interest}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </aside>

            <section className={styles.rightColumn}>
                <div className={styles.rightContent}>
                    <div className={styles.sectionBlock}>
                        <div className={styles.sectionHeader}>
                            <div className={styles.sectionLabel}>{labels.objective}</div>
                            <div className={styles.sectionLine} />
                        </div>

                        <div className={styles.sectionBody}>
                            {trimValue(cvData.objective) ? (
                                <p className={styles.objectiveText}>{cvData.objective}</p>
                            ) : (
                                <p className={styles.placeholderText}>
                                    Nhập mục tiêu nghề nghiệp để phần mở đầu hiển thị giống mẫu.
                                </p>
                            )}
                        </div>
                    </div>

                    <div className={styles.sectionBlock}>
                        <div className={styles.sectionHeader}>
                            <div className={styles.sectionLabel}>{labels.experience}</div>
                            <div className={styles.sectionLine} />
                        </div>

                        <div className={styles.sectionBody}>
                            {visibleExperiences.length > 0 ? (
                                <div className={styles.experienceList}>
                                    {visibleExperiences.map((experience) => {
                                        const hasPeriod = trimValue(experience.start) || trimValue(experience.end);
                                        const primaryTitle =
                                            trimValue(experience.company) ||
                                            trimValue(experience.position) ||
                                            'Project / Role';
                                        const secondaryTitle =
                                            trimValue(experience.company) && trimValue(experience.position)
                                                ? experience.position
                                                : '';

                                        return (
                                            <div className={styles.experienceItem} key={experience.id}>
                                                <div className={styles.roleRow}>
                                                    <span className={styles.roleTitle}>{primaryTitle}</span>
                                                    {hasPeriod ? (
                                                        <span className={styles.periodText}>
                                                            {formatPeriod(experience.start, experience.end)}
                                                        </span>
                                                    ) : null}
                                                </div>

                                                {secondaryTitle ? (
                                                    <div className={styles.referenceExperienceTitle}>
                                                        {secondaryTitle}
                                                    </div>
                                                ) : null}

                                                {experience.bullets.length > 0 && (
                                                    <ul className={styles.bulletList}>
                                                        {experience.bullets.map((bullet, bulletIndex) => (
                                                            <li key={`${experience.id}-${bulletIndex}`}>{bullet}</li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className={styles.placeholderText}>
                                    Thêm tối đa 3 kinh nghiệm để giữ đúng khung CV cố định.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </article>
    );
}

/* eslint-enable no-unused-vars */
function CVPreviewDynamic({ cvData, avatar, compact = false, articleRef = null }) {
    const theme = getEffectiveTheme(cvData);
    const desiredRoleItems = getDesiredRolePreviewItems(cvData);
    const educationHighlights = buildEducationHighlights(cvData.education);
    const visibleContacts = CONTACT_FIELDS.filter(({ key }) => trimValue(cvData.contacts[key]));
    const visibleSkills = cvData.skills.map(trimValue).filter(Boolean).slice(0, MAX_SKILLS);
    const visibleInterests = cvData.interests.map(trimValue).filter(Boolean).slice(0, MAX_INTERESTS);
    const visibleExperiences = cvData.experiences
        .map((experience) => ({
            ...experience,
            bullets: experience.bullets.map(trimValue).filter(Boolean).slice(0, MAX_BULLETS),
        }))
        .filter(
            (experience) =>
                trimValue(experience.position) ||
                trimValue(experience.company) ||
                trimValue(experience.start) ||
                trimValue(experience.end) ||
                experience.bullets.length,
        )
        .slice(0, MAX_EXPERIENCES);
    const hasObjective = Boolean(trimValue(cvData.objective));
    const hasEducation = hasEducationData(cvData.education);
    const showEducationInRightColumn = false;
    const isEducationPeriodEmpty = !trimValue(cvData.education.start) && !trimValue(cvData.education.end);

    return (
        <article
            ref={articleRef}
            className={`${styles.cvPage} ${compact ? styles.cvPageCompact : ''}`}
            style={getPreviewThemeStyle(theme)}
        >
            <aside className={styles.leftColumn}>
                <div className={styles.avatarFrame}>
                    <div
                        className={avatar ? styles.avatarPreview : styles.avatarPlaceholder}
                        style={avatar ? { backgroundImage: `url(${avatar})` } : undefined}
                    />
                </div>

                <div className={styles.identityBlock}>
                    <h2>{trimValue(cvData.fullName) || 'Họ tên ứng viên'}</h2>
                    <div className={styles.identityRole}>
                        {desiredRoleItems.map((item) => (
                            <span
                                className={item.kind === 'level' ? styles.identityLevel : styles.identityPosition}
                                key={item.key}
                            >
                                {item.text}
                            </span>
                        ))}
                    </div>
                </div>

                {visibleContacts.length > 0 ? (
                    <div className={styles.leftBlock}>
                        <ul className={styles.contactList}>
                            {visibleContacts.map(({ key, Icon }) => (
                                <li className={styles.contactRow} key={key}>
                                    <span className={styles.contactIcon}>
                                        <Icon />
                                    </span>
                                    <span className={styles.contactValue}>{cvData.contacts[key]}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : null}

                {hasEducation ? (
                    <div className={styles.leftBlock}>
                        <div className={styles.leftBadge}>Học vấn</div>
                        <div className={styles.educationAside}>
                            {trimValue(cvData.education.major) ? (
                                <div className={styles.educationAsideMajor}>{cvData.education.major}</div>
                            ) : null}

                            <div
                                className={`${styles.educationAsidePeriod} ${
                                    isEducationPeriodEmpty ? styles.periodPlaceholder : ''
                                }`}
                            >
                                {formatPeriod(cvData.education.start, cvData.education.end)}
                            </div>

                            {trimValue(cvData.education.school) ? (
                                <div className={styles.educationAsideSchool}>{cvData.education.school}</div>
                            ) : null}

                            {educationHighlights.length > 0 ? (
                                <ul className={styles.educationAsideList}>
                                    {educationHighlights.map((item, index) => (
                                        <li key={`dynamic-education-highlight-${index}`}>{item}</li>
                                    ))}
                                </ul>
                            ) : null}
                        </div>
                    </div>
                ) : null}

                {visibleSkills.length > 0 ? (
                    <div className={styles.leftBlock}>
                        <div className={styles.leftBadge}>Kỹ năng</div>
                        <ul className={styles.skillList}>
                            {visibleSkills.map((skill, index) => (
                                <li key={`dynamic-preview-skill-${index}`}>{skill}</li>
                            ))}
                        </ul>
                    </div>
                ) : null}

                {visibleInterests.length > 0 ? (
                    <div className={styles.leftBlock}>
                        <div className={styles.leftBadge}>Sở thích</div>
                        <ul className={styles.interestList}>
                            {visibleInterests.map((interest, index) => (
                                <li key={`dynamic-preview-interest-${index}`}>{interest}</li>
                            ))}
                        </ul>
                    </div>
                ) : null}
            </aside>

            <section className={styles.rightColumn}>
                <div className={styles.rightContent}>
                    {hasObjective ? (
                        <div className={styles.sectionBlock}>
                            <div className={styles.sectionHeader}>
                                <div className={styles.sectionLabel}>Mục tiêu nghề nghiệp</div>
                                <div className={styles.sectionLine} />
                            </div>

                            <div className={styles.sectionBody}>
                                <p className={styles.objectiveText}>{cvData.objective}</p>
                            </div>
                        </div>
                    ) : null}

                    {visibleExperiences.length > 0 ? (
                        <div className={styles.sectionBlock}>
                            <div className={styles.sectionHeader}>
                                <div className={styles.sectionLabel}>Kinh nghiệm làm việc</div>
                                <div className={styles.sectionLine} />
                            </div>

                            <div className={styles.sectionBody}>
                                <div className={styles.experienceList}>
                                    {visibleExperiences.map((experience) => {
                                        const hasPeriod = trimValue(experience.start) || trimValue(experience.end);

                                        return (
                                            <div className={styles.experienceItem} key={experience.id}>
                                                <div className={styles.roleRow}>
                                                    <span className={styles.roleTitle}>
                                                        {trimValue(experience.position) || 'Vị trí công việc'}
                                                    </span>
                                                    {hasPeriod ? (
                                                        <span className={styles.periodText}>
                                                            {formatPeriod(experience.start, experience.end)}
                                                        </span>
                                                    ) : null}
                                                </div>

                                                {trimValue(experience.company) ? (
                                                    <div className={styles.companyText}>{experience.company}</div>
                                                ) : null}

                                                {experience.bullets.length > 0 ? (
                                                    <ul className={styles.bulletList}>
                                                        {experience.bullets.map((bullet, bulletIndex) => (
                                                            <li key={`${experience.id}-${bulletIndex}`}>{bullet}</li>
                                                        ))}
                                                    </ul>
                                                ) : null}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    ) : null}

                    {showEducationInRightColumn ? (
                        <div className={styles.sectionBlock}>
                            <div className={styles.sectionHeader}>
                                <div className={styles.sectionLabel}>Học vấn</div>
                                <div className={styles.sectionLine} />
                            </div>

                            <div className={styles.sectionBody}>
                                {trimValue(cvData.education.major) ? (
                                    <div className={styles.educationIntro}>{cvData.education.major}</div>
                                ) : null}

                                {trimValue(cvData.education.start) || trimValue(cvData.education.end) ? (
                                    <div className={styles.educationPeriod}>
                                        {formatPeriod(cvData.education.start, cvData.education.end)}
                                    </div>
                                ) : null}

                                {trimValue(cvData.education.school) ? (
                                    <div className={styles.educationSchool}>{cvData.education.school}</div>
                                ) : null}

                                {trimValue(cvData.education.gpa) || trimValue(cvData.education.thesis) ? (
                                    <ul className={styles.educationList}>
                                        {trimValue(cvData.education.gpa) ? <li>GPA: {cvData.education.gpa}</li> : null}
                                        {trimValue(cvData.education.thesis) ? (
                                            <li>Đồ án tốt nghiệp: {cvData.education.thesis}</li>
                                        ) : null}
                                    </ul>
                                ) : null}
                            </div>
                        </div>
                    ) : null}
                </div>
            </section>
        </article>
    );
}

function CVPreviewDesigner({ cvData, avatar, compact = false, articleRef = null }) {
    const theme = getEffectiveTheme(cvData);
    const desiredRoleItems = getDesiredRolePreviewItems(cvData);
    const designerRoleText = desiredRoleItems.map((item) => item.text).join(' ').trim();
    const visibleContacts = getDesignerVisibleContacts(cvData.contacts);
    const visibleSkills = cvData.skills.map(trimValue).filter(Boolean).slice(0, DESIGNER_MAX_SKILLS);
    const visibleInterests = cvData.interests.map(trimValue).filter(Boolean).slice(0, DESIGNER_MAX_INTERESTS);
    const visibleExperiences = cvData.experiences
        .map((experience) => ({
            ...experience,
            bullets: experience.bullets.map(trimValue).filter(Boolean).slice(0, DESIGNER_MAX_BULLETS),
        }))
        .filter(
            (experience) =>
                trimValue(experience.position) ||
                trimValue(experience.company) ||
                trimValue(experience.start) ||
                trimValue(experience.end) ||
                experience.bullets.length,
        )
        .slice(0, DESIGNER_MAX_EXPERIENCES);
    const visibleAwards = getVisibleMetaItems(cvData.awards, MAX_AWARDS);
    const visibleCertifications = getVisibleMetaItems(cvData.certifications, MAX_CERTIFICATIONS);
    const educationHighlights = buildEducationHighlights(cvData.education);
    const educationPeriod = formatPeriod(cvData.education.start, cvData.education.end, '');
    const hasEducation = hasEducationData(cvData.education);
    const hasAwardsSection = Array.isArray(cvData.awards) && cvData.awards.length > 0;
    const hasCertificationsSection = Array.isArray(cvData.certifications) && cvData.certifications.length > 0;
    const designerContacts = visibleContacts.length > 0 ? visibleContacts : DESIGNER_PLACEHOLDER_CONTACTS;
    const designerFooterSections = [
        {
            key: 'education',
            title: 'Học vấn',
            content: hasEducation ? (
                <div className={styles.designerFooterEntry}>
                    {trimValue(cvData.education.major) ? (
                        <div className={styles.designerFooterTitle}>{cvData.education.major}</div>
                    ) : null}
                    {trimValue(cvData.education.school) ? (
                        <div className={styles.designerFooterSubtitle}>{cvData.education.school}</div>
                    ) : null}
                    {educationPeriod ? <div className={styles.designerFooterDate}>{educationPeriod}</div> : null}
                    {educationHighlights.length > 0 ? (
                        <div className={styles.designerFooterNotes}>
                            {educationHighlights.map((item, index) => (
                                <div className={styles.designerFooterNote} key={`designer-education-note-${index}`}>
                                    {item}
                                </div>
                            ))}
                        </div>
                    ) : null}
                </div>
            ) : (
                <p className={styles.designerPlaceholder}>
                    Điền trường, ngành và thời gian học để khối này giống mẫu.
                </p>
            ),
        },
    ];

    if (hasAwardsSection) {
        designerFooterSections.push({
            key: 'awards',
            title: 'Danh hiệu và giải thưởng',
            content:
                visibleAwards.length > 0 ? (
                    visibleAwards.map((item) => (
                        <div className={styles.designerFooterEntry} key={item.id}>
                            {item.date ? <div className={styles.designerFooterDate}>{item.date}</div> : null}
                            <div className={styles.designerFooterTitle}>{item.title || 'Tên giải thưởng'}</div>
                        </div>
                    ))
                ) : (
                    <p className={styles.designerPlaceholder}>
                        Thêm giải thưởng hoặc học bổng để hiển thị cột này.
                    </p>
                ),
        });
    }

    if (hasCertificationsSection) {
        designerFooterSections.push({
            key: 'certifications',
            title: 'Chứng chỉ',
            content:
                visibleCertifications.length > 0 ? (
                    visibleCertifications.map((item) => (
                        <div className={styles.designerFooterEntry} key={item.id}>
                            {item.date ? <div className={styles.designerFooterDate}>{item.date}</div> : null}
                            <div className={styles.designerFooterTitle}>{item.title || 'Tên chứng chỉ'}</div>
                        </div>
                    ))
                ) : (
                    <p className={styles.designerPlaceholder}>
                        Thêm chứng chỉ chuyên môn để hoàn thiện bố cục mẫu.
                    </p>
                ),
        });
    }

    if (visibleSkills.length > 0) {
        designerFooterSections.push({
            key: 'skills',
            title: 'Kỹ năng',
            content: (
                <ul className={styles.designerFooterList}>
                    {visibleSkills.map((skill, index) => (
                        <li key={`designer-skill-${index}`}>{skill}</li>
                    ))}
                </ul>
            ),
        });
    }

    if (visibleInterests.length > 0) {
        designerFooterSections.push({
            key: 'interests',
            title: 'Sở thích',
            content: (
                <ul className={styles.designerFooterList}>
                    {visibleInterests.map((interest, index) => (
                        <li key={`designer-interest-${index}`}>{interest}</li>
                    ))}
                </ul>
            ),
        });
    }

    const designerContactGridStyle = {
        gridTemplateColumns: `repeat(${Math.min(designerContacts.length, CONTACT_FIELDS.length)}, minmax(0, 1fr))`,
    };

    const designerFooterGridStyle = {
        gridTemplateColumns: `repeat(${Math.min(designerFooterSections.length, 3)}, minmax(0, 1fr))`,
    };

    return (
        <article
            ref={articleRef}
            className={`${styles.cvPage} ${styles.cvPageDesigner} ${compact ? styles.cvPageCompact : ''}`}
            style={getPreviewThemeStyle(theme)}
        >
            <div className={styles.designerContactStrip} style={designerContactGridStyle}>
                {designerContacts.map((item) => (
                    <div className={styles.designerContactItem} key={item.key}>
                        <span className={styles.designerContactDot} />
                        <span>{item.value}</span>
                    </div>
                ))}
            </div>

            <div className={styles.designerHero}>
                <div className={styles.designerHeroText}>
                    <h2>{trimValue(cvData.fullName) || 'Nguyễn Văn A'}</h2>
                    <div className={styles.designerHeroRole}>
                        <span className={styles.designerHeroRoleText}>{designerRoleText || 'Designer'}</span>
                        <span className={styles.designerHeroRule} />
                    </div>
                    <p className={styles.designerHeroSummary}>
                        {trimValue(cvData.objective) ||
                            'Mô tả ngắn gọn về định hướng nghề nghiệp, điểm mạnh và mục tiêu phát triển để phần mở đầu giống bố cục của mẫu CV này.'}
                    </p>
                </div>

                <div className={styles.designerPhotoFrame}>
                    <div
                        className={avatar ? styles.designerPhoto : styles.designerPhotoPlaceholder}
                        style={avatar ? { backgroundImage: `url(${avatar})` } : undefined}
                    />
                </div>
            </div>

            <div className={styles.designerBody}>
                <div className={styles.designerSectionHeader}>
                    <div className={styles.designerSectionBadge}>Kinh nghiệm làm việc</div>
                    <div className={styles.designerSectionDivider} />
                </div>

                <div className={styles.designerExperienceList}>
                    {visibleExperiences.length > 0 ? (
                        visibleExperiences.map((experience) => (
                            <div className={styles.designerExperienceItem} key={experience.id}>
                                <div className={styles.designerTimelineMeta}>
                                    <div className={styles.designerTimelineDate}>
                                        {formatPeriod(experience.start, experience.end, 'Thời gian')}
                                    </div>
                                    <div className={styles.designerTimelineCompany}>
                                        {trimValue(experience.company) || 'Tên công ty'}
                                    </div>
                                </div>

                                <div className={styles.designerExperienceContent}>
                                    <div className={styles.designerExperienceTitle}>
                                        {trimValue(experience.position) || 'Vị trí công việc'}
                                    </div>
                                    {experience.bullets.length > 0 ? (
                                        <ul className={styles.designerExperienceBullets}>
                                            {experience.bullets.map((bullet, index) => (
                                                <li key={`${experience.id}-designer-${index}`}>{bullet}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className={styles.designerPlaceholder}>
                                            Thêm mô tả công việc hoặc thành tích để hiển thị như mẫu.
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className={styles.designerPlaceholder}>
                            Thêm kinh nghiệm làm việc để phần timeline hiển thị giống mẫu.
                        </p>
                    )}
                </div>

                <div className={styles.designerFooterGrid} style={designerFooterGridStyle}>
                    {designerFooterSections.map((section) => (
                        <div className={styles.designerFooterColumn} key={section.key}>
                            <div className={styles.designerFooterHeader}>{section.title}</div>
                            <div className={styles.designerFooterBody}>{section.content}</div>
                        </div>
                    ))}
                </div>
            </div>
        </article>
    );
}

function CVTemplatePreview({ cvData, avatar, compact = false, articleRef = null }) {
    const template = getCvTemplate(cvData?.templateId);

    if (template.previewVariant === 'reference') {
        return <CVPreview cvData={cvData} avatar={avatar} compact={compact} articleRef={articleRef} />;
    }

    if (template.previewVariant === 'designer') {
        return <CVPreviewDesigner cvData={cvData} avatar={avatar} compact={compact} articleRef={articleRef} />;
    }

    return <CVPreviewDynamic cvData={cvData} avatar={avatar} compact={compact} articleRef={articleRef} />;
}

function CVBuilder() {
    const { api, user } = useContext(AuthContext);
    const [cvData, setCvData] = useState(createEmptyCV);
    const [avatar, setAvatar] = useState('');
    const [savedResumes, setSavedResumes] = useState([]);
    const [selectedResumeId, setSelectedResumeId] = useState('');
    const [isExporting, setIsExporting] = useState(false);
    const [isSavingResume, setIsSavingResume] = useState(false);
    const [isDeletingResume, setIsDeletingResume] = useState(false);
    const [isLoadingResumes, setIsLoadingResumes] = useState(false);
    const avatarInputRef = useRef(null);
    const previewArticleRef = useRef(null);

    useEffect(() => {
        const fetchResumes = async () => {
            if (!user) {
                setSavedResumes([]);
                setSelectedResumeId('');
                return;
            }

            setIsLoadingResumes(true);

            try {
                const response = await api.get('resume');
                const normalizedResumes = Array.isArray(response.data) ? response.data.map(normalizeResumeRecord) : [];
                setSavedResumes(normalizedResumes);
            } catch (error) {
                console.error('Lỗi khi tải danh sách CV:', error);
            } finally {
                setIsLoadingResumes(false);
            }
        };

        fetchResumes();
    }, [api, user]);

    const updateRootField = (field, value) =>
        setCvData((prev) => {
            const nextData = { ...prev, [field]: value };

            if (field === 'desiredLevel' || field === 'desiredPosition') {
                return {
                    ...nextData,
                    headline: buildDesiredRoleHeadline(nextData),
                };
            }

            return nextData;
        });

    const updateNestedField = (section, field, value) =>
        setCvData((prev) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value,
            },
        }));

    const updateListItem = (field, index, value) =>
        setCvData((prev) => ({
            ...prev,
            [field]: prev[field].map((item, itemIndex) => (itemIndex === index ? value : item)),
        }));

    const addListItem = (field, defaultValue = '') =>
        setCvData((prev) => {
            if (prev[field].length >= (LIST_LIMITS[field] || MAX_SKILLS)) {
                return prev;
            }

            return {
                ...prev,
                [field]: [...prev[field], defaultValue],
            };
        });

    const removeListItem = (field, index) =>
        setCvData((prev) => {
            const nextItems = prev[field].filter((_, itemIndex) => itemIndex !== index);

            return {
                ...prev,
                [field]: nextItems.length ? nextItems : [''],
            };
        });

    const updateMetaItemField = (field, id, key, value) =>
        setCvData((prev) => ({
            ...prev,
            [field]: prev[field].map((item) => (item.id === id ? { ...item, [key]: value } : item)),
        }));

    const addMetaItem = (field, maxItems) =>
        setCvData((prev) => {
            if (prev[field].length >= maxItems) {
                return prev;
            }

            return {
                ...prev,
                [field]: [...prev[field], createEmptyMetaItem()],
            };
        });

    const clearMetaSection = (field) =>
        setCvData((prev) => ({
            ...prev,
            [field]: [],
        }));

    const removeMetaItem = (field, id) =>
        setCvData((prev) => {
            const nextItems = prev[field].filter((item) => item.id !== id);

            return {
                ...prev,
                [field]: nextItems,
            };
        });

    const updateExpField = (id, field, value) =>
        setCvData((prev) => ({
            ...prev,
            experiences: prev.experiences.map((experience) =>
                experience.id === id ? { ...experience, [field]: value } : experience,
            ),
        }));

    const updateExpBullet = (id, bulletIndex, value) =>
        setCvData((prev) => ({
            ...prev,
            experiences: prev.experiences.map((experience) =>
                experience.id === id
                    ? {
                          ...experience,
                          bullets: experience.bullets.map((bullet, index) => (index === bulletIndex ? value : bullet)),
                      }
                    : experience,
            ),
        }));

    const addExpBullet = (id) =>
        setCvData((prev) => ({
            ...prev,
            experiences: prev.experiences.map((experience) => {
                if (experience.id !== id || experience.bullets.length >= MAX_BULLETS) {
                    return experience;
                }

                return {
                    ...experience,
                    bullets: [...experience.bullets, ''],
                };
            }),
        }));

    const removeExpBullet = (id, bulletIndex) =>
        setCvData((prev) => ({
            ...prev,
            experiences: prev.experiences.map((experience) => {
                if (experience.id !== id) {
                    return experience;
                }

                const nextBullets = experience.bullets.filter((_, index) => index !== bulletIndex);

                return {
                    ...experience,
                    bullets: nextBullets.length ? nextBullets : [''],
                };
            }),
        }));

    const addExperience = () =>
        setCvData((prev) => {
            if (prev.experiences.length >= MAX_EXPERIENCES) {
                return prev;
            }

            return {
                ...prev,
                experiences: [...prev.experiences, createEmptyExperience()],
            };
        });

    const removeExperience = (id) =>
        setCvData((prev) => {
            const nextExperiences = prev.experiences.filter((experience) => experience.id !== id);

            return {
                ...prev,
                experiences: nextExperiences.length ? nextExperiences : [createEmptyExperience()],
            };
        });

    const handleCreateNewCv = () => {
        setSelectedResumeId('');
        setCvData(createEmptyCV());
        setAvatar('');

        if (avatarInputRef.current) {
            avatarInputRef.current.value = '';
        }
    };

    const handleReset = () => {
        handleCreateNewCv();
    };

    const handleAvatarChange = (event) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        const reader = new FileReader();
        reader.onload = (loadEvent) => setAvatar(loadEvent.target?.result || '');
        reader.readAsDataURL(file);
        event.target.value = '';
    };

    const handleLoadResume = (resume) => {
        const normalizedResume = normalizeResumeRecord(resume);
        setSelectedResumeId(normalizedResume.id);
        setCvData(normalizedResume.cv_data);
        setAvatar(normalizedResume.avatar_data || '');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleExportPDF = async () => {
        if (isExporting) {
            return;
        }

        setIsExporting(true);

        try {
            await exportCvToPdf(cvData, avatar, previewArticleRef.current);
        } catch (error) {
            console.error('Lỗi khi xuất PDF:', error);
            window.alert('Không thể tạo file PDF. Vui lòng thử lại.');
        } finally {
            setIsExporting(false);
        }
    };

    const handleSaveResume = async () => {
        if (!user) {
            window.alert('Vui lòng đăng nhập để lưu CV.');
            return;
        }

        if (isSavingResume) {
            return;
        }

        setIsSavingResume(true);

        try {
            const avatarData = avatar
                ? await createAvatarDataUrl(avatar, {
                      size: 240,
                      circular: true,
                      outputType: 'image/png',
                  })
                : '';

            const payload = {
                title: buildResumeTitle(cvData),
                template_type: getCvTemplate(cvData.templateId).id,
                cv_data: {
                    ...cvData,
                    templateId: getCvTemplate(cvData.templateId).id,
                    desiredLevel: trimValue(cvData.desiredLevel),
                    desiredPosition: trimValue(cvData.desiredPosition),
                    headline: buildDesiredRoleHeadline(cvData),
                    cvTitle: buildResumeTitle(cvData),
                },
                avatar_data: avatarData,
            };

            const response = selectedResumeId
                ? await api.put(`resume/${selectedResumeId}`, payload)
                : await api.post('resume', payload);

            const normalizedResume = normalizeResumeRecord(response.data);

            setSavedResumes((prev) => {
                const withoutCurrent = prev.filter((resume) => resume.id !== normalizedResume.id);
                return [normalizedResume, ...withoutCurrent];
            });
            setSelectedResumeId(normalizedResume.id);
            setCvData(normalizedResume.cv_data);
            setAvatar(normalizedResume.avatar_data || '');
            window.alert(selectedResumeId ? 'Cập nhật CV thành công.' : 'Lưu CV thành công.');
        } catch (error) {
            console.error('Lỗi khi lưu CV:', error);
            window.alert(error.response?.data?.message || 'Không thể lưu CV. Vui lòng thử lại.');
        } finally {
            setIsSavingResume(false);
        }
    };

    const handleDeleteResume = async () => {
        if (!selectedResumeId || isDeletingResume) {
            return;
        }

        const confirmed = window.confirm('Bạn có chắc muốn xóa CV đang chọn không?');

        if (!confirmed) {
            return;
        }

        setIsDeletingResume(true);

        try {
            await api.delete(`resume/${selectedResumeId}`);
            setSavedResumes((prev) => prev.filter((resume) => resume.id !== selectedResumeId));
            handleCreateNewCv();
            window.alert('Đã xóa CV.');
        } catch (error) {
            console.error('Lỗi khi xóa CV:', error);
            window.alert(error.response?.data?.message || 'Không thể xóa CV.');
        } finally {
            setIsDeletingResume(false);
        }
    };

    const selectedTemplate = getCvTemplate(cvData.templateId);
    const selectedTheme = getCvTheme(cvData.themeId);

    return (
        <div className={styles.builderShell}>
            <section className={styles.savedSection}>
                <div className={styles.savedHeader}>
                    <div>
                        <p className={styles.kicker}>Thư viện CV</p>
                        <h2>CV đã tạo trên JobConnect</h2>
                        <p className={styles.savedHint}>
                            CV được lưu lại giống kiểu TopCV: có preview, ngày cập nhật và có thể mở ra chỉnh sửa tiếp.
                        </p>
                    </div>

                </div>

                {isLoadingResumes ? (
                    <div className={styles.resumeEmpty}>Đang tải danh sách CV...</div>
                ) : savedResumes.length > 0 ? (
                    <div className={styles.resumeGrid}>
                        {savedResumes.map((resume) => (
                            <button
                                className={`${styles.resumeCard} ${
                                    selectedResumeId === resume.id ? styles.resumeCardActive : ''
                                }`}
                                type="button"
                                key={resume.id}
                                onClick={() => handleLoadResume(resume)}
                            >
                                <div className={styles.resumePreviewCanvas}>
                                    <div className={styles.resumePreviewScale}>
                                        <CVTemplatePreview cvData={resume.cv_data} avatar={resume.avatar_data} compact />
                                    </div>
                                </div>

                                <div className={styles.resumeMeta}>
                                    <h3>{resume.title}</h3>
                                    <p>
                                        {getCvTemplate(resume.cv_data?.templateId || resume.template_type).label}
                                        {' • '}
                                        Cập nhật {formatDisplayDate(resume.updated_at)}
                                    </p>
                                    {selectedResumeId === resume.id && (
                                        <span className={styles.resumeBadge}>Đang chỉnh sửa</span>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className={styles.resumeEmpty}>
                        {user
                            ? 'Bạn chưa lưu CV nào. Tạo CV mới rồi bấm Lưu CV để xuất hiện ở đây.'
                            : 'Đăng nhập để lưu CV vào hệ thống và quản lý lại sau.'}
                    </div>
                )}
            </section>

            <div className={styles.builderPage}>
                <section className={styles.editorPanel}>
                    <div className={styles.editorHeader}>
                        <div>
                            <p className={styles.kicker}>Trình tạo CV</p>
                            <h1>Bộ mẫu CV theo form OCR</h1>
                            <p className={styles.editorHint}>
                                Nhập dữ liệu ở bên trái, sau đó chọn template để preview bên phải đổi đúng layout A4
                                mà người dùng muốn dùng.
                            </p>
                        </div>

                        <div className={styles.editorActions}>
                            <button
                                className={styles.primaryButton}
                                type="button"
                                onClick={handleSaveResume}
                                disabled={isSavingResume}
                            >
                                {isSavingResume ? 'Đang lưu...' : selectedResumeId ? 'Cập nhật CV' : 'Lưu CV'}
                            </button>
                            <button
                                className={styles.secondaryButton}
                                type="button"
                                onClick={handleExportPDF}
                                disabled={isExporting}
                            >
                                {isExporting ? 'Đang tạo PDF...' : 'Lưu PDF'}
                            </button>
                            <button className={styles.secondaryButton} type="button" onClick={handleReset}>
                                Làm mới
                            </button>
                            {selectedResumeId && (
                                <button
                                    className={styles.removeButton}
                                    type="button"
                                    onClick={handleDeleteResume}
                                    disabled={isDeletingResume}
                                >
                                    {isDeletingResume ? 'Đang xóa...' : 'Xóa CV'}
                                </button>
                            )}
                        </div>
                    </div>

                    <div className={styles.templateNotice}>
                        <strong>Form này được khóa trong 1 trang A4.</strong> Để CV dễ nhận diện chữ hơn, mình giữ bố
                        cục cố định: tối đa {MAX_EXPERIENCES} kinh nghiệm, {MAX_BULLETS} gạch đầu dòng mỗi kinh nghiệm
                        và {MAX_SKILLS} kỹ năng ở cột trái.
                    </div>

                    <div className={styles.editorGrid}>
                        <div className={styles.editorCard}>
                            <h2>Thông tin cá nhân</h2>

                            <div className={styles.formGroup}>
                                <label>Tên CV</label>
                                <input
                                    maxLength={60}
                                    value={cvData.cvTitle}
                                    placeholder="VD: Kỹ sư mạng, CV thực tập SOC..."
                                    onChange={(event) => updateRootField('cvTitle', event.target.value)}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Họ và tên</label>
                                <input
                                    maxLength={48}
                                    value={cvData.fullName}
                                    placeholder="Trần Gia Khang"
                                    onChange={(event) => updateRootField('fullName', event.target.value)}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Trình độ</label>
                                <input
                                    maxLength={32}
                                    value={cvData.desiredLevel}
                                    placeholder="Intern, Fresher, Junior..."
                                    onChange={(event) => updateRootField('desiredLevel', event.target.value)}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Vị trí ứng tuyển</label>
                                <input
                                    maxLength={70}
                                    value={cvData.desiredPosition}
                                    placeholder="Frontend Developer"
                                    onChange={(event) => updateRootField('desiredPosition', event.target.value)}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Ảnh đại diện</label>
                                <div className={styles.avatarEditor}>
                                    <button
                                        className={styles.secondaryButton}
                                        type="button"
                                        onClick={() => avatarInputRef.current?.click()}
                                    >
                                        {avatar ? 'Đổi ảnh' : 'Thêm ảnh'}
                                    </button>
                                    <input
                                        ref={avatarInputRef}
                                        type="file"
                                        accept="image/*"
                                        hidden
                                        onChange={handleAvatarChange}
                                    />
                                    <span className={styles.editorSubtle}>
                                        CV có thể được lưu lại trong hệ thống và tải PDF riêng khi cần.
                                    </span>
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label>Mục tiêu nghề nghiệp</label>
                                <textarea
                                    rows={6}
                                    maxLength={900}
                                    value={cvData.objective}
                                    placeholder="Mô tả ngắn gọn định hướng nghề nghiệp của bạn..."
                                    onChange={(event) => updateRootField('objective', event.target.value)}
                                />
                            </div>
                        </div>

                        <div className={styles.editorCard}>
                            <h2>Học vấn</h2>

                            <div className={styles.formGroup}>
                                <label>Ngành học / Môn học</label>
                                <input
                                    maxLength={80}
                                    value={cvData.education.major}
                                    placeholder="Công nghệ thông tin"
                                    onChange={(event) => updateNestedField('education', 'major', event.target.value)}
                                />
                            </div>

                            <div className={styles.formGrid}>
                                <div className={styles.formGroup}>
                                    <label>Bắt đầu</label>
                                    <input
                                        maxLength={20}
                                        value={cvData.education.start}
                                        placeholder="2012"
                                        onChange={(event) =>
                                            updateNestedField('education', 'start', event.target.value)
                                        }
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Kết thúc</label>
                                    <input
                                        maxLength={20}
                                        value={cvData.education.end}
                                        placeholder="2016"
                                        onChange={(event) => updateNestedField('education', 'end', event.target.value)}
                                    />
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label>Trường</label>
                                <input
                                    maxLength={90}
                                    value={cvData.education.school}
                                    placeholder="Đại học Công nghệ - Đại học Quốc gia Hà Nội"
                                    onChange={(event) => updateNestedField('education', 'school', event.target.value)}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>GPA</label>
                                <input
                                    maxLength={20}
                                    value={cvData.education.gpa}
                                    placeholder="3.4/4.0"
                                    onChange={(event) => updateNestedField('education', 'gpa', event.target.value)}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Đồ án / Luận văn</label>
                                <textarea
                                    rows={3}
                                    maxLength={180}
                                    value={cvData.education.thesis}
                                    placeholder="Ứng dụng học sâu trong phân loại ảnh y tế..."
                                    onChange={(event) => updateNestedField('education', 'thesis', event.target.value)}
                                />
                            </div>
                        </div>

                        <div className={styles.editorCard}>
                            <div className={styles.cardTitleRow}>
                                <h2>Danh hiệu và giải thưởng</h2>
                                <div className={styles.cardActions}>
                                    {cvData.awards.length > 0 ? (
                                        <button
                                            className={styles.removeButton}
                                            type="button"
                                            onClick={() => clearMetaSection('awards')}
                                        >
                                            Xóa mục
                                        </button>
                                    ) : null}
                                    <button
                                        className={styles.inlineButton}
                                        type="button"
                                        onClick={() => addMetaItem('awards', MAX_AWARDS)}
                                        disabled={cvData.awards.length >= MAX_AWARDS}
                                    >
                                        + Thêm
                                    </button>
                                </div>
                            </div>

                            <div className={styles.projectEditorList}>
                                {cvData.awards.length === 0 ? (
                                    <p className={styles.editorSubtle}>
                                        Mục này đang ẩn khỏi CV. Bấm `+ Thêm` để hiện lại.
                                    </p>
                                ) : null}
                                {cvData.awards.map((item) => (
                                    <div className={styles.projectEditorCard} key={item.id}>
                                        <div className={styles.projectEditorHeader}>
                                            <h3>{trimValue(item.title) || 'Giải thưởng mới'}</h3>
                                            <button
                                                className={styles.removeButton}
                                                type="button"
                                                onClick={() => removeMetaItem('awards', item.id)}
                                            >
                                                Xóa
                                            </button>
                                        </div>

                                        <div className={styles.projectGrid}>
                                            <div className={styles.formGroup}>
                                                <label>Thời gian</label>
                                                <input
                                                    maxLength={24}
                                                    value={item.date}
                                                    placeholder="12/2023"
                                                    onChange={(event) =>
                                                        updateMetaItemField('awards', item.id, 'date', event.target.value)
                                                    }
                                                />
                                            </div>

                                            <div className={styles.formGroup}>
                                                <label>Tên giải thưởng</label>
                                                <input
                                                    maxLength={140}
                                                    value={item.title}
                                                    placeholder="Sinh viên 5 tốt / Học bổng / Giải cuộc thi..."
                                                    onChange={(event) =>
                                                        updateMetaItemField('awards', item.id, 'title', event.target.value)
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className={styles.editorCard}>
                            <div className={styles.cardTitleRow}>
                                <h2>Chứng chỉ</h2>
                                <div className={styles.cardActions}>
                                    {cvData.certifications.length > 0 ? (
                                        <button
                                            className={styles.removeButton}
                                            type="button"
                                            onClick={() => clearMetaSection('certifications')}
                                        >
                                            Xóa mục
                                        </button>
                                    ) : null}
                                    <button
                                        className={styles.inlineButton}
                                        type="button"
                                        onClick={() => addMetaItem('certifications', MAX_CERTIFICATIONS)}
                                        disabled={cvData.certifications.length >= MAX_CERTIFICATIONS}
                                    >
                                        + Thêm
                                    </button>
                                </div>
                            </div>

                            <div className={styles.projectEditorList}>
                                {cvData.certifications.length === 0 ? (
                                    <p className={styles.editorSubtle}>
                                        Mục này đang ẩn khỏi CV. Bấm `+ Thêm` để hiện lại.
                                    </p>
                                ) : null}
                                {cvData.certifications.map((item) => (
                                    <div className={styles.projectEditorCard} key={item.id}>
                                        <div className={styles.projectEditorHeader}>
                                            <h3>{trimValue(item.title) || 'Chứng chỉ mới'}</h3>
                                            <button
                                                className={styles.removeButton}
                                                type="button"
                                                onClick={() => removeMetaItem('certifications', item.id)}
                                            >
                                                Xóa
                                            </button>
                                        </div>

                                        <div className={styles.projectGrid}>
                                            <div className={styles.formGroup}>
                                                <label>Thời gian</label>
                                                <input
                                                    maxLength={24}
                                                    value={item.date}
                                                    placeholder="06/2024"
                                                    onChange={(event) =>
                                                        updateMetaItemField(
                                                            'certifications',
                                                            item.id,
                                                            'date',
                                                            event.target.value,
                                                        )
                                                    }
                                                />
                                            </div>

                                            <div className={styles.formGroup}>
                                                <label>Tên chứng chỉ</label>
                                                <input
                                                    maxLength={140}
                                                    value={item.title}
                                                    placeholder="Google UX Design / TOEIC / AWS..."
                                                    onChange={(event) =>
                                                        updateMetaItemField(
                                                            'certifications',
                                                            item.id,
                                                            'title',
                                                            event.target.value,
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className={`${styles.editorCard} ${styles.editorCardPriority}`}>
                            <h2>Mẫu CV</h2>
                            <p className={styles.editorSubtle}>
                                Chọn template trước. Mỗi mẫu giữ cùng dữ liệu nhưng có cách trình bày riêng để người
                                dùng lựa chọn.
                            </p>

                            <div className={styles.templateGrid}>
                                {CV_TEMPLATES.map((template) => {
                                    const isActive = cvData.templateId === template.id;

                                    return (
                                        <button
                                            className={`${styles.templateOption} ${
                                                isActive ? styles.templateOptionActive : ''
                                            }`}
                                            type="button"
                                            key={template.id}
                                            onClick={() => updateRootField('templateId', template.id)}
                                        >
                                            <span className={styles.templateOptionTop}>
                                                <strong>{template.label}</strong>
                                                <span className={styles.templatePreviewChip}>
                                                    {template.previewLabel}
                                                </span>
                                            </span>
                                            <small>{template.description}</small>
                                        </button>
                                    );
                                })}
                            </div>

                            <div className={styles.themeSummary}>
                                Mẫu đang chọn: <strong>{selectedTemplate.label}</strong>
                            </div>
                        </div>

                        <div className={styles.editorCard}>
                            <h2>Màu CV</h2>
                            {selectedTemplate.themeMode === 'locked' ? (
                                <>
                                    <p className={styles.editorSubtle}>
                                        Template này khóa sẵn palette để bám đúng form gốc, nên không cho đổi màu thủ công.
                                    </p>
                                    <div className={styles.templateLockNotice}>
                                        Màu đang dùng: <strong>{selectedTemplate.lockedThemeName || 'Fixed palette'}</strong>.
                                        Nếu muốn đổi màu, hãy chuyển sang Mẫu 1.
                                    </div>
                                </>
                            ) : (
                                <>
                                    <p className={styles.editorSubtle}>
                                        Chọn nhanh tone màu để CV nhìn đa dạng hơn mà vẫn giữ nguyên bố cục.
                                    </p>

                                    <div className={styles.themeGrid}>
                                        {CV_THEMES.map((theme) => {
                                            const isActive = cvData.themeId === theme.id;

                                            return (
                                                <button
                                                    className={`${styles.themeOption} ${
                                                        isActive ? styles.themeOptionActive : ''
                                                    }`}
                                                    type="button"
                                                    key={theme.id}
                                                    onClick={() => updateRootField('themeId', theme.id)}
                                                    style={{
                                                        '--theme-strong': theme.colors.section,
                                                        '--theme-soft': hexToRgbaString(theme.colors.section, 0.08),
                                                        '--theme-outline': hexToRgbaString(
                                                            theme.colors.section,
                                                            0.28,
                                                        ),
                                                    }}
                                                >
                                                    <span className={styles.themeSwatches}>
                                                        {theme.swatches.map((swatch) => (
                                                            <span
                                                                className={styles.themeSwatch}
                                                                key={`${theme.id}-${swatch}`}
                                                                style={{ background: swatch }}
                                                            />
                                                        ))}
                                                    </span>
                                                    <span className={styles.themeInfo}>
                                                        <strong>{theme.label}</strong>
                                                        <small>{theme.description}</small>
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>

                                    <div className={styles.themeSummary}>
                                        Màu đang chọn: <strong>{selectedTheme.label}</strong>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className={styles.editorCard}>
                            <h2>Thông tin liên hệ</h2>

                            {CONTACT_FIELDS.map((field) => (
                                <div className={styles.formGroup} key={field.key}>
                                    <label>{field.label}</label>
                                    <div className={styles.inputWithIcon}>
                                        <span className={styles.inputIcon}>
                                            <field.Icon />
                                        </span>
                                        <input
                                            maxLength={80}
                                            value={cvData.contacts[field.key]}
                                            placeholder={field.placeholder}
                                            onChange={(event) =>
                                                updateNestedField('contacts', field.key, event.target.value)
                                            }
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className={styles.editorCard}>
                            <div className={styles.cardTitleRow}>
                                <h2>Kỹ năng</h2>
                                <button
                                    className={styles.inlineButton}
                                    type="button"
                                    onClick={() => addListItem('skills')}
                                    disabled={cvData.skills.length >= MAX_SKILLS}
                                >
                                    + Thêm
                                </button>
                            </div>

                            <div className={styles.compactList}>
                                {cvData.skills.map((skill, index) => (
                                    <div className={styles.compactRow} key={`skill-${index}`}>
                                        <input
                                            maxLength={90}
                                            value={skill}
                                            placeholder="VD: JavaScript, React, SQL..."
                                            onChange={(event) => updateListItem('skills', index, event.target.value)}
                                        />
                                        <button
                                            className={styles.removeButton}
                                            type="button"
                                            onClick={() => removeListItem('skills', index)}
                                        >
                                            Xóa
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className={styles.editorCard}>
                            <div className={styles.cardTitleRow}>
                                <h2>Sở thích</h2>
                                <button
                                    className={styles.inlineButton}
                                    type="button"
                                    onClick={() => addListItem('interests')}
                                    disabled={cvData.interests.length >= MAX_INTERESTS}
                                >
                                    + Thêm
                                </button>
                            </div>

                            <div className={styles.compactList}>
                                {cvData.interests.map((interest, index) => (
                                    <div className={styles.compactRow} key={`interest-${index}`}>
                                        <input
                                            maxLength={70}
                                            value={interest}
                                            placeholder="VD: Đọc sách, nghe nhạc, thể thao..."
                                            onChange={(event) => updateListItem('interests', index, event.target.value)}
                                        />
                                        <button
                                            className={styles.removeButton}
                                            type="button"
                                            onClick={() => removeListItem('interests', index)}
                                        >
                                            Xóa
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className={`${styles.editorCard} ${styles.editorCardWide}`}>
                            <div className={styles.cardTitleRow}>
                                <h2>Kinh nghiệm làm việc</h2>
                                <button
                                    className={styles.inlineButton}
                                    type="button"
                                    onClick={addExperience}
                                    disabled={cvData.experiences.length >= MAX_EXPERIENCES}
                                >
                                    + Thêm
                                </button>
                            </div>

                            <div className={styles.projectEditorList}>
                                {cvData.experiences.map((experience) => (
                                    <div className={styles.projectEditorCard} key={experience.id}>
                                        <div className={styles.projectEditorHeader}>
                                            <h3>{experience.position || 'Kinh nghiệm mới'}</h3>
                                            <button
                                                className={styles.removeButton}
                                                type="button"
                                                onClick={() => removeExperience(experience.id)}
                                            >
                                                Xóa
                                            </button>
                                        </div>

                                        <div className={styles.projectGrid}>
                                            <div className={styles.formGroup}>
                                                <label>Vị trí / Chức danh</label>
                                                <input
                                                    maxLength={60}
                                                    value={experience.position}
                                                    placeholder="Kỹ sư AI"
                                                    onChange={(event) =>
                                                        updateExpField(experience.id, 'position', event.target.value)
                                                    }
                                                />
                                            </div>

                                            <div className={styles.formGroup}>
                                                <label>Công ty</label>
                                                <input
                                                    maxLength={60}
                                                    value={experience.company}
                                                    placeholder="Công ty cổ phần..."
                                                    onChange={(event) =>
                                                        updateExpField(experience.id, 'company', event.target.value)
                                                    }
                                                />
                                            </div>

                                            <div className={styles.formGroup}>
                                                <label>Bắt đầu</label>
                                                <input
                                                    maxLength={20}
                                                    value={experience.start}
                                                    placeholder="01/2021"
                                                    onChange={(event) =>
                                                        updateExpField(experience.id, 'start', event.target.value)
                                                    }
                                                />
                                            </div>

                                            <div className={styles.formGroup}>
                                                <label>Kết thúc</label>
                                                <input
                                                    maxLength={20}
                                                    value={experience.end}
                                                    placeholder="Nay"
                                                    onChange={(event) =>
                                                        updateExpField(experience.id, 'end', event.target.value)
                                                    }
                                                />
                                            </div>
                                        </div>

                                        <div className={styles.bulletEditor}>
                                            <div className={styles.cardTitleRow}>
                                                <h4>Mô tả công việc</h4>
                                                <button
                                                    className={styles.inlineButton}
                                                    type="button"
                                                    onClick={() => addExpBullet(experience.id)}
                                                    disabled={experience.bullets.length >= MAX_BULLETS}
                                                >
                                                    + Thêm dòng
                                                </button>
                                            </div>

                                            {experience.bullets.map((bullet, bulletIndex) => (
                                                <div
                                                    className={styles.compactRow}
                                                    key={`${experience.id}-${bulletIndex}`}
                                                >
                                                    <textarea
                                                        rows={2}
                                                        maxLength={180}
                                                        value={bullet}
                                                        placeholder="Viết ngắn gọn từng đầu việc hoặc thành tích..."
                                                        onChange={(event) =>
                                                            updateExpBullet(
                                                                experience.id,
                                                                bulletIndex,
                                                                event.target.value,
                                                            )
                                                        }
                                                    />
                                                    <button
                                                        className={styles.removeButton}
                                                        type="button"
                                                        onClick={() => removeExpBullet(experience.id, bulletIndex)}
                                                    >
                                                        Xóa
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <section className={styles.previewPanel}>
                    <div className={styles.previewStage}>
                        <CVTemplatePreview cvData={cvData} avatar={avatar} articleRef={previewArticleRef} />
                    </div>
                </section>
            </div>
        </div>
    );
}

export default CVBuilder;
