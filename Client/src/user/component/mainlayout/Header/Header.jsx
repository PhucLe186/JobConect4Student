import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import style from './Header.module.scss';
import routesconfig from '~/config/routes';

const cx = classNames.bind(style);

const Header = () => {
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
                        <span className={cx('brand-text')}>JobConnect4Students</span>
                    </div>
                    <div className={cx('nav-menu')}>
                        <a href="#" className={cx('nav-link')}>{t.company}</a>
                        <a href="#" className={cx('nav-link')}>{t.jobs}</a>
                        <a href="#" className={cx('nav-link')}>{t.community}</a>
                        <a href="#" className={cx('nav-link')}>{t.contact}</a>
                    </div>
                    <div className={cx('nav-actions')}>
                        <button onClick={() => {
                            console.log('Test button clicked');
                            setIsLoggedIn(!isLoggedIn);
                            setUser({ name: 'Test User' });
                        }} style={{marginRight: '10px', background: 'red', color: 'white', padding: '5px'}}>
                            Test Login
                        </button>
                        {isLoggedIn ? (
                            <div className={cx('user-menu')}>
                                <div 
                                    className={cx('user-avatar')} 
                                    onClick={() => setShowDropdown(!showDropdown)}
                                >
                                    {user?.avatar ? (
                                        <img src={user.avatar} alt="User" className={cx('avatar-img')} />
                                    ) : (
                                        <div className={cx('avatar-placeholder')}>
                                            {user?.name?.charAt(0) || 'U'}
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
                                <Link to={routesconfig.login} className={cx('btn-login')}>{t.signIn}</Link>
                                <Link to={routesconfig.register} className={cx('btn-register')}>{t.signUp}</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Header;