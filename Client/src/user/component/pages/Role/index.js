import React from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import style from './Role.module.scss';
import routesconfig from '~/config/routes';

const cx = classNames.bind(style);
const RoleSelection = ({ onRoleSelect }) => {
    const navigate = useNavigate();

    const handleRoleSelect = (role) => {
        console.log('Selected role:', role);
        // Save selected role to localStorage
        localStorage.setItem('selectedRole', role);
        navigate(routesconfig.register);
    };
    return (
        <div className={cx('role-selection-container')}>
            <div className={cx('role-selection-box')}>
                <button className={cx('back-btn')} onClick={() => window.history.back()}>
                    <i className={cx('fa-solid fa-arrow-left')}></i>
                </button>
                <h1>Choose Your Role</h1>
                <p>Please select your role to continue</p>
                <div className={cx('role-options')}>
                    <div className={cx('role-card')} onClick={() => handleRoleSelect('student')}>
                        <i className={cx('fa-solid fa-graduation-cap')}></i>
                        <h3>Student</h3>
                        <p>Looking for jobs and internships</p>
                    </div>
                    <div className={cx('role-card')} onClick={() => handleRoleSelect('employer')}>
                        <i className={cx('fa-solid fa-building')}></i>
                        <h3>Employer</h3>
                        <p>Hiring talented individuals</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoleSelection;
