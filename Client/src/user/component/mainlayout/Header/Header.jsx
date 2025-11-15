import React, { useState } from 'react';
import classNames from 'classnames/bind';
import style from './Header.module.scss';

const cx = classNames.bind(style);

const Header = () => {
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
                        <span className={cx('brand-text')}>JobConnect4Students</span>
                    </div>
                    <div className={cx('nav-menu')}>
                        <a href="#" className={cx('nav-link')}>{t.company}</a>
                        <a href="#" className={cx('nav-link')}>{t.jobs}</a>
                        <a href="#" className={cx('nav-link')}>{t.community}</a>
                        <a href="#" className={cx('nav-link')}>{t.contact}</a>
                    </div>
                    <div className={cx('nav-actions')}>
                        <button className={cx('btn-login')}>{t.signIn}</button>
                        <button className={cx('btn-register')}>{t.signUp}</button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Header;