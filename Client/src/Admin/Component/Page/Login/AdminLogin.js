import React, { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './AdminLogin.module.scss';
import { authAPI } from '../../../../services/api';
const cx = classNames.bind(styles);

const AdminLogin = ({ onLogin }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await authAPI.login(formData);
            if (response.token) {
                localStorage.setItem('token', response.token);
                localStorage.setItem('user', JSON.stringify(response.user));
                onLogin();
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Email hoặc mật khẩu không đúng!');
        }
    };

    return (
        <div className={cx('admin-login-container')}>
            <div className={cx('login-card')}>
                <div className={cx('login-header')}>
                    <h2>JobConnect Admin</h2>
                    <p>Đăng nhập vào hệ thống quản trị</p>
                </div>

                <form onSubmit={handleSubmit} className={cx('login-form')}>
                    <div className={cx('form-group')}>
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            placeholder="Nhập email"
                        />
                    </div>

                    <div className={cx('form-group')}>
                        <label>Mật khẩu</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                            placeholder="Nhập mật khẩu"
                        />
                    </div>

                    <button type="submit" className={cx('login-btn')}>
                        Đăng nhập
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
