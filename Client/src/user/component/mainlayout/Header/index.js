import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './header.module.scss';
import routesconfig from '~/routes/routes';
import { AuthContext } from '~/context/AuthContext';
import Menu from './menu/Menu';
import MenuItem from './menu/MenuList';
import translations from '~/component/Translation';
import vietnamFlag from '../../../../asset/img/vietnam-flag.svg';
import ukFlag from '../../../../asset/img/uk-flag.svg';


const cx = classNames.bind(styles);

function Header() {
    const {language, updateLang}= useContext(AuthContext);
    const {user, logout} = useContext(AuthContext);
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);

    const handleLogout = async(e) => {
            e.preventDefault();
            await logout()
    };
    const t = translations[language|| 'vi'];

    const page=[
        { href: routesconfig.company, title: t.company },
        { href: routesconfig.jobs, title: t.jobs },
        { href: routesconfig.jobSuggestions, title: language === 'vi' ? 'Gợi ý công việc' : 'Job Suggestions' },
        { href: routesconfig.community, title: t.community},
        { href: routesconfig.contact, title: t.contact },
        { href: routesconfig.cvBuilder, title: t.cvBuilder},
    ]
   
    const userMenuItems = user
    ? user.type === 'student'
        ? [
            { href: routesconfig.studentprofile, title: t.studentProfile },
            { href: routesconfig.applicationhistory, title: t.applicationHistory }
        ]
        : [
            { href: routesconfig.CandidateManagement, title: t.candidateManagement },
            { href: routesconfig.NTDJobManagement, title: t.jobManagement },
            { href: routesconfig.NTDprofile, title: t.companyProfile },
        ]
    : [];

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
                    <Menu>
                        {page.map((item, idx)=> (
                            <MenuItem key={idx} to={item.href} title={item.title} />
                        ))}
                    </Menu>
                    <div className={cx('nav-actions')}>
                        {user ? (
                            <div className={cx('user-menu')}>
                                <div className={cx('user-avatar')} onClick={() => setShowDropdown(!showDropdown)}>
                                    {user?.avatar ? (
                                        <img src={user.avatar} alt="User" className={cx('avatar-img')} />
                                    ) : (
                                        <div className={cx('avatar-placeholder')}>
                                            {user?.type === 'employer' ? (
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
                                        {user && (
                                            userMenuItems?.map((item, idx)=> (
                                                <button
                                                key={idx}
                                                    className={cx('dropdown-item')}
                                                    onClick={() => navigate(item.href)}
                                                >
                                                    {item.title}
                                                </button>
                                            ))
                                        )}
                                        <div className={cx('dropdown-divider')}></div>
                                        <button
                                            className={cx('dropdown-item', 'logout-btn')}
                                            onClick={(e) => {
                                                handleLogout(e);
                                                setShowDropdown(false);
                                                navigate(routesconfig.home);
                                            }}
                                        >
                                            t.Logout
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
                        {user && <button
                            className={cx('header__lang-btn')}
                            onClick={()=> updateLang()}
                           
                        >
                            <img
                                src={language === 'vi' ? vietnamFlag : ukFlag}
                                alt={language === 'vi' ? 'VI' : 'EN'}
                                className={cx('header__flag')}
                            />
                        </button>}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Header;
