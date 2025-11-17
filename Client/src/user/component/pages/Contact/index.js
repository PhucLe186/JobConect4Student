import React, { useState } from 'react';
import styles from './Contact.module.scss';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.');
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Trung tâm Hỗ trợ</h1>
                <p>Chúng tôi luôn sẵn sàng hỗ trợ bạn. Hãy gửi câu hỏi hoặc phản hồi của bạn.</p>
            </div>

            <div className={styles.content}>
                <div className={styles.layout}>
                    <div className={styles.leftColumn}>
                        <div className={styles.formContainer}>
                            <h2>Liên hệ với chúng tôi</h2>
                            
                            <form onSubmit={handleSubmit}>
                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label>Họ và tên</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Chủ đề</label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Tin nhắn</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        rows="6"
                                        required
                                    />
                                </div>

                                <button type="submit" className={styles.submitButton}>
                                    Gửi tin nhắn
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className={styles.rightColumn}>
                        <div className={styles.infoCard}>
                            <h3>Thông tin liên hệ</h3>
                            
                            <div className={styles.contactItem}>
                                <div className={styles.itemHeader}>
                                    <span className={styles.icon}>📍</span>
                                    <strong>Địa chỉ:</strong>
                                </div>
                                <p>497 Hoa Hao Street, Ward 7, District 10, Ho Chi Minh City</p>
                            </div>

                            <div className={styles.contactItem}>
                                <div className={styles.itemHeader}>
                                    <span className={styles.icon}>📞</span>
                                    <strong>Điện thoại:</strong>
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
                                    <strong>Giờ làm việc:</strong>
                                </div>
                                <p>Thứ 2 - Thứ 6: 8:00 - 17:30</p>
                            </div>
                        </div>

                        <div className={styles.infoCard}>
                            <h3>Câu hỏi thường gặp</h3>
                            
                            <div className={styles.faqItem}>
                                <h4>Làm thế nào để ứng tuyển?</h4>
                                <p>Bạn có thể ứng tuyển bằng cách bấm nút "Ứng tuyển ngay" trên trang chi tiết công việc.</p>
                            </div>

                            <div className={styles.faqItem}>
                                <h4>Làm thế nào để tạo tài khoản?</h4>
                                <p>Bấm nút "Đăng ký" ở góc trên bên phải và điền thông tin cần thiết.</p>
                            </div>

                            <div className={styles.faqItem}>
                                <h4>Làm thế nào để tìm kiếm việc làm?</h4>
                                <p>Sử dụng thanh tìm kiếm và các bộ lọc để tìm công việc phù hợp với bạn.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;