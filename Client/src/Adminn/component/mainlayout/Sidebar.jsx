import React from 'react';
import classNames from 'classnames/bind';
import styles from './Sidebar.module.scss';
const cx = classNames.bind(styles);

const Sidebar = ({ t, activeSection, showSection }) => {
    return (
        <div className={cx('admin-sidebar')}>
            <div className={cx('admin-logo')}>
                <h2>JobConnect Admin</h2>
            </div>
            <ul>
                <li
                    className={cx(activeSection === 'dashboard' ? 'active' : '')}
                    onClick={() => showSection('dashboard')}
                >
                    Dashboard
                </li>
                <li className={cx(activeSection === 'jobs' ? 'active' : '')} onClick={() => showSection('jobs')}>
                    {t.jobManagement}
                </li>
                <li className={cx(activeSection === 'users' ? 'active' : '')} onClick={() => showSection('users')}>
                    {t.userManagement}
                </li>
                <li
                    className={cx(activeSection === 'companies' ? 'active' : '')}
                    onClick={() => showSection('companies')}
                >
                    {t.forumManagement}
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
