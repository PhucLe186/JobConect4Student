import React, { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './Header.module.scss';
const cx = classNames.bind(styles);

const Header = () => {
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showLanguageModal, setShowLanguageModal] = useState(false);
    const [showLogoutPopup, setShowLogoutPopup] = useState(false);
    return (
        <div className={cx('admin-header')}>
            <h1>adminTitle</h1>
            <div
                className={cx('admin-user')}
                onMouseEnter={() => setShowUserMenu(true)}
                onMouseLeave={() => setShowUserMenu(false)}
            >
                <span className={cx('user-name')}>Minh Trí ▼</span>
                {showUserMenu && (
                    <div className={cx('user-dropdown')}>
                        <div className={cx('dropdown-item')} onClick={() => setShowLanguageModal(true)}>
                            language
                        </div>
                        <div className={cx('dropdown-item')}>forgotPassword</div>
                        <div className={cx('dropdown-item')} onClick={() => setShowLogoutPopup(true)}>
                            logout
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Header;
