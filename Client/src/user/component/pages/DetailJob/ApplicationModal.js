import React, { useState, useContext } from 'react';
import styles from './ApplicationModal.module.scss';
import { AuthContext } from '~/context/AuthContext';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const ApplicationModal = ({ isOpen, onClose, jobData, onSubmit }) => {
    const { api, language, user } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        coverLetter: '',
        cv: null
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const isEmployerAccount = user?.type === 'employer';
    const employerApplyBlockedMessage =
        language === 'vi'
            ? 'Tai khoan nha tuyen dung khong the nop CV ung tuyen. Vui long dung tai khoan sinh vien/ung vien.'
            : 'Employer accounts cannot submit job applications. Please use a student/candidate account.';

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Kiểm tra định dạng file
            const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (!allowedTypes.includes(file.type)) {
                alert('Chỉ chấp nhận file PDF, DOC, DOCX');
                return;
            }
            // Kiểm tra kích thước file (5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('File không được vượt quá 5MB');
                return;
            }
            setFormData(prev => ({
                ...prev,
                cv: file
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isEmployerAccount) {
            alert(employerApplyBlockedMessage);
            return;
        }
        
        // Validate form
        if (!formData.fullName || !formData.email || !formData.phone || !formData.cv) {
            alert('Vui lòng điền đầy đủ thông tin và chọn CV');
            return;
        }

        setIsSubmitting(true);
        
        try {
            const submitData = new FormData();
            submitData.append('jobId', jobData._id);
            submitData.append('fullName', formData.fullName);
            submitData.append('email', formData.email);
            submitData.append('phone', formData.phone);
            submitData.append('coverLetter', formData.coverLetter);
            submitData.append('cv', formData.cv);

            const response = await api.post('applications/apply-with-details', submitData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.status) {
                alert('Ứng tuyển thành công!');
                onSubmit();
                onClose();
                // Reset form
                setFormData({
                    fullName: '',
                    email: '',
                    phone: '',
                    coverLetter: '',
                    cv: null
                });
            }
        } catch (error) {
            console.error('Error applying:', error);
            if (error.response?.data?.message) {
                alert(error.response.data.message);
            } else {
                alert('Có lỗi xảy ra khi ứng tuyển');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className={cx('modalOverlay')} onClick={onClose}>
            <div className={cx('modalContent')} onClick={(e) => e.stopPropagation()}>
                <div className={cx('modalHeader')}>
                    <h2>Ứng tuyển vị trí</h2>
                    <button className={cx('closeBtn')} onClick={onClose}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                <div className={cx('jobInfo')}>
                    <div className={cx('jobTitle')}>{jobData?.title}</div>
                    <div className={cx('companyName')}>{jobData?.company_name}</div>
                </div>

                <form onSubmit={handleSubmit} className={cx('applicationForm')}>
                    <div className={cx('formGroup')}>
                        <label htmlFor="fullName">Họ và tên *</label>
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            placeholder="Nhập họ và tên của bạn"
                            required
                        />
                    </div>

                    <div className={cx('formGroup')}>
                        <label htmlFor="email">Email *</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Nhập email của bạn"
                            required
                        />
                    </div>

                    <div className={cx('formGroup')}>
                        <label htmlFor="phone">Số điện thoại *</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="Nhập số điện thoại của bạn"
                            required
                        />
                    </div>

                    <div className={cx('formGroup')}>
                        <label htmlFor="cv">CV của bạn *</label>
                        <div className={cx('fileUpload')}>
                            <input
                                type="file"
                                id="cv"
                                name="cv"
                                onChange={handleFileChange}
                                accept=".pdf,.doc,.docx"
                                required
                            />
                            <div className={cx('fileUploadText')}>
                                {formData.cv ? formData.cv.name : 'Chọn file CV (PDF, DOC, DOCX - tối đa 5MB)'}
                            </div>
                        </div>
                    </div>

                    <div className={cx('formGroup')}>
                        <label htmlFor="coverLetter">Thư xin việc</label>
                        <textarea
                            id="coverLetter"
                            name="coverLetter"
                            value={formData.coverLetter}
                            onChange={handleInputChange}
                            placeholder="Viết thư xin việc của bạn (tùy chọn)"
                            rows="4"
                        />
                    </div>

                    <div className={cx('formActions')}>
                        <button 
                            type="button" 
                            className={cx('cancelBtn')} 
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                            Hủy
                        </button>
                        <button 
                            type="submit" 
                            className={cx('submitBtn')}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Đang gửi...' : 'Gửi ứng tuyển'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ApplicationModal;
