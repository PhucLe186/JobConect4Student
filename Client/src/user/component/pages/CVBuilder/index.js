import React, { useState } from 'react';
import classNames from 'classnames/bind';
import style from './CVBuilder.module.scss';
const cx = classNames.bind(style);

const CVBuilder = ({ onPageChange }) => {
    const [language, setLanguage] = useState('vi');
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        objective: '',
        education: '',
        experience: '',
        skills: '',
    });

    const translations = {
        vi: {
            company: 'Công ty',
            jobs: 'Việc làm',
            community: 'Cộng đồng',
            contact: 'Liên hệ',
            signIn: 'Đăng nhập',
            signUp: 'Đăng ký',
            cvBuilder: 'Tạo CV Online',
            personalInfo: 'Thông tin cá nhân',
            fullName: 'Họ và tên',
            email: 'Email',
            phone: 'Số điện thoại',
            address: 'Địa chỉ',
            objective: 'Mục tiêu nghề nghiệp',
            education: 'Học vấn',
            experience: 'Kinh nghiệm',
            skills: 'Kỹ năng',
            preview: 'Xem trước CV',
            download: 'Tải xuống',
            back: 'Quay lại',
        },
        en: {
            company: 'Company',
            jobs: 'Jobs',
            community: 'Community',
            contact: 'Contact',
            signIn: 'Log In',
            signUp: 'Sign Up',
            cvBuilder: 'CV Builder',
            personalInfo: 'Personal Information',
            fullName: 'Full Name',
            email: 'Email',
            phone: 'Phone Number',
            address: 'Address',
            objective: 'Career Objective',
            education: 'Education',
            experience: 'Experience',
            skills: 'Skills',
            preview: 'CV Preview',
            download: 'Download',
            back: 'Back',
        },
    };

    const t = translations[language];

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleLogin = () => {
        window.location.href = 'http://localhost:3002?mode=login';
    };

    const handleSignup = () => {
        window.location.href = 'http://localhost:3002?mode=signup';
    };

    return (
        <div className={cx('cv-builder-page')}>
            <div className={cx('container')}>
                <button className={cx('back-btn')} onClick={() => window.history.back()}>
                    ← {t.back}
                </button>

                <div className={cx('cv-builder-container')}>
                    <h1 className={cx('page-title')}>{t.cvBuilder}</h1>

                    <div className={cx('cv-builder-content')}>
                        <div className={cx('form-section')}>
                            <div className={cx('form-card')}>
                                <h3 className={cx('section-title')}>{t.personalInfo}</h3>

                                <div className={cx('form-group')}>
                                    <label className={cx('form-label')}>{t.fullName}</label>
                                    <input
                                        type="text"
                                        className={cx('form-input')}
                                        value={formData.fullName}
                                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                                        placeholder="Nhập họ và tên"
                                    />
                                </div>

                                <div className={cx('form-group')}>
                                    <label className={cx('form-label')}>{t.email}</label>
                                    <input
                                        type="email"
                                        className={cx('form-input')}
                                        value={formData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        placeholder="example@email.com"
                                    />
                                </div>

                                <div className={cx('form-group')}>
                                    <label className={cx('form-label')}>{t.phone}</label>
                                    <input
                                        type="tel"
                                        className={cx('form-input')}
                                        value={formData.phone}
                                        onChange={(e) => handleInputChange('phone', e.target.value)}
                                        placeholder="0123 456 789"
                                    />
                                </div>

                                <div className={cx('form-group')}>
                                    <label className={cx('form-label')}>{t.address}</label>
                                    <input
                                        type="text"
                                        className={cx('form-input')}
                                        value={formData.address}
                                        onChange={(e) => handleInputChange('address', e.target.value)}
                                        placeholder="Địa chỉ của bạn"
                                    />
                                </div>

                                <div className={cx('form-group')}>
                                    <label className={cx('form-label')}>{t.objective}</label>
                                    <textarea
                                        className={cx('form-textarea')}
                                        rows="3"
                                        value={formData.objective}
                                        onChange={(e) => handleInputChange('objective', e.target.value)}
                                        placeholder="Mô tả mục tiêu nghề nghiệp của bạn..."
                                    ></textarea>
                                </div>

                                <div className={cx('form-group')}>
                                    <label className={cx('form-label')}>{t.education}</label>
                                    <textarea
                                        className={cx('form-textarea')}
                                        rows="3"
                                        value={formData.education}
                                        onChange={(e) => handleInputChange('education', e.target.value)}
                                        placeholder="Trình độ học vấn, trường học, bằng cấp..."
                                    ></textarea>
                                </div>

                                <div className={cx('form-group')}>
                                    <label className={cx('form-label')}>{t.experience}</label>
                                    <textarea
                                        className={cx('form-textarea')}
                                        rows="4"
                                        value={formData.experience}
                                        onChange={(e) => handleInputChange('experience', e.target.value)}
                                        placeholder="Kinh nghiệm làm việc, dự án đã tham gia..."
                                    ></textarea>
                                </div>

                                <div className={cx('form-group')}>
                                    <label className={cx('form-label')}>{t.skills}</label>
                                    <textarea
                                        className={cx('form-textarea')}
                                        rows="3"
                                        value={formData.skills}
                                        onChange={(e) => handleInputChange('skills', e.target.value)}
                                        placeholder="Kỹ năng chuyên môn, ngôn ngữ lập trình..."
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                        <div className={cx('preview-section')}>
                            <div className={cx('preview-card')}>
                                <h3 className={cx('section-title')}>{t.preview}</h3>
                                <div className={cx('cv-template')}>
                                    <div className={cx('cv-header')}>
                                        <h2 className={cx('cv-name')}>{formData.fullName || 'Họ và Tên'}</h2>
                                        <div className={cx('contact-info')}>
                                            <div className={cx('contact-item')}>
                                                {formData.email || 'your.email@example.com'}
                                            </div>
                                            <div className={cx('contact-item')}>{formData.phone || '0123 456 789'}</div>
                                            <div className={cx('contact-item')}>
                                                {formData.address || 'Địa chỉ của bạn'}
                                            </div>
                                        </div>
                                    </div>

                                    {formData.objective && (
                                        <div className={cx('cv-section')}>
                                            <h4 className={cx('cv-section-title')}>Mục tiêu nghề nghiệp</h4>
                                            <p className={cx('cv-content')}>{formData.objective}</p>
                                        </div>
                                    )}

                                    {formData.education && (
                                        <div className={cx('cv-section')}>
                                            <h4 className={cx('cv-section-title')}>Học vấn</h4>
                                            <p className={cx('cv-content')}>{formData.education}</p>
                                        </div>
                                    )}

                                    {formData.experience && (
                                        <div className={cx('cv-section')}>
                                            <h4 className={cx('cv-section-title')}>Kinh nghiệm</h4>
                                            <p className={cx('cv-content')}>{formData.experience}</p>
                                        </div>
                                    )}

                                    {formData.skills && (
                                        <div className={cx('cv-section')}>
                                            <h4 className={cx('cv-section-title')}>Kỹ năng</h4>
                                            <p className={cx('cv-content')}>{formData.skills}</p>
                                        </div>
                                    )}
                                </div>

                                <div className={cx('cv-actions')}>
                                    <button className={cx('download-btn')}>{t.download}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CVBuilder;
