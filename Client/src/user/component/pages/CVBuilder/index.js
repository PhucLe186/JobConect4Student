import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import styles from './CVBuilder.module.scss';

const createEmptyProject = () => ({
    id: Date.now() + Math.random(),
    role: '',
    period: '',
    title: '',
    bullets: [''],
    result: '',
});

const createEmptyCV = () => ({
    fullName: '',
    headline: '',
    objective: '',
    contacts: {
        email: '',
        phone: '',
        birth: '',
        address: '',
    },
    education: {
        major: '',
        period: '',
        school: '',
        research: '',
        researchPeriod: '',
    },
    skills: [''],
    interests: [''],
    certificates: [''],
    repoLink: '',
    projects: [createEmptyProject()],
});

const CONTACT_FIELDS = [
    { key: 'email', label: 'Email', icon: '@' },
    { key: 'phone', label: 'Điện thoại', icon: '☎' },
    { key: 'birth', label: 'Ngày sinh', icon: '◷' },
    { key: 'address', label: 'Địa chỉ', icon: '⌂' },
];

function CVBuilder() {
    const [cvData, setCvData] = useState(createEmptyCV);
    const [avatar, setAvatar] = useState(null);
    const [exporting, setExporting] = useState(false);
    const avatarInputRef = useRef(null);
    const previewRef = useRef(null);

    const updateRootField = (field, value) => {
        setCvData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const updateNestedField = (section, field, value) => {
        setCvData((prev) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value,
            },
        }));
    };

    const updateListItem = (field, index, value) => {
        setCvData((prev) => ({
            ...prev,
            [field]: prev[field].map((item, itemIndex) => (itemIndex === index ? value : item)),
        }));
    };

    const addListItem = (field, defaultValue) => {
        setCvData((prev) => ({
            ...prev,
            [field]: [...prev[field], defaultValue],
        }));
    };

    const removeListItem = (field, index) => {
        setCvData((prev) => ({
            ...prev,
            [field]: prev[field].filter((item, itemIndex) => itemIndex !== index),
        }));
    };

    const updateProjectField = (id, field, value) => {
        setCvData((prev) => ({
            ...prev,
            projects: prev.projects.map((project) => (project.id === id ? { ...project, [field]: value } : project)),
        }));
    };

    const updateProjectBullet = (projectId, bulletIndex, value) => {
        setCvData((prev) => ({
            ...prev,
            projects: prev.projects.map((project) =>
                project.id === projectId
                    ? {
                          ...project,
                          bullets: project.bullets.map((bullet, index) => (index === bulletIndex ? value : bullet)),
                      }
                    : project,
            ),
        }));
    };

    const addProjectBullet = (projectId) => {
        setCvData((prev) => ({
            ...prev,
            projects: prev.projects.map((project) =>
                project.id === projectId
                    ? {
                          ...project,
                          bullets: [...project.bullets, 'New highlight'],
                      }
                    : project,
            ),
        }));
    };

    const removeProjectBullet = (projectId, bulletIndex) => {
        setCvData((prev) => ({
            ...prev,
            projects: prev.projects.map((project) =>
                project.id === projectId
                    ? {
                          ...project,
                          bullets: project.bullets.filter((bullet, index) => index !== bulletIndex),
                      }
                    : project,
            ),
        }));
    };

    const addProject = () => {
        setCvData((prev) => ({
            ...prev,
            projects: [...prev.projects, createEmptyProject()],
        }));
    };

    const removeProject = (id) => {
        setCvData((prev) => ({
            ...prev,
            projects: prev.projects.filter((project) => project.id !== id),
        }));
    };

    const handleReset = () => {
        setCvData(createEmptyCV());
        setAvatar(null);
    };

    const handleAvatarChange = (event) => {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }

        const reader = new FileReader();
        reader.onload = (loadEvent) => {
            setAvatar(loadEvent.target?.result || null);
        };
        reader.readAsDataURL(file);
        event.target.value = '';
    };

    const visibleContacts = CONTACT_FIELDS.filter((field) => cvData.contacts[field.key].trim());
    const visibleSkills = cvData.skills.filter((skill) => skill.trim());
    const visibleInterests = cvData.interests.filter((interest) => interest.trim());
    const visibleProjects = cvData.projects
        .map((project) => ({
            ...project,
            bullets: project.bullets.filter((bullet) => bullet.trim()),
        }))
        .filter(
            (project) =>
                project.role.trim() ||
                project.period.trim() ||
                project.title.trim() ||
                project.result.trim() ||
                project.bullets.length > 0,
        );

    const handleExportPDF = async () => {
        if (!previewRef.current || exporting) {
            return;
        }

        const pages = Array.from(previewRef.current.querySelectorAll(`.${styles.cvPage}`));
        if (!pages.length) {
            return;
        }

        setExporting(true);

        try {
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
            });

            for (let index = 0; index < pages.length; index += 1) {
                const canvas = await html2canvas(pages[index], {
                    scale: 2,
                    useCORS: true,
                    backgroundColor: '#ffffff',
                    logging: false,
                });

                const image = canvas.toDataURL('image/png');

                if (index > 0) {
                    pdf.addPage();
                }

                pdf.addImage(image, 'PNG', 0, 0, 210, 297);
            }

            pdf.save(`${cvData.fullName || 'CV-template'}.pdf`);
        } finally {
            setExporting(false);
        }
    };

    return (
        <div className={styles.builderPage}>
            <section className={styles.editorPanel}>
                <div className={styles.editorHeader}>
                    <div>
                        <p className={styles.kicker}>Tạo CV</p>
                        <h1>Hãy Thỏa Sức Tạo CV Của Bạn </h1>
                        <p className={styles.editorHint}>
                            Layout này đã được cố định theo đúng một form CV. Bạn chỉ cần nhập nội dung, ảnh đại diện và
                            tải file PDF.
                        </p>
                    </div>
                    <div className={styles.editorActions}>
                        <button className={styles.secondaryButton} type="button" onClick={handleReset}>
                            Khôi phục mặc định
                        </button>
                        <button
                            className={styles.primaryButton}
                            type="button"
                            onClick={handleExportPDF}
                            disabled={exporting}
                        >
                            {exporting ? 'Đang xuất PDF...' : 'Tải PDF'}
                        </button>
                    </div>
                </div>

                <div className={styles.editorGrid}>
                    <div className={styles.editorCard}>
                        <h2>Thông tin cá nhân</h2>
                        <div className={styles.formGroup}>
                            <label htmlFor="fullName">Họ và tên</label>
                            <input
                                id="fullName"
                                value={cvData.fullName}
                                onChange={(event) => updateRootField('fullName', event.target.value)}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="headline">Vị trí ứng tuyển</label>
                            <input
                                id="headline"
                                value={cvData.headline}
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
                                    {avatar ? 'Doi anh' : 'Them anh'}
                                </button>
                                <input
                                    ref={avatarInputRef}
                                    type="file"
                                    accept="image/*"
                                    hidden
                                    onChange={handleAvatarChange}
                                />
                            </div>
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="objective">Objective</label>
                            <textarea
                                id="objective"
                                rows={7}
                                value={cvData.objective}
                                onChange={(event) => updateRootField('objective', event.target.value)}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="repoLink">Link Git</label>
                            <input
                                id="repoLink"
                                value={cvData.repoLink}
                                onChange={(event) => updateRootField('repoLink', event.target.value)}
                            />
                        </div>
                    </div>

                    <div className={styles.editorCard}>
                        <h2>Thông tin liên hệ</h2>
                        {CONTACT_FIELDS.map((field) => (
                            <div className={styles.formGroup} key={field.key}>
                                <label htmlFor={field.key}>{field.label}</label>
                                <input
                                    id={field.key}
                                    value={cvData.contacts[field.key]}
                                    onChange={(event) => updateNestedField('contacts', field.key, event.target.value)}
                                />
                            </div>
                        ))}
                    </div>

                    <div className={styles.editorCard}>
                        <h2>Học Vấn</h2>
                        <div className={styles.formGroup}>
                            <label htmlFor="major">Chuyên ngành</label>
                            <input
                                id="major"
                                value={cvData.education.major}
                                onChange={(event) => updateNestedField('education', 'major', event.target.value)}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="eduPeriod">Thời gian học</label>
                            <input
                                id="eduPeriod"
                                value={cvData.education.period}
                                onChange={(event) => updateNestedField('education', 'period', event.target.value)}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="school">Trường</label>
                            <input
                                id="school"
                                value={cvData.education.school}
                                onChange={(event) => updateNestedField('education', 'school', event.target.value)}
                            />
                        </div>
                    </div>

                    <div className={styles.editorCard}>
                        <div className={styles.cardTitleRow}>
                            <h2>Bằng Cấp / Chứng Chỉ</h2>
                            <button
                                className={styles.inlineButton}
                                type="button"
                                onClick={() => addListItem('certificates', '')}
                            >
                                + Thêm
                            </button>
                        </div>
                        <div className={styles.compactList}>
                            {cvData.certificates.map((cert, index) => (
                                <div className={styles.compactRow} key={`cert-${index}`}>
                                    <input
                                        placeholder="VD: TOEIC 750, AWS Certified..."
                                        value={cert}
                                        onChange={(event) => updateListItem('certificates', index, event.target.value)}
                                    />
                                    <button
                                        className={styles.removeButton}
                                        type="button"
                                        onClick={() => removeListItem('certificates', index)}
                                    >
                                        Xóa
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={styles.editorCard}>
                        <div className={styles.cardTitleRow}>
                            <h2>Skills</h2>
                            <button
                                className={styles.inlineButton}
                                type="button"
                                onClick={() => addListItem('skills', 'New skill')}
                            >
                                + Them
                            </button>
                        </div>
                        <div className={styles.compactList}>
                            {cvData.skills.map((skill, index) => (
                                <div className={styles.compactRow} key={`${skill}-${index}`}>
                                    <input
                                        value={skill}
                                        onChange={(event) => updateListItem('skills', index, event.target.value)}
                                    />
                                    <button
                                        className={styles.removeButton}
                                        type="button"
                                        onClick={() => removeListItem('skills', index)}
                                    >
                                        Xoa
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={styles.editorCard}>
                        <div className={styles.cardTitleRow}>
                            <h2>Sở Thích </h2>
                            <button
                                className={styles.inlineButton}
                                type="button"
                                onClick={() => addListItem('interests', 'New interest')}
                            >
                                + Them
                            </button>
                        </div>
                        <div className={styles.compactList}>
                            {cvData.interests.map((interest, index) => (
                                <div className={styles.compactRow} key={`${interest}-${index}`}>
                                    <input
                                        value={interest}
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
                            <h2>Dự Án</h2>
                            <button className={styles.inlineButton} type="button" onClick={addProject}>
                                + Thêm dự án
                            </button>
                        </div>

                        <div className={styles.projectEditorList}>
                            {cvData.projects.map((project) => (
                                <article className={styles.projectEditorCard} key={project.id}>
                                    <div className={styles.projectEditorHeader}>
                                        <h3>{project.title || 'Project'}</h3>
                                        <button
                                            className={styles.removeButton}
                                            type="button"
                                            onClick={() => removeProject(project.id)}
                                        >
                                            Xóa dự án
                                        </button>
                                    </div>

                                    <div className={styles.projectGrid}>
                                        <div className={styles.formGroup}>
                                            <label>Vai trò</label>
                                            <input
                                                value={project.role}
                                                onChange={(event) =>
                                                    updateProjectField(project.id, 'role', event.target.value)
                                                }
                                            />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>Thời gian</label>
                                            <input
                                                value={project.period}
                                                onChange={(event) =>
                                                    updateProjectField(project.id, 'period', event.target.value)
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label>Project title</label>
                                        <input
                                            value={project.title}
                                            onChange={(event) =>
                                                updateProjectField(project.id, 'title', event.target.value)
                                            }
                                        />
                                    </div>

                                    <div className={styles.bulletEditor}>
                                        <div className={styles.cardTitleRow}>
                                            <h4>Highlights</h4>
                                            <button
                                                className={styles.inlineButton}
                                                type="button"
                                                onClick={() => addProjectBullet(project.id)}
                                            >
                                                + Thêm dòng
                                            </button>
                                        </div>

                                        {project.bullets.map((bullet, bulletIndex) => (
                                            <div className={styles.compactRow} key={`${project.id}-${bulletIndex}`}>
                                                <textarea
                                                    rows={2}
                                                    value={bullet}
                                                    onChange={(event) =>
                                                        updateProjectBullet(project.id, bulletIndex, event.target.value)
                                                    }
                                                />
                                                <button
                                                    className={styles.removeButton}
                                                    type="button"
                                                    onClick={() => removeProjectBullet(project.id, bulletIndex)}
                                                >
                                                    Xóa
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className={styles.previewPanel}>
                <div className={styles.previewShell} ref={previewRef}>
                    <article className={styles.cvPage}>
                        <aside className={styles.leftColumn}>
                            <div className={styles.profileTop}>
                                <div className={styles.avatarFrame}>
                                    <div
                                        className={styles.avatarPreview}
                                        style={
                                            avatar
                                                ? {
                                                      backgroundImage: `url(${avatar})`,
                                                      backgroundSize: 'cover',
                                                      backgroundPosition: 'center',
                                                  }
                                                : {}
                                        }
                                    />
                                </div>

                                <h2>{cvData.fullName}</h2>
                                <p>{cvData.headline}</p>
                            </div>

                            <div className={styles.leftSection}>
                                <div className={styles.leftTitle}>
                                    <span>Contact</span>
                                </div>
                                <ul className={styles.contactList}>
                                    {visibleContacts.map((field) => (
                                        <li key={field.key}>
                                            <span className={styles.contactIcon}>{field.icon}</span>
                                            <span>{cvData.contacts[field.key]}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className={styles.leftSection}>
                                <div className={styles.leftTitle}>
                                    <span>Education</span>
                                </div>
                                <div className={styles.leftBlock}>
                                    {cvData.education.major && <h3>{cvData.education.major}</h3>}
                                    {cvData.education.period && (
                                        <p className={styles.leftPeriod}>{cvData.education.period}</p>
                                    )}
                                    {cvData.education.school && <p>{cvData.education.school}</p>}
                                    {cvData.education.research && <p>{cvData.education.research}</p>}
                                    {cvData.education.researchPeriod && <p>{cvData.education.researchPeriod}</p>}
                                </div>
                            </div>

                            {cvData.certificates.filter((c) => c.trim()).length > 0 && (
                                <div className={styles.leftSection}>
                                    <div className={styles.leftTitle}>
                                        <span>Certificates</span>
                                    </div>
                                    <ul className={styles.simpleList}>
                                        {cvData.certificates
                                            .filter((c) => c.trim())
                                            .map((cert, index) => (
                                                <li key={`cert-${index}`}>{cert}</li>
                                            ))}
                                    </ul>
                                </div>
                            )}

                            <div className={styles.leftSection}>
                                <div className={styles.leftTitle}>
                                    <span>Skills</span>
                                </div>
                                <ul className={styles.simpleList}>
                                    {visibleSkills.map((skill, index) => (
                                        <li key={`${skill}-${index}`}>{skill}</li>
                                    ))}
                                </ul>
                            </div>
                        </aside>

                        <section className={styles.rightColumn}>
                            <div className={styles.rightSection}>
                                <div className={styles.sectionHeading}>
                                    <span className={styles.headingChip}>Objective</span>
                                    <span className={styles.headingLine} />
                                </div>
                                {cvData.objective && <p className={styles.objectiveText}>{cvData.objective}</p>}
                            </div>

                            <div className={styles.rightSection}>
                                <div className={styles.sectionHeading}>
                                    <span className={styles.headingChip}>Projects</span>
                                    <span className={styles.headingLine} />
                                </div>

                                <div className={styles.projectList}>
                                    {visibleProjects.map((project) => (
                                        <article className={styles.projectItem} key={project.id}>
                                            <div className={styles.projectMeta}>
                                                <span>{project.role}</span>
                                                <span>{project.period}</span>
                                            </div>
                                            <h3>{project.title}</h3>
                                            <ul>
                                                {project.bullets.map((bullet, index) => (
                                                    <li key={`${project.id}-${index}`}>{bullet}</li>
                                                ))}
                                            </ul>
                                            {project.result && (
                                                <p className={styles.projectResult}>
                                                    <strong>Result :</strong> {project.result}
                                                </p>
                                            )}
                                        </article>
                                    ))}
                                </div>
                            </div>
                        </section>
                    </article>

                    <article className={`${styles.cvPage} ${styles.secondPage}`}>
                        <aside className={styles.leftColumn}>
                            <div className={styles.leftSection}>
                                <div className={styles.leftTitle}>
                                    <span>Interest</span>
                                </div>
                                <ul className={styles.simpleList}>
                                    {visibleInterests.map((interest, index) => (
                                        <li key={`${interest}-${index}`}>{interest}</li>
                                    ))}
                                </ul>
                            </div>
                        </aside>

                        <section className={styles.rightColumn}>
                            <div className={styles.linkBlock}>
                                {cvData.repoLink && (
                                    <>
                                        <strong>link Git :</strong> {cvData.repoLink}
                                    </>
                                )}
                            </div>
                        </section>
                    </article>
                </div>
            </section>
        </div>
    );
}

export default CVBuilder;
