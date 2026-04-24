import React, { useRef, useState } from 'react';
import { jsPDF } from 'jspdf';
import {
    FaCalendarAlt,
    FaEnvelope,
    FaLink,
    FaMapMarkerAlt,
    FaPhoneAlt,
} from 'react-icons/fa';
import styles from './CVBuilder.module.scss';

const MAX_SKILLS = 10;
const MAX_EXPERIENCES = 3;
const MAX_BULLETS = 4;
const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;
const LEFT_COLUMN_WIDTH = 63;
const RIGHT_COLUMN_X = 69;
const RIGHT_CONTENT_WIDTH = 132;
const PDF_FONT_NAME = 'ArialUnicode';
const PDF_FONT_BOLD_NAME = 'ArialUnicodeBold';

let pdfFontAssetsPromise = null;

const createEmptyExperience = () => ({
    id: Date.now() + Math.random(),
    position: '',
    company: '',
    start: '',
    end: '',
    bullets: [''],
});

const createEmptyCV = () => ({
    fullName: '',
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

const CONTACT_FIELDS = [
    { key: 'phone', label: 'Điện thoại', Icon: FaPhoneAlt, placeholder: '0943009243' },
    { key: 'birth', label: 'Ngày sinh', Icon: FaCalendarAlt, placeholder: '31/12/2003' },
    { key: 'email', label: 'Email', Icon: FaEnvelope, placeholder: 'ban@example.com' },
    { key: 'website', label: 'LinkedIn / Portfolio', Icon: FaLink, placeholder: 'linkedin.com/in/ban' },
    { key: 'address', label: 'Địa chỉ', Icon: FaMapMarkerAlt, placeholder: 'Quận 2, Hồ Chí Minh' },
];

const trimValue = (value = '') => value.trim();

const formatPeriod = (start = '', end = '', fallback = 'Bắt đầu - Kết thúc') => {
    const from = trimValue(start);
    const to = trimValue(end);

    if (!from && !to) {
        return fallback;
    }

    return `${from || 'Bắt đầu'} - ${to || 'Kết thúc'}`;
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
            loadFontAsset(`${basePath}/fonts/arial.ttf`),
            loadFontAsset(`${basePath}/fonts/arialbd.ttf`),
        ]).then(([normalFont, boldFont]) => ({
            normalFont,
            boldFont,
        }));
    }

    const { normalFont, boldFont } = await pdfFontAssetsPromise;

    doc.addFileToVFS('arial.ttf', normalFont);
    doc.addFont('arial.ttf', PDF_FONT_NAME, 'normal');
    doc.addFileToVFS('arialbd.ttf', boldFont);
    doc.addFont('arialbd.ttf', PDF_FONT_BOLD_NAME, 'bold');
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

const drawBulletList = (doc, items, startX, startY, contentWidth, maxLinesPerBullet = 2) => {
    let currentY = startY;

    items.forEach((item) => {
        const lines = getWrappedLines(doc, item, contentWidth - 5, maxLinesPerBullet);

        if (!lines.length) {
            return;
        }

        doc.setFont(PDF_FONT_BOLD_NAME, 'bold');
        doc.setFontSize(10);
        doc.text('•', startX, currentY);
        doc.setFont(PDF_FONT_NAME, 'normal');
        doc.setFontSize(9.5);
        currentY = drawTextLines(doc, lines, startX + 4.5, currentY, 4.1);
        currentY += 1;
    });

    return currentY;
};

const drawSectionHeader = (doc, label, baselineY) => {
    doc.setFillColor(92, 56, 41);
    doc.roundedRect(RIGHT_COLUMN_X, baselineY - 5.6, 43, 8, 4, 4, 'F');
    doc.setFont(PDF_FONT_BOLD_NAME, 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(255, 255, 255);
    doc.text(label, RIGHT_COLUMN_X + 4, baselineY);
    doc.setDrawColor(61, 44, 36);
    doc.setLineWidth(0.25);
    doc.line(RIGHT_COLUMN_X + 44, baselineY - 1.5, PAGE_WIDTH - 8, baselineY - 1.5);
    doc.setTextColor(30, 32, 35);
};

const createCircularAvatarDataUrl = (source) =>
    new Promise((resolve, reject) => {
        if (!source) {
            resolve(null);
            return;
        }

        const image = new Image();
        image.onload = () => {
            const size = 500;
            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const context = canvas.getContext('2d');

            if (!context) {
                resolve(source);
                return;
            }

            context.clearRect(0, 0, size, size);
            context.beginPath();
            context.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
            context.closePath();
            context.clip();

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
            resolve(canvas.toDataURL('image/png'));
        };

        image.onerror = () => reject(new Error('Không thể xử lý ảnh đại diện cho PDF.'));
        image.src = source;
    });

const drawPdfBackground = (doc) => {
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, 'F');

    doc.setFillColor(58, 36, 28);
    doc.rect(0, 0, LEFT_COLUMN_WIDTH, PAGE_HEIGHT, 'F');

    doc.setFillColor(238, 243, 247);
    doc.rect(LEFT_COLUMN_WIDTH, 0, PAGE_WIDTH - LEFT_COLUMN_WIDTH, PAGE_HEIGHT, 'F');

    doc.setFillColor(205, 224, 236);
    doc.triangle(95, 185, PAGE_WIDTH, 185, 178, PAGE_HEIGHT, 'F');
    doc.setFillColor(227, 236, 243);
    doc.triangle(118, 110, PAGE_WIDTH, 110, 192, 240, 'F');
};

const drawPdfLeftColumn = async (doc, cvData, avatar) => {
    const visibleContacts = CONTACT_FIELDS.filter(({ key }) => trimValue(cvData.contacts[key]));
    const visibleSkills = cvData.skills.map(trimValue).filter(Boolean).slice(0, MAX_SKILLS);
    const avatarCenterX = LEFT_COLUMN_WIDTH / 2;
    const avatarCenterY = 28;
    const outerRadius = 19;
    const innerRadius = 16.5;
    const avatarDataUrl = await createCircularAvatarDataUrl(avatar);

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
    doc.setFontSize(14.5);
    const nameLines = getWrappedLines(doc, trimValue(cvData.fullName) || 'Họ tên ứng viên', 46, 2);
    let currentY = drawTextLines(doc, nameLines, avatarCenterX, 58, 5.5, { align: 'center' });

    doc.setFont(PDF_FONT_BOLD_NAME, 'bold');
    doc.setFontSize(12);
    const headlineLines = getWrappedLines(doc, trimValue(cvData.headline) || 'Vị trí ứng tuyển', 44, 3);
    currentY = drawTextLines(doc, headlineLines, avatarCenterX, currentY + 1.5, 5, { align: 'center' });

    let separatorY = currentY + 6;
    doc.setDrawColor(255, 255, 255);
    doc.setLineWidth(0.2);
    doc.line(0, separatorY, LEFT_COLUMN_WIDTH, separatorY);

    currentY = separatorY + 8;
    doc.setFont(PDF_FONT_NAME, 'normal');
    doc.setFontSize(9.3);

    visibleContacts.forEach(({ key }) => {
        const lines = getWrappedLines(doc, cvData.contacts[key], 44, 2);

        if (!lines.length) {
            return;
        }

        doc.setFillColor(255, 255, 255);
        doc.circle(8.8, currentY - 1.2, 0.85, 'F');
        currentY = drawTextLines(doc, lines, 12.2, currentY, 4.3);
        currentY += 1.7;
    });

    currentY += 2;
    doc.line(7, currentY, LEFT_COLUMN_WIDTH - 7, currentY);
    currentY += 6;

    doc.setFillColor(112, 71, 57);
    doc.roundedRect(4.8, currentY - 4.8, 20, 7.6, 3.8, 3.8, 'F');
    doc.setFont(PDF_FONT_BOLD_NAME, 'bold');
    doc.setFontSize(10.5);
    doc.text('Kỹ năng', 7.7, currentY);
    currentY += 6.5;

    doc.setFont(PDF_FONT_NAME, 'normal');
    doc.setFontSize(9.5);
    visibleSkills.forEach((skill) => {
        const skillLines = getWrappedLines(doc, skill, 44, 2);

        if (!skillLines.length || currentY > PAGE_HEIGHT - 8) {
            return;
        }

        doc.setFont(PDF_FONT_BOLD_NAME, 'bold');
        doc.text('•', 9, currentY);
        doc.setFont(PDF_FONT_NAME, 'normal');
        currentY = drawTextLines(doc, skillLines, 12.2, currentY, 4.1);
        currentY += 1;
    });
};

const drawPdfRightColumn = (doc, cvData) => {
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

    let currentY = 18;

    drawSectionHeader(doc, 'Mục tiêu nghề nghiệp', currentY);
    currentY += 6;

    doc.setFont(PDF_FONT_NAME, 'normal');
    doc.setFontSize(9.5);
    const objectiveLines = getWrappedLines(doc, cvData.objective, RIGHT_CONTENT_WIDTH, 8);
    currentY = drawTextLines(doc, objectiveLines, RIGHT_COLUMN_X, currentY, 4.35);
    currentY = Math.max(currentY, 46);

    drawSectionHeader(doc, 'Kinh nghiệm làm việc', currentY + 4);
    currentY += 10;

    visibleExperiences.forEach((experience) => {
        const roleLines = getWrappedLines(
            doc,
            trimValue(experience.position) || 'Vị trí công việc',
            82,
            2,
        );
        const periodText = formatPeriod(experience.start, experience.end);

        doc.setFont(PDF_FONT_BOLD_NAME, 'bold');
        doc.setFontSize(10.2);
        const roleEndY = drawTextLines(doc, roleLines, RIGHT_COLUMN_X, currentY, 4.3);
        doc.text(periodText, PAGE_WIDTH - 8, currentY, { align: 'right' });
        currentY = roleEndY;

        if (trimValue(experience.company)) {
            doc.setFont(PDF_FONT_NAME, 'normal');
            doc.setFontSize(9.5);
            const companyLines = getWrappedLines(doc, experience.company, RIGHT_CONTENT_WIDTH, 2);
            currentY = drawTextLines(doc, companyLines, RIGHT_COLUMN_X, currentY, 4.1);
        }

        doc.setFont(PDF_FONT_NAME, 'normal');
        doc.setFontSize(9.5);
        currentY = drawBulletList(doc, experience.bullets, RIGHT_COLUMN_X + 2, currentY + 1.5, 126, 2);
        currentY += 2.2;
    });

    currentY = Math.max(currentY, 202);
    drawSectionHeader(doc, 'Học vấn', currentY + 4);
    currentY += 10;

    if (trimValue(cvData.education.major)) {
        doc.setFont(PDF_FONT_NAME, 'normal');
        doc.setFontSize(9.3);
        const majorLines = getWrappedLines(doc, cvData.education.major, RIGHT_CONTENT_WIDTH, 2);
        currentY = drawTextLines(doc, majorLines, RIGHT_COLUMN_X, currentY, 4.2);
    }

    doc.setFont(PDF_FONT_BOLD_NAME, 'bold');
    doc.setFontSize(9.4);
    doc.text(formatPeriod(cvData.education.start, cvData.education.end), RIGHT_COLUMN_X, currentY + 1);
    currentY += 5.8;

    if (trimValue(cvData.education.school)) {
        doc.setFont(PDF_FONT_BOLD_NAME, 'bold');
        doc.setFontSize(10.2);
        const schoolLines = getWrappedLines(doc, cvData.education.school, RIGHT_CONTENT_WIDTH, 2);
        currentY = drawTextLines(doc, schoolLines, RIGHT_COLUMN_X, currentY, 4.3);
    }

    const educationBullets = [];

    if (trimValue(cvData.education.gpa)) {
        educationBullets.push(`GPA: ${cvData.education.gpa}`);
    }

    if (trimValue(cvData.education.thesis)) {
        educationBullets.push(`Đồ án tốt nghiệp: ${cvData.education.thesis}`);
    }

    doc.setFont(PDF_FONT_NAME, 'normal');
    doc.setFontSize(9.4);
    drawBulletList(doc, educationBullets, RIGHT_COLUMN_X + 2, currentY + 2, 126, 2);
};

const exportCvToPdf = async (cvData, avatar) => {
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
    });

    await ensurePdfFonts(doc);
    drawPdfBackground(doc);
    await drawPdfLeftColumn(doc, cvData, avatar);
    drawPdfRightColumn(doc, cvData);

    const fileName = `${trimValue(cvData.fullName) || 'CV'}.pdf`;
    doc.save(fileName);
};

function CVBuilder() {
    const [cvData, setCvData] = useState(createEmptyCV);
    const [avatar, setAvatar] = useState(null);
    const [isExporting, setIsExporting] = useState(false);
    const avatarInputRef = useRef(null);

    const updateRootField = (field, value) =>
        setCvData((prev) => ({ ...prev, [field]: value }));

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
            if (prev[field].length >= MAX_SKILLS) {
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
                          bullets: experience.bullets.map((bullet, index) =>
                              index === bulletIndex ? value : bullet,
                          ),
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

    const handleReset = () => {
        setCvData(createEmptyCV());
        setAvatar(null);

        if (avatarInputRef.current) {
            avatarInputRef.current.value = '';
        }
    };

    const handleAvatarChange = (event) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        const reader = new FileReader();
        reader.onload = (loadEvent) => setAvatar(loadEvent.target?.result || null);
        reader.readAsDataURL(file);
        event.target.value = '';
    };

    const handleExportPDF = async () => {
        if (isExporting) {
            return;
        }

        setIsExporting(true);

        try {
            await exportCvToPdf(cvData, avatar);
        } catch (error) {
            console.error('Lỗi khi xuất PDF:', error);
            window.alert('Không thể tạo file PDF. Vui lòng thử lại.');
        } finally {
            setIsExporting(false);
        }
    };

    const visibleContacts = CONTACT_FIELDS.filter(({ key }) => trimValue(cvData.contacts[key]));
    const visibleSkills = cvData.skills.map(trimValue).filter(Boolean).slice(0, MAX_SKILLS);
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
    const hasEducation = Object.values(cvData.education).some((value) => trimValue(value));

    return (
        <div className={styles.builderPage}>
            <section className={styles.editorPanel}>
                <div className={styles.editorHeader}>
                    <div>
                        <p className={styles.kicker}>CV Builder</p>
                        <h1>Mẫu CV cố định theo form OCR</h1>
                        <p className={styles.editorHint}>
                            Nhập dữ liệu ở bên trái, phần preview bên phải sẽ luôn bám một layout A4 cố
                            định giống mẫu bạn gửi.
                        </p>
                    </div>

                    <div className={styles.editorActions}>
                        <button className={styles.secondaryButton} type="button" onClick={handleReset}>
                            Làm mới
                        </button>
                        <button
                            className={styles.primaryButton}
                            type="button"
                            onClick={handleExportPDF}
                            disabled={isExporting}
                        >
                            {isExporting ? 'Đang tạo PDF...' : 'Lưu PDF'}
                        </button>
                    </div>
                </div>

                <div className={styles.templateNotice}>
                    <strong>Form này được khóa trong 1 trang A4.</strong> Để CV dễ detect text hơn,
                    mình giữ bố cục cố định: tối đa {MAX_EXPERIENCES} kinh nghiệm, {MAX_BULLETS} gạch
                    đầu dòng mỗi kinh nghiệm và {MAX_SKILLS} kỹ năng ở cột trái.
                </div>

                <div className={styles.editorGrid}>
                    <div className={styles.editorCard}>
                        <h2>Thông tin cá nhân</h2>

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
                            <label>Vị trí ứng tuyển</label>
                            <input
                                maxLength={70}
                                value={cvData.headline}
                                placeholder="Fresher Frontend Web Developer"
                                onChange={(event) => updateRootField('headline', event.target.value)}
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
                                    Khi bấm lưu, file sẽ tải thẳng xuống dưới dạng PDF.
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
                        <h2>Thông tin liên hệ</h2>

                        {CONTACT_FIELDS.map((field) => (
                            <div className={styles.formGroup} key={field.key}>
                                <label>{field.label}</label>
                                <input
                                    maxLength={80}
                                    value={cvData.contacts[field.key]}
                                    placeholder={field.placeholder}
                                    onChange={(event) =>
                                        updateNestedField('contacts', field.key, event.target.value)
                                    }
                                />
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
                                        onChange={(event) =>
                                            updateListItem('skills', index, event.target.value)
                                        }
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
                                                placeholder="AI Engineer"
                                                onChange={(event) =>
                                                    updateExpField(
                                                        experience.id,
                                                        'position',
                                                        event.target.value,
                                                    )
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
                                                    updateExpField(
                                                        experience.id,
                                                        'company',
                                                        event.target.value,
                                                    )
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
                                                    updateExpField(
                                                        experience.id,
                                                        'start',
                                                        event.target.value,
                                                    )
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
                                                    updateExpField(
                                                        experience.id,
                                                        'end',
                                                        event.target.value,
                                                    )
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
                                                    onClick={() =>
                                                        removeExpBullet(experience.id, bulletIndex)
                                                    }
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

                    <div className={styles.editorCard}>
                        <h2>Học vấn</h2>

                        <div className={styles.formGroup}>
                            <label>Ngành học / Môn học</label>
                            <input
                                maxLength={80}
                                value={cvData.education.major}
                                placeholder="Công nghệ thông tin"
                                onChange={(event) =>
                                    updateNestedField('education', 'major', event.target.value)
                                }
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
                                    onChange={(event) =>
                                        updateNestedField('education', 'end', event.target.value)
                                    }
                                />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Trường</label>
                            <input
                                maxLength={90}
                                value={cvData.education.school}
                                placeholder="Đại học Công nghệ - Đại học Quốc gia Hà Nội"
                                onChange={(event) =>
                                    updateNestedField('education', 'school', event.target.value)
                                }
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>GPA</label>
                            <input
                                maxLength={20}
                                value={cvData.education.gpa}
                                placeholder="3.4/4.0"
                                onChange={(event) =>
                                    updateNestedField('education', 'gpa', event.target.value)
                                }
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Đồ án / Luận văn</label>
                            <textarea
                                rows={3}
                                maxLength={180}
                                value={cvData.education.thesis}
                                placeholder="Ứng dụng học sâu trong phân loại ảnh y tế..."
                                onChange={(event) =>
                                    updateNestedField('education', 'thesis', event.target.value)
                                }
                            />
                        </div>
                    </div>
                </div>
            </section>

            <section className={styles.previewPanel}>
                <div className={styles.previewStage}>
                    <article className={styles.cvPage}>
                        <aside className={styles.leftColumn}>
                            <div className={styles.avatarFrame}>
                                <div
                                    className={avatar ? styles.avatarPreview : styles.avatarPlaceholder}
                                    style={
                                        avatar
                                            ? {
                                                  backgroundImage: `url(${avatar})`,
                                              }
                                            : undefined
                                    }
                                />
                            </div>

                            <div className={styles.identityBlock}>
                                <h2>{trimValue(cvData.fullName) || 'Họ tên ứng viên'}</h2>
                                <p>{trimValue(cvData.headline) || 'Vị trí ứng tuyển'}</p>
                            </div>

                            <div className={styles.leftBlock}>
                                {visibleContacts.length > 0 ? (
                                    <ul className={styles.contactList}>
                                        {visibleContacts.map(({ key, Icon }) => (
                                            <li className={styles.contactRow} key={key}>
                                                <span className={styles.contactIcon}>
                                                    <Icon />
                                                </span>
                                                <span>{cvData.contacts[key]}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className={styles.leftPlaceholder}>
                                        Điền số điện thoại, email, ngày sinh và địa chỉ để cột trái
                                        khớp form mẫu.
                                    </p>
                                )}
                            </div>

                            <div className={styles.leftBlock}>
                                <div className={styles.leftBadge}>Kỹ năng</div>
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
                        </aside>

                        <section className={styles.rightColumn}>
                            <div className={styles.rightContent}>
                                <div className={styles.sectionBlock}>
                                    <div className={styles.sectionHeader}>
                                        <div className={styles.sectionLabel}>Mục tiêu nghề nghiệp</div>
                                        <div className={styles.sectionLine} />
                                    </div>

                                    <div className={styles.sectionBody}>
                                        {trimValue(cvData.objective) ? (
                                            <p className={styles.objectiveText}>{cvData.objective}</p>
                                        ) : (
                                            <p className={styles.placeholderText}>
                                                Nhập mục tiêu nghề nghiệp để phần mở đầu hiển thị giống
                                                mẫu.
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className={styles.sectionBlock}>
                                    <div className={styles.sectionHeader}>
                                        <div className={styles.sectionLabel}>Kinh nghiệm làm việc</div>
                                        <div className={styles.sectionLine} />
                                    </div>

                                    <div className={styles.sectionBody}>
                                        {visibleExperiences.length > 0 ? (
                                            <div className={styles.experienceList}>
                                                {visibleExperiences.map((experience) => {
                                                    const isPeriodEmpty =
                                                        !trimValue(experience.start) &&
                                                        !trimValue(experience.end);

                                                    return (
                                                        <div
                                                            className={styles.experienceItem}
                                                            key={experience.id}
                                                        >
                                                            <div className={styles.roleRow}>
                                                                <span className={styles.roleTitle}>
                                                                    {trimValue(experience.position) ||
                                                                        'Vị trí công việc'}
                                                                </span>
                                                                <span
                                                                    className={`${styles.periodText} ${
                                                                        isPeriodEmpty
                                                                            ? styles.periodPlaceholder
                                                                            : ''
                                                                    }`}
                                                                >
                                                                    {formatPeriod(
                                                                        experience.start,
                                                                        experience.end,
                                                                    )}
                                                                </span>
                                                            </div>

                                                            {trimValue(experience.company) && (
                                                                <div className={styles.companyText}>
                                                                    {experience.company}
                                                                </div>
                                                            )}

                                                            {experience.bullets.length > 0 && (
                                                                <ul className={styles.bulletList}>
                                                                    {experience.bullets.map(
                                                                        (bullet, bulletIndex) => (
                                                                            <li
                                                                                key={`${experience.id}-preview-${bulletIndex}`}
                                                                            >
                                                                                {bullet}
                                                                            </li>
                                                                        ),
                                                                    )}
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

                                <div className={styles.sectionBlock}>
                                    <div className={styles.sectionHeader}>
                                        <div className={styles.sectionLabel}>Học vấn</div>
                                        <div className={styles.sectionLine} />
                                    </div>

                                    <div className={styles.sectionBody}>
                                        {hasEducation ? (
                                            <div>
                                                {trimValue(cvData.education.major) && (
                                                    <div className={styles.educationIntro}>
                                                        {cvData.education.major}
                                                    </div>
                                                )}

                                                <div
                                                    className={`${styles.educationPeriod} ${
                                                        !trimValue(cvData.education.start) &&
                                                        !trimValue(cvData.education.end)
                                                            ? styles.periodPlaceholder
                                                            : ''
                                                    }`}
                                                >
                                                    {formatPeriod(
                                                        cvData.education.start,
                                                        cvData.education.end,
                                                    )}
                                                </div>

                                                {trimValue(cvData.education.school) && (
                                                    <div className={styles.educationSchool}>
                                                        {cvData.education.school}
                                                    </div>
                                                )}

                                                <ul className={styles.educationList}>
                                                    {trimValue(cvData.education.gpa) && (
                                                        <li>GPA: {cvData.education.gpa}</li>
                                                    )}
                                                    {trimValue(cvData.education.thesis) && (
                                                        <li>Đồ án tốt nghiệp: {cvData.education.thesis}</li>
                                                    )}
                                                </ul>
                                            </div>
                                        ) : (
                                            <p className={styles.placeholderText}>
                                                Điền ngành học, giai đoạn, trường và GPA để phần học vấn
                                                hiển thị như mẫu.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </section>
                    </article>
                </div>
            </section>
        </div>
    );
}

export default CVBuilder;
