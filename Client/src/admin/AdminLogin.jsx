import React, { useState } from 'react';
import './AdminLogin.scss';

const AdminLogin = ({ onLogin }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        fullName: ''
    });

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isLogin) {
            // Login logic
            if (formData.email === 'admin@jobconnect.com' && formData.password === 'admin123') {
                onLogin();
            } else {
                alert('Email hoặc mật khẩu không đúng!');
            }
        } else {
            // Register logic
            if (formData.password !== formData.confirmPassword) {
                alert('Mật khẩu xác nhận không khớp!');
                return;
            }
            alert('Đăng ký thành công! Vui lòng đăng nhập.');
            setIsLogin(true);
        }
    };

    return (
        <div className="admin-login-container">
            <div className="login-card">
                <div className="login-header">
                    <h2>JobConnect Admin</h2>
                    <p>{isLogin ? 'Đăng nhập vào hệ thống quản trị' : 'Tạo tài khoản quản trị'}</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    {!isLogin && (
                        <div className="form-group">
                            <label>Họ và tên</label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                required
                                placeholder="Nhập họ và tên"
                            />
                        </div>
                    )}

                    <div className="form-group">
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

                    <div className="form-group">
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

                    {!isLogin && (
                        <div className="form-group">
                            <label>Xác nhận mật khẩu</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                required
                                placeholder="Nhập lại mật khẩu"
                            />
                        </div>
                    )}

                    <button type="submit" className="login-btn">
                        {isLogin ? 'Đăng nhập' : 'Đăng ký'}
                    </button>
                </form>

                <div className="login-footer">
                    <p>
                        {isLogin ? 'Chưa có tài khoản? ' : 'Đã có tài khoản? '}
                        <span 
                            className="toggle-link" 
                            onClick={() => setIsLogin(!isLogin)}
                        >
                            {isLogin ? 'Đăng ký ngay' : 'Đăng nhập'}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;