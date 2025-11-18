import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './header.module.scss';
import routesconfig from '~/config/routes';

const cx = classNames.bind(styles);

function Header() {
    const [language, setLanguage] = useState('vi');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);

    // Check login status from localStorage
    useEffect(() => {
        const checkLoginStatus = () => {
            const loginStatus = localStorage.getItem('isLoggedIn');
            const userData = localStorage.getItem('userData');
            console.log('Checking login status:', loginStatus, userData);
            if (loginStatus === 'true') {
                setIsLoggedIn(true);
                setUser(userData ? JSON.parse(userData) : { name: 'User' });
            } else {
                setIsLoggedIn(false);
                setUser(null);
            }
        };

        checkLoginStatus();

        // Listen for storage changes
        window.addEventListener('storage', checkLoginStatus);

        // Custom event listener for same-tab changes
        window.addEventListener('loginStatusChanged', checkLoginStatus);

        return () => {
            window.removeEventListener('storage', checkLoginStatus);
            window.removeEventListener('loginStatusChanged', checkLoginStatus);
        };
    }, []);

    const logout = () => {
        setIsLoggedIn(false);
        setUser(null);
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userData');
    };

    console.log('Header - isLoggedIn:', isLoggedIn, 'user:', user);

    const translations = {
        vi: {
            company: 'Công ty',
            jobs: 'Việc làm',
            community: 'Cộng đồng',
            contact: 'Liên hệ',
            signIn: 'Đăng nhập',
            signUp: 'Đăng ký',
        },
        en: {
            company: 'Company',
            jobs: 'Jobs',
            community: 'Community',
            contact: 'Contact',
            signIn: 'Log In',
            signUp: 'Sign Up',
        },
    };

    const t = translations[language];

    return (
        <nav className={cx('navbar')}>
            <div className={cx('container')}>
                <div className={cx('nav-content')}>
                    <div className={cx('nav-brand')}>
                        <Link to={routesconfig.home} className={cx('brand-text')}>
                            <span style={{ color: '#007bff' }}>JobConnect</span>
                            <span style={{ color: '#28a745' }}>4Students</span>
                        </Link>
                    </div>
                    <div className={cx('nav-menu')}>
                        <Link to={routesconfig.company} className={cx('nav-link')}>
                            {t.company}
                        </Link>
                        <Link to={routesconfig.jobs} className={cx('nav-link')}>
                            {t.jobs}
                        </Link>
                        <Link to={routesconfig.community} className={cx('nav-link')}>
                            {t.community}
                        </Link>
                        <Link to={routesconfig.cvBuilder} className={cx('nav-link')}>
                            CV Builder
                        </Link>
                        <Link to={routesconfig.contact} className={cx('nav-link')}>
                            {t.contact}
                        </Link>
                    </div>
                    <div className={cx('nav-actions')}>
                        {isLoggedIn ? (
                            <div className={cx('user-menu')}>
                                <div className={cx('user-avatar')} onClick={() => setShowDropdown(!showDropdown)}>
                                    {user?.avatar ? (
                                        <img src={user.avatar} alt="User" className={cx('avatar-img')} />
                                    ) : (
                                        <div className={cx('avatar-placeholder')}>
                                            {user?.role === 'employer' ? (
                                                <i className="fas fa-building"></i>
                                            ) : (
                                                <i className="fas fa-graduation-cap"></i>
                                            )}
                                        </div>
                                    )}
                                </div>
                                {showDropdown && (
                                    <div className={cx('dropdown-menu')}>
                                        <div className={cx('dropdown-item')}>{user?.name || 'User'}</div>
                                        <div className={cx('dropdown-divider')}></div>
                                        <button
                                            className={cx('dropdown-item', 'logout-btn')}
                                            onClick={() => {
                                                logout();
                                                setShowDropdown(false);
                                                navigate(routesconfig.home);
                                            }}
                                        >
                                            Đăng xuất
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <Link to={routesconfig.login} className={cx('btn-login')}>
                                    {t.signIn}
                                </Link>
                                <Link to={routesconfig.role} className={cx('btn-register')}>
                                    {t.signUp}
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Header;
