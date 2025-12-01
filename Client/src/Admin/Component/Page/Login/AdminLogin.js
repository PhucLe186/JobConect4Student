import React, { useState } from 'react';
import classNames from 'classnames/bind';
import { useNavigate } from 'react-router-dom';
import { AdminAPI } from '../../../Service/AdminAPI';
import styles from './AdminLogin.module.scss';
const cx = classNames.bind(styles);

const AdminLogin = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            console.log('Sending login data:', formData);
            const result = await AdminAPI.login(formData);
            console.log('Login result:', result);
            if (result.success) {
                localStorage.setItem('adminToken', result.token);
                localStorage.setItem('adminUser', JSON.stringify(result.admin));
                navigate('/dashboard');
            } else {
                alert(result.message || 'Đăng nhập thất bại!');
            }
        } catch (error) {
            alert('Lỗi kết nối! Vui lòng thử lại.');
        } finally {
            setLoading(false);
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
                        <label>Tên đăng nhập</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            required
                            placeholder="Nhập tên đăng nhập"
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

                    <button type="submit" className={cx('login-btn')} disabled={loading}>
                        {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
