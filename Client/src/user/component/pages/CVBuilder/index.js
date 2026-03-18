import React, { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import styles from './CVBuilder.module.scss';

function App() {
    const [brandColor, setBrandColor] = useState('#3b8e74');
    const [cvData, setCvData] = useState({
        fullname: 'Nguyen Van A',
        title: 'Fullstack Developer',
        birth: '01/01/2000',
        phone: '+84 111111111',
        email: 'email@example.com',
        address: 'TP.HCM, Việt Nam',
        summary:
            'Hơn 2 năm kinh nghiệm lập trình web; giao tiếp tốt, học nhanh. Thành thạo HTML/CSS/JS, có kinh nghiệm với React và Node.js. Yêu thích sản phẩm sạch, dễ dùng.',
        skills: ['HTML, CSS, JavaScript', 'React, Node.js', 'Giao tiếp & làm việc nhóm'],
        experience: [
            {
                id: 1,
                company: 'ABC Tech',
                time: '2022 - nay',
                role: 'Fullstack Developer',
                tasks: ['Phát triển module quản trị, tối ưu hiệu năng.', 'Thiết kế API, tích hợp thanh toán.'],
            },
        ],
        education: [
            {
                id: 1,
                company: 'ĐH Công nghệ',
                time: '2018 - 2022',
                role: 'Kỹ sư CNTT',
                gpa: '3.5 / 4.0',
            },
        ],
    });
    const [avatar, setAvatar] = useState(null);
    const [exporting, setExporting] = useState(false);
    const avatarInputRef = useRef(null);
    const cvRef = useRef(null);

    useEffect(() => {
        if (cvRef.current) {
            const left = cvRef.current.querySelector(`.${styles.cvLeft}`);
            if (left) left.style.backgroundColor = brandColor;
        }
    }, [brandColor]);

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setAvatar(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    const updateField = (field, value) => {
        setCvData((prev) => ({ ...prev, [field]: value }));
    };

    const addSkill = () => {
        setCvData((prev) => ({
            ...prev,
            skills: [...prev.skills, 'Kỹ năng mới'],
        }));
    };

    const updateSkill = (index, value) => {
        setCvData((prev) => ({
            ...prev,
            skills: prev.skills.map((skill, i) => (i === index ? value : skill)),
        }));
    };

    const addExperience = () => {
        const newExp = {
            id: Date.now(),
            company: 'Công ty mới',
            time: '2023 - 2024',
            role: 'Vị trí',
            tasks: ['Thành tựu / nhiệm vụ 1', 'Thành tựu / nhiệm vụ 2'],
        };
        setCvData((prev) => ({
            ...prev,
            experience: [...prev.experience, newExp],
        }));
    };

    const updateExperience = (id, field, value) => {
        setCvData((prev) => ({
            ...prev,
            experience: prev.experience.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp)),
        }));
    };

    const addTask = (id) => {
        setCvData((prev) => ({
            ...prev,
            experience: prev.experience.map((exp) =>
                exp.id === id ? { ...exp, tasks: [...exp.tasks, 'Thành tựu / nhiệm vụ mới'] } : exp
            ),
        }));
    };

    const updateTask = (id, index, value) => {
        setCvData((prev) => ({
            ...prev,
            experience: prev.experience.map((exp) =>
                exp.id === id
                    ? { ...exp, tasks: exp.tasks.map((t, i) => (i === index ? value : t)) }
                    : exp
            ),
        }));
    };

    const removeExperience = (id) => {
        setCvData((prev) => ({
            ...prev,
            experience: prev.experience.filter((exp) => exp.id !== id),
        }));
    };

    const addEducation = () => {
        const newEdu = {
            id: Date.now(),
            company: 'Trường mới',
            time: 'YYYY - YYYY',
            role: 'Ngành / Bằng cấp',
            gpa: '',
        };
        setCvData((prev) => ({
            ...prev,
            education: [...prev.education, newEdu],
        }));
    };

    const updateEducation = (id, field, value) => {
        setCvData((prev) => ({
            ...prev,
            education: prev.education.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu)),
        }));
    };

    const removeEducation = (id) => {
        setCvData((prev) => ({
            ...prev,
            education: prev.education.filter((edu) => edu.id !== id),
        }));
    };

    const handleExportPDF = async () => {
        if (!cvRef.current || exporting) return;
        setExporting(true);
        const el = cvRef.current;
        // Ẩn các nút edit trước khi chụp
        const editBtns = el.querySelectorAll('button');
        editBtns.forEach((btn) => (btn.style.display = 'none'));
        // Xóa outline của contenteditable
        const editables = el.querySelectorAll('[contenteditable]');
        editables.forEach((e) => (e.style.outline = 'none'));
        try {
            const canvas = await html2canvas(el, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff',
                logging: false,
            });
            const imgData = canvas.toDataURL('image/jpeg', 1.0);
            const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
            const pdfW = pdf.internal.pageSize.getWidth();
            const pdfH = (canvas.height * pdfW) / canvas.width;
            pdf.addImage(imgData, 'JPEG', 0, 0, pdfW, pdfH);
            pdf.save(`${cvData.fullname || 'CV'}.pdf`);
        } finally {
            // Khôi phục các nút
            editBtns.forEach((btn) => (btn.style.display = ''));
            editables.forEach((e) => (e.style.outline = ''));
            setExporting(false);
        }
    };

    return (
        <div className={styles.App || 'App'}>
            <header className={styles.topbar}>
                <div className={styles.left}>
                    <h1>CV BUILDER</h1>
                </div>
                <div className={styles.right}>
                    <input
                        type="color"
                        value={brandColor}
                        onChange={(e) => setBrandColor(e.target.value)}
                        title="Màu chủ đạo"
                    />
                    <button onClick={addExperience}>+ Kinh nghiệm</button>
                    <button onClick={addEducation}>+ Học vấn</button>
                    <button id="printBtn" onClick={handleExportPDF} disabled={exporting}>
                        {exporting ? 'Đang xuất...' : '⬇ Tải xuống PDF'}
                    </button>
                </div>
            </header>

            <main className={styles.workspace}>
                <section className={`${styles.cvPaper} ${styles.A4}`} ref={cvRef}>
                    <aside className={styles.cvLeft}>
                        <div className={styles.avatarWrap}>
                            <input
                                type="file"
                                ref={avatarInputRef}
                                accept="image/*"
                                hidden
                                onChange={handleAvatarChange}
                            />
                            <div
                                className={styles.avatar}
                                onClick={() => avatarInputRef.current?.click()}
                                style={avatar ? { backgroundImage: `url(${avatar})`, backgroundSize: 'cover' } : {}}
                                title="Nhấn để đổi ảnh"
                            />
                        </div>

                        <div className={styles.section}>
                            <h3>Liên hệ</h3>
                            <ul>
                                <li>
                                    <strong>Điện thoại:</strong>
                                    <span
                                        contentEditable
                                        suppressContentEditableWarning
                                        onBlur={(e) => updateField('phone', e.target.textContent)}
                                    >
                                        {cvData.phone}
                                    </span>
                                </li>
                                <li>
                                    <strong>Email:</strong>
                                    <span
                                        contentEditable
                                        suppressContentEditableWarning
                                        onBlur={(e) => updateField('email', e.target.textContent)}
                                    >
                                        {cvData.email}
                                    </span>
                                </li>
                                <li>
                                    <strong>Địa chỉ:</strong>
                                    <span
                                        contentEditable
                                        suppressContentEditableWarning
                                        onBlur={(e) => updateField('address', e.target.textContent)}
                                    >
                                        {cvData.address}
                                    </span>
                                </li>
                            </ul>
                        </div>

                        <div className={styles.section}>
                            <h3>Kỹ năng</h3>
                            <ul className={styles.editableList}>
                                {cvData.skills.map((skill, index) => (
                                    <li
                                        key={index}
                                        contentEditable
                                        suppressContentEditableWarning
                                        onBlur={(e) => updateSkill(index, e.target.textContent)}
                                    >
                                        {skill}
                                    </li>
                                ))}
                            </ul>
                            <button className={styles.small} onClick={addSkill}>
                                + Thêm kỹ năng
                            </button>
                        </div>
                    </aside>

                    <section className={styles.cvRight}>
                        <header className={styles.cvHeader}>
                            <h2
                                contentEditable
                                suppressContentEditableWarning
                                onBlur={(e) => updateField('fullname', e.target.textContent)}
                            >
                                {cvData.fullname}
                            </h2>
                            <div
                                className={styles.subtitle}
                                contentEditable
                                suppressContentEditableWarning
                                onBlur={(e) => updateField('title', e.target.textContent)}
                            >
                                {cvData.title}
                            </div>
                            <div className={styles.meta}>
                                <span>
                                    <strong>Ngày sinh:</strong>
                                    <span
                                        contentEditable
                                        suppressContentEditableWarning
                                        onBlur={(e) => updateField('birth', e.target.textContent)}
                                    >
                                        {cvData.birth}
                                    </span>
                                </span>
                            </div>
                        </header>

                        <div className={styles.section}>
                            <h3>Tổng quan</h3>
                            <p
                                contentEditable
                                suppressContentEditableWarning
                                onBlur={(e) => updateField('summary', e.target.textContent)}
                            >
                                {cvData.summary}
                            </p>
                        </div>

                        <div className={styles.section}>
                            <h3>Kinh nghiệm</h3>
                            <div className={styles.stack}>
                                {cvData.experience.map((exp) => (
                                    <article key={exp.id} className={styles.item}>
                                        <div className={styles.itemHead}>
                                            <span
                                                className={styles.company}
                                                contentEditable
                                                suppressContentEditableWarning
                                                onBlur={(e) =>
                                                    updateExperience(exp.id, 'company', e.target.textContent)
                                                }
                                            >
                                                {exp.company}
                                            </span>
                                            <span
                                                className={styles.time}
                                                contentEditable
                                                suppressContentEditableWarning
                                                onBlur={(e) => updateExperience(exp.id, 'time', e.target.textContent)}
                                            >
                                                {exp.time}
                                            </span>
                                        </div>
                                        <div
                                            className={styles.role}
                                            contentEditable
                                            suppressContentEditableWarning
                                            onBlur={(e) => updateExperience(exp.id, 'role', e.target.textContent)}
                                        >
                                            {exp.role}
                                        </div>
                                        <ul className={styles.editableList}>
                                            {exp.tasks.map((task, index) => (
                                                <li
                                                    key={index}
                                                    contentEditable
                                                    suppressContentEditableWarning
                                                    onBlur={(e) => updateTask(exp.id, index, e.target.textContent)}
                                                >
                                                    {task}
                                                </li>
                                            ))}
                                        </ul>
                                        <button className={styles.small} onClick={() => addTask(exp.id)}>
                                            + Thêm thành tựu
                                        </button>
                                        <button
                                            className={`${styles.small} ${styles.danger} ${styles.removeItem}`}
                                            onClick={() => removeExperience(exp.id)}
                                        >
                                            Xóa mục
                                        </button>
                                    </article>
                                ))}
                            </div>
                        </div>

                        <div className={styles.section}>
                            <h3>Học vấn</h3>
                            <div className={styles.stack}>
                                {cvData.education.map((edu) => (
                                    <article key={edu.id} className={styles.item}>
                                        <div className={styles.itemHead}>
                                            <span
                                                className={styles.company}
                                                contentEditable
                                                suppressContentEditableWarning
                                                onBlur={(e) => updateEducation(edu.id, 'company', e.target.textContent)}
                                            >
                                                {edu.company}
                                            </span>
                                            <span
                                                className={styles.time}
                                                contentEditable
                                                suppressContentEditableWarning
                                                onBlur={(e) => updateEducation(edu.id, 'time', e.target.textContent)}
                                            >
                                                {edu.time}
                                            </span>
                                        </div>
                                        <div
                                            className={styles.role}
                                            contentEditable
                                            suppressContentEditableWarning
                                            onBlur={(e) => updateEducation(edu.id, 'role', e.target.textContent)}
                                        >
                                            {edu.role}
                                        </div>
                                        <div className={styles.gpaRow}>
                                            <strong>GPA:</strong>
                                            <span
                                                contentEditable
                                                suppressContentEditableWarning
                                                onBlur={(e) => updateEducation(edu.id, 'gpa', e.target.textContent)}
                                            >
                                                {edu.gpa}
                                            </span>
                                        </div>
                                        <button
                                            className={`${styles.small} ${styles.danger} ${styles.removeItem}`}
                                            onClick={() => removeEducation(edu.id)}
                                        >
                                            Xóa mục
                                        </button>
                                    </article>
                                ))}
                            </div>
                        </div>
                    </section>
                </section>
            </main>

            <footer className={styles.footer}>
                Mẹo: Nhấp vào bất kỳ nội dung nào để chỉnh sửa trực tiếp. Nhấn Enter để xuống dòng; Shift+Enter để xuống
                dòng mềm.
            </footer>
        </div>
    );
}

export default App;
