import { useState, useRef, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './header.module.scss';

import myLogo from '../../../../asset/img/my-logo.png';
import vietnamFlag from '../../../../asset/img/vietnam-flag.svg';
import ukFlag from '../../../../asset/img/uk-flag.svg';
import avatarPlaceholder from '../../../../asset/img/avatar-placeholder.png';


import trans__header from '../../../../component/Translation/header';

const cx = classNames.bind(styles);


function Header({ onProfileSelect, onToggleSidebar, language, onLanguageChange }) {

    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const t = trans__header[language];


    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownRef]);

    const handleProfileClick = () => {
        if (onProfileSelect) {
            onProfileSelect();
        }
        setDropdownOpen(false);
    };


    const handleLanguageToggle = () => {
        const newLang = language === 'vi' ? 'en' : 'vi';
        onLanguageChange(newLang); 
    };


    return (
        <header className={cx('header')}>
            <nav className={cx('header__nav')}>
                <div className={cx('header__container')}>
                    
                    <button 
                        className={cx('header__sidebar-toggle')} 
                        onClick={onToggleSidebar}
                    >
                        ☰
                    </button>
                    <a className={cx('header__brand')} href="/">
                        <img src={myLogo} alt="My Company Logo" className={cx('header__logo-img')} />
                    </a>
                    <ul className={cx('header__menu')}>
                        <li className={cx('header__item')}>
                            <a className={cx('header__link')} href="/companies">{t.company}</a>
                        </li>
                        <li className={cx('header__item')}>
                            <a className={cx('header__link')} href="/jobs">{t.jobs}</a>
                        </li>
                        <li className={cx('header__item')}>
                            <a className={cx('header__link')} href="/community">{t.community}</a>
                        </li>
                        <li className={cx('header__item')}>
                            <a className={cx('header__link')} href="/contact">{t.contact}</a>
                        </li>
                    </ul>


                    <div className={cx('header__actions')}>
                        <div className={cx('header__avatar-container')} ref={dropdownRef}>
                             <button className={cx('header__avatar-btn')} onClick={() => setDropdownOpen(!isDropdownOpen)}>
                                 <img
                                     src={avatarPlaceholder}
                                     alt="User Avatar"
                                     className={cx('header__avatar-img')}
                                 />
                             </button>

                             {isDropdownOpen && (
                                 <ul className={cx('header__dropdown-menu')}>
                                     <li className={cx('header__dropdown-item')}>
                                         <button
                                             type="button"
                                             className={cx('header__dropdown-link')}
                                             onClick={handleProfileClick}
                                         >
                                             {t.studentProfile}
                                         </button>
                                     </li>
                                     <li className={cx('header__dropdown-item')}>
                                         <button type="button" className={cx('header__dropdown-link')}>
                                             {t.employerProfile}
                                         </button>
                                     </li>
                                 </ul>
                             )}
                        </div>

                        <button
                            className={cx('header__lang-btn')}
                            onClick={handleLanguageToggle}
                        >
                            <img
                                src={language === 'vi' ? vietnamFlag : ukFlag}
                                alt={language === 'vi' ? 'VI' : 'EN'}
                                className={cx('header__flag')}
                            />
                        </button>
                    </div>

                </div>
            </nav>
        </header>
    );
}

export default Header;