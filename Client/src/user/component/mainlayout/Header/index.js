import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './Header.module.scss';
import routesconfig from '~/config/routes';

const cx = classNames.bind(styles);

function Header() {
    const [language, setLanguage] = useState('vi');

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
                        <Link to={routesconfig.company} className={cx('nav-link')}>{t.company}</Link>
                        <Link to={routesconfig.jobs} className={cx('nav-link')}>{t.jobs}</Link>
                        <Link to={routesconfig.community} className={cx('nav-link')}>{t.community}</Link>
                        <Link to={routesconfig.cvBuilder} className={cx('nav-link')}>CV Builder</Link>
                        <Link to={routesconfig.contact} className={cx('nav-link')}>{t.contact}</Link>
                    </div>
                    <div className={cx('nav-actions')}>
                        <Link to={routesconfig.login} className={cx('btn-login')}>{t.signIn}</Link>
                        <Link to={routesconfig.role} className={cx('btn-register')}>{t.signUp}</Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Header;
