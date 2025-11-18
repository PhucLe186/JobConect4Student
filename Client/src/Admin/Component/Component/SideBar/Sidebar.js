import React from 'react';
import classNames from 'classnames/bind';
import styles from './Sidebar.module.scss';
import Menu from '../Header/Menu/Menu';
import MenuItem from '../Header/Menu/MenuItem';
const cx = classNames.bind(styles);

const Sidebar = () => {
    const page = [
        { href: '/dashboard', title: 'Dashboard' },
        { href: '/jobManagement', title: 'jobManagement' },
        { href: '/userManagement', title: 'userManagement' },
        { href: '/forumManagement', title: 'forumManagement' },
    ];
    return (
        <div className={cx('admin-sidebar')}>
            <div className={cx('admin-logo')}>
                <h2>JobConnect Admin</h2>
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
