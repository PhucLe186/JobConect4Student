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
        <div>
            <div className="container mt-4">
                <button className="btn btn-secondary mb-3" onClick={() => onPageChange(1)}>
                    <i className="fa-solid fa-arrow-left me-2"></i>
                    {t.back}
                </button>

                <div className="cv-builder-container">
                    <h2 className="text-center mb-4">{t.cvBuilder}</h2>

                    <div className="row">
                        <div className="col-md-6">
                            <div className="cv-form">
                                <h4>{t.personalInfo}</h4>

                                <div className="mb-3">
                                    <label className="form-label">{t.fullName}</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={formData.fullName}
                                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">{t.email}</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">{t.phone}</label>
                                    <input
                                        type="tel"
                                        className="form-control"
                                        value={formData.phone}
                                        onChange={(e) => handleInputChange('phone', e.target.value)}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">{t.address}</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={formData.address}
                                        onChange={(e) => handleInputChange('address', e.target.value)}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">{t.objective}</label>
                                    <textarea
                                        className="form-control"
                                        rows="3"
                                        value={formData.objective}
                                        onChange={(e) => handleInputChange('objective', e.target.value)}
                                    ></textarea>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">{t.education}</label>
                                    <textarea
                                        className="form-control"
                                        rows="3"
                                        value={formData.education}
                                        onChange={(e) => handleInputChange('education', e.target.value)}
                                    ></textarea>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">{t.experience}</label>
                                    <textarea
                                        className="form-control"
                                        rows="4"
                                        value={formData.experience}
                                        onChange={(e) => handleInputChange('experience', e.target.value)}
                                    ></textarea>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">{t.skills}</label>
                                    <textarea
                                        className="form-control"
                                        rows="3"
                                        value={formData.skills}
                                        onChange={(e) => handleInputChange('skills', e.target.value)}
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="cv-preview">
                                <h4>{t.preview}</h4>
                                <div className="cv-template">
                                    <div className="cv-header">
                                        <h3>{formData.fullName || 'Your Name'}</h3>
                                        <div className="contact-info">
                                            <p>
                                                <i className="fa-solid fa-envelope"></i>{' '}
                                                {formData.email || 'your.email@example.com'}
                                            </p>
                                            <p>
                                                <i className="fa-solid fa-phone"></i>{' '}
                                                {formData.phone || '+84 xxx xxx xxx'}
                                            </p>
                                            <p>
                                                <i className="fa-solid fa-location-dot"></i>{' '}
                                                {formData.address || 'Your Address'}
                                            </p>
                                        </div>
                                    </div>

                                    {formData.objective && (
                                        <div className="cv-section">
                                            <h5>Career Objective</h5>
                                            <p>{formData.objective}</p>
                                        </div>
                                    )}

                                    {formData.education && (
                                        <div className="cv-section">
                                            <h5>Education</h5>
                                            <p>{formData.education}</p>
                                        </div>
                                    )}

                                    {formData.experience && (
                                        <div className="cv-section">
                                            <h5>Experience</h5>
                                            <p>{formData.experience}</p>
                                        </div>
                                    )}

                                    {formData.skills && (
                                        <div className="cv-section">
                                            <h5>Skills</h5>
                                            <p>{formData.skills}</p>
                                        </div>
                                    )}
                                </div>

                                <div className="cv-actions mt-3">
                                    <button className="btn btn-success btn-lg w-100">
                                        <i className="fa-solid fa-download me-2"></i>
                                        {t.download}
                                    </button>
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
