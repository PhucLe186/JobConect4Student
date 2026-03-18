import React, { useState, useContext } from 'react';
import styles from './Contact.module.scss';
import { AuthContext } from '~/context/AuthContext';
import translations from '~/component/Translation';

const Contact = () => {
    const { language } = useContext(AuthContext);
    const t = translations[language || 'vi'];

    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(t.contactSuccessMsg);
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>{t.supportCenter}</h1>
                <p>{t.supportSubtitle}</p>
            </div>

            <div className={styles.content}>
                <div className={styles.layout}>
                    <div className={styles.leftColumn}>
                        <div className={styles.formContainer}>
                            <h2>{t.contactUs}</h2>
                            <form onSubmit={handleSubmit}>
                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label>{t.fullName}</label>
                                        <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Email</label>
                                        <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
                                    </div>
                                </div>
                                <div className={styles.formGroup}>
                                    <label>{t.subject}</label>
                                    <input type="text" name="subject" value={formData.subject} onChange={handleInputChange} required />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>{t.message}</label>
                                    <textarea name="message" value={formData.message} onChange={handleInputChange} rows="6" required />
                                </div>
                                <button type="submit" className={styles.submitButton}>{t.sendMessage}</button>
                            </form>
                        </div>
                    </div>

                    <div className={styles.rightColumn}>
                        <div className={styles.infoCard}>
                            <h3>{t.contactInfo}</h3>
                            <div className={styles.contactItem}>
                                <div className={styles.itemHeader}>
                                    <span className={styles.icon}>📍</span>
                                    <strong>{t.address}:</strong>
                                </div>
                                <p>497 Hoa Hao Street, Ward 7, District 10, Ho Chi Minh City</p>
                            </div>
                            <div className={styles.contactItem}>
                                <div className={styles.itemHeader}>
                                    <span className={styles.icon}>📞</span>
                                    <strong>{t.phone}:</strong>
                                </div>
                                <p>0943009243</p>
                            </div>
                            <div className={styles.contactItem}>
                                <div className={styles.itemHeader}>
                                    <span className={styles.icon}>✉️</span>
                                    <strong>Email:</strong>
                                </div>
                                <p>support@jobconnect4students.com</p>
                            </div>
                            <div className={styles.contactItem}>
                                <div className={styles.itemHeader}>
                                    <span className={styles.icon}>🕒</span>
                                    <strong>{t.workingHours}:</strong>
                                </div>
                                <p>{t.workingHoursValue}</p>
                            </div>
                        </div>

                        <div className={styles.infoCard}>
                            <h3>{t.faq}</h3>
                            <div className={styles.faqItem}>
                                <h4>{t.faq1Q}</h4>
                                <p>{t.faq1A}</p>
                            </div>
                            <div className={styles.faqItem}>
                                <h4>{t.faq2Q}</h4>
                                <p>{t.faq2A}</p>
                            </div>
                            <div className={styles.faqItem}>
                                <h4>{t.faq3Q}</h4>
                                <p>{t.faq3A}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
