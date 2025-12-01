import React, { useState } from 'react';
import classNames from 'classnames/bind';
import { useNavigate } from 'react-router-dom';
import { useAdminLanguage } from '../../../Context/AdminLanguageContext';
import adminTranslations from '../../../Translation/AdminTranslations';
import { AdminAPI } from '../../../Service/AdminAPI';
import styles from './Header.module.scss';
const cx = classNames.bind(styles);

const Header = () => {
    const { language, changeLanguage } = useAdminLanguage();
    const navigate = useNavigate();
    const t = adminTranslations[language];
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showLanguageModal, setShowLanguageModal] = useState(false);
    const [showLogoutPopup, setShowLogoutPopup] = useState(false);

    const handleLogout = async () => {
        try {
            await AdminAPI.logout();
            localStorage.removeItem('adminToken');
            navigate('/admin/login');
        } catch (error) {
            console.error('Logout error:', error);
            // Vẫn đăng xuất dù có lỗi
            localStorage.removeItem('adminToken');
            navigate('/admin/login');
        }
    };
    return (
        <div className={cx('admin-header')}>
            <h1>{t.adminTitle}</h1>
            <div
                className={cx('admin-user')}
                onMouseEnter={() => setShowUserMenu(true)}
                onMouseLeave={() => setShowUserMenu(false)}
            >
                <span className={cx('user-name')}>Minh Trí ▼</span>
                {showUserMenu && (
                    <div className={cx('user-dropdown')}>
                        <div className={cx('dropdown-item')} onClick={() => setShowLanguageModal(true)}>
                            {t.language}
                        </div>
                        <div className={cx('dropdown-item')}>{t.forgotPassword}</div>
                        <div className={cx('dropdown-item')} onClick={() => setShowLogoutPopup(true)}>
                            {t.logout}
                        </div>
                    </div>
                )}
            </div>

            {/* Language Modal */}
            {showLanguageModal && (
                <div className={cx('modal-overlay')} onClick={() => setShowLanguageModal(false)}>
                    <div className={cx('language-modal')} onClick={(e) => e.stopPropagation()}>
                        <div className={cx('modal-header')}>
                            <h3> {language === 'vi' ? 'Chọn ngôn ngữ' : 'Select Language'}</h3>
                            <button className={cx('close-btn')} onClick={() => setShowLanguageModal(false)}>
                                ✕
                            </button>
                        </div>
                        <div className={cx('language-options')}>
                            <button
                                className={cx('language-btn', { active: language === 'vi' })}
                                onClick={() => {
                                    changeLanguage('vi');
                                    setShowLanguageModal(false);
                                }}
                            >
                                <span className={cx('flag')}>🇻🇳</span>
                                <span className={cx('lang-text')}>Tiếng Việt</span>
                            </button>
                            <button
                                className={cx('language-btn', { active: language === 'en' })}
                                onClick={() => {
                                    changeLanguage('en');
                                    setShowLanguageModal(false);
                                }}
                            >
                                <span className={cx('flag')}>🇺🇸</span>
                                <span className={cx('lang-text')}>English</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Logout Confirmation Popup */}
            {showLogoutPopup && (
                <div className={cx('modal-overlay')} onClick={() => setShowLogoutPopup(false)}>
                    <div className={cx('logout-popup')} onClick={(e) => e.stopPropagation()}>
                        <div className={cx('popup-header')}>
                            <h3>{t.confirmLogout || 'Xác nhận đăng xuất'}</h3>
                        </div>
                        <div className={cx('popup-content')}>
                            <p>{t.logoutMessage || 'Bạn có chắc chắn muốn đăng xuất?'}</p>
                        </div>
                        <div className={cx('popup-actions')}>
                            <button 
                                className={cx('cancel-btn')} 
                                onClick={() => setShowLogoutPopup(false)}
                            >
                                {t.cancel || 'Hủy'}
                            </button>
                            <button 
                                className={cx('confirm-btn')} 
                                onClick={() => {
                                    setShowLogoutPopup(false);
                                    handleLogout();
                                }}
                            >
                                {t.logout || 'Đăng xuất'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Header;
