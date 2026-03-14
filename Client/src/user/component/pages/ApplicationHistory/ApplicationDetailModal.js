import React from 'react';
import styles from './ApplicationDetailModal.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const ApplicationDetailModal = ({ isOpen, onClose, application, language = 'vi' }) => {
    if (!isOpen || !application) return null;

    const getStatusText = (status) => {
        switch (status) {
            case 'accepted': return 'Đã chấp nhận';
            case 'rejected': return 'Đã từ chối';
            case 'viewed': return 'Đã xem';
            case 'sent': return 'Đã gửi';
            default: return 'Không xác định';
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'accepted': return 'status--accepted';
            case 'rejected': return 'status--rejected';
            case 'viewed': return 'status--viewed';
            case 'sent': return 'status--sent';
            default: return 'status--sent';
        }
    };

    return (
        <div className={cx('modalOverlay')} onClick={onClose}>
            <div className={cx('modalContent')} onClick={(e) => e.stopPropagation()}>
                <div className={cx('modalHeader')}>
                    <h2>Chi tiết ứng tuyển</h2>
                    <button className={cx('closeBtn')} onClick={onClose}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                <div className={cx('modalBody')}>
                    <div className={cx('section')}>
                        <h3>Thông tin công việc</h3>
                        <div className={cx('jobInfo')}>
                            <div className={cx('companyInfo')}>
                                {application.companyLogo && (
                                    <img 
                                        src={application.companyLogo} 
                                        alt={application.companyName}
                                        className={cx('companyLogo')}
                                    />
                                )}
                                <div>
                                    <div className={cx('jobTitle')}>{application.jobTitle}</div>
                                    <div className={cx('companyName')}>{application.companyName}</div>
                                </div>
                            </div>
                            <div className={cx('applicationStatus')}>
                                <span className={cx('statusBadge', getStatusClass(application.status))}>
                                    {getStatusText(application.status)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className={cx('section')}>
                        <h3>Thông tin ứng viên</h3>
                        <div className={cx('candidateInfo')}>
                            <div className={cx('infoRow')}>
                                <span className={cx('label')}>Họ và tên:</span>
                                <span className={cx('value')}>{application.full_name || 'N/A'}</span>
                            </div>
                            <div className={cx('infoRow')}>
                                <span className={cx('label')}>Email:</span>
                                <span className={cx('value')}>{application.email || 'N/A'}</span>
                            </div>
                            <div className={cx('infoRow')}>
                                <span className={cx('label')}>Số điện thoại:</span>
                                <span className={cx('value')}>{application.phone || 'N/A'}</span>
                            </div>
                            <div className={cx('infoRow')}>
                                <span className={cx('label')}>Ngày ứng tuyển:</span>
                                <span className={cx('value')}>
                                    {new Date(application.applied_at).toLocaleDateString('vi-VN')}
                                </span>
                            </div>
                        </div>
                    </div>

                    {application.cover_letter && (
                        <div className={cx('section')}>
                            <h3>Thư xin việc</h3>
                            <div className={cx('coverLetter')}>
                                {application.cover_letter}
                            </div>
                        </div>
                    )}

                    {application.cv_file_path && (
                        <div className={cx('section')}>
                            <h3>CV đã nộp</h3>
                            <div className={cx('cvInfo')}>
                                <i className="fas fa-file-pdf"></i>
                                <span>CV_{application.full_name}_{new Date(application.applied_at).toLocaleDateString('vi-VN')}</span>
                                <button className={cx('downloadBtn')}>
                                    <i className="fas fa-download"></i>
                                    Tải xuống
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className={cx('modalFooter')}>
                    <button className={cx('closeButton')} onClick={onClose}>
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ApplicationDetailModal;