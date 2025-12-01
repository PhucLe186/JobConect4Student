import React from 'react';
import classNames from 'classnames/bind';
import { useAdminLanguage } from '../../../Context/AdminLanguageContext';
import adminTranslations from '../../../Translation/AdminTranslations';
import styles from './Sidebar.module.scss';
import Menu from '../Header/Menu/Menu';
import MenuItem from '../Header/Menu/MenuItem';
const cx = classNames.bind(styles);

const Sidebar = () => {
    const { language } = useAdminLanguage();
    const t = adminTranslations[language];
    
    const page = [
        { href: '/dashboard', title: t.dashboard },
        { href: '/jobManagement', title: t.jobManagement },
        { href: '/userManagement', title: t.userManagement },
        { href: '/forumManagement', title: t.forumManagement },
    ];
    return (
        <div className={cx('admin-sidebar')}>
            <div className={cx('admin-logo')}>
                <h2>{t.adminTitle}</h2>
            </div>
            <Menu>
                {page.map((label, idx) => (
                    <MenuItem to={label.href} title={label.title} />
                ))}
            </Menu>
        </div>
    );
};

export default Sidebar;
