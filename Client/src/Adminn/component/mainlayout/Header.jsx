import React from 'react';
import classNames from 'classnames/bind';
import styles from './Header.module.scss';
const cx = classNames.bind(styles);

const Header = ({ t, showUserMenu, setShowUserMenu, setShowLanguageModal, setShowLogoutPopup }) => {
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
                        <div className={cx('dropdown-item')} onClick={() => alert(t.forgotPasswordFunction)}>
                            {t.forgotPassword}
                        </div>
                        <div className={cx('dropdown-item')} onClick={() => setShowLogoutPopup(true)}>
                            {t.logout}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Header;
