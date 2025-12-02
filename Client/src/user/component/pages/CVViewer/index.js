import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from '../CVBuilder/CVBuilder.module.scss';

function CVViewer() {
    const { resumeId } = useParams();
    const [cvData, setCvData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCV();
    }, [resumeId]);

    const fetchCV = async () => {
        try {
            const response = await fetch(`http://localhost:5000/resume/${resumeId}`);
            if (response.ok) {
                const data = await response.json();
                setCvData(data);
            }
        } catch (error) {
            console.error('Error fetching CV:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Đang tải CV...</div>;
    if (!cvData) return <div>Không tìm thấy CV</div>;

    return (
        <div className={styles.App}>
            <style>
                {`:root { --brand: ${cvData.brand_color || '#3b8e74'}; }`}
            </style>
            
            <header className={styles.topbar}>
                <div className={styles.left}>
                    <h1>CV VIEWER</h1>
                </div>
                <div className={styles.right}>
                    <button onClick={() => window.print()}>
                        Tải xuống PDF
                    </button>
                </div>
            </header>

            <main className={styles.workspace}>
                <section className={`${styles.cvPaper} ${styles.A4}`}>
                    <aside className={styles.cvLeft}>
                        <div className={styles.avatarWrap}>
                            <div
                                className={styles.avatar}
                                style={cvData.avatar ? { 
                                    backgroundImage: `url(${cvData.avatar})`, 
                                    backgroundSize: 'cover' 
                                } : {}}
                            />
                        </div>

                        <div className={styles.section}>
                            <h3>Liên hệ</h3>
                            <ul>
                                <li><strong>Điện thoại:</strong> {cvData.phone}</li>
                                <li><strong>Email:</strong> {cvData.email}</li>
                                <li><strong>Địa chỉ:</strong> {cvData.address}</li>
                            </ul>
                        </div>

                        <div className={styles.section}>
                            <h3>Kỹ năng</h3>
                            <ul>
                                {cvData.skills?.map((skill, index) => (
                                    <li key={index}>{skill}</li>
                                ))}
                            </ul>
                        </div>
                    </aside>

                    <section className={styles.cvRight}>
                        <header className={styles.cvHeader}>
                            <h2>{cvData.fullname}</h2>
                            <div className={styles.subtitle}>{cvData.title}</div>
                            <div className={styles.meta}>
                                <span><strong>Ngày sinh:</strong> {cvData.birth}</span>
                            </div>
                        </header>

                        <div className={styles.section}>
                            <h3>Tổng quan</h3>
                            <p>{cvData.summary}</p>
                        </div>

                        <div className={styles.section}>
                            <h3>Kinh nghiệm</h3>
                            <div className={styles.stack}>
                                {cvData.experience?.map((exp) => (
                                    <article key={exp.id} className={styles.item}>
                                        <div className={styles.itemHead}>
                                            <span className={styles.company}>{exp.company}</span>
                                            <span className={styles.time}>{exp.time}</span>
                                        </div>
                                        <div className={styles.role}>{exp.role}</div>
                                        <ul>
                                            {exp.tasks?.map((task, index) => (
                                                <li key={index}>{task}</li>
                                            ))}
                                        </ul>
                                    </article>
                                ))}
                            </div>
                        </div>

                        <div className={styles.section}>
                            <h3>Học vấn</h3>
                            <div className={styles.stack}>
                                {cvData.education?.map((edu) => (
                                    <article key={edu.id} className={styles.item}>
                                        <div className={styles.itemHead}>
                                            <span className={styles.company}>{edu.company}</span>
                                            <span className={styles.time}>{edu.time}</span>
                                        </div>
                                        <div className={styles.role}>{edu.role}</div>
                                    </article>
                                ))}
                            </div>
                        </div>
                    </section>
                </section>
            </main>
        </div>
    );
}

export default CVViewer;