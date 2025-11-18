import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import classNames from 'classnames/bind';
import style from './Login.module.scss';
import routesconfig from '~/routes/routes';

const cx = classNames.bind(style);

const Login = () => {
    const navigate = useNavigate();

    const handleLogin = () => {
        console.log('Login submitted');

        // Get selected role from localStorage
        const selectedRole = localStorage.getItem('selectedRole') || 'student';
        const userName = selectedRole === 'employer' ? 'Nhà tuyển dụng' : 'Người dùng';

        // Save login status to localStorage
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem(
            'userData',
            JSON.stringify({
                name: userName,
                role: selectedRole,
                avatar: null,
            }),
        );
        console.log('Login saved to localStorage, navigating to home...');

        // Dispatch custom event to notify Header
        window.dispatchEvent(new Event('loginStatusChanged'));

        // Navigate to home after login
        navigate(routesconfig.home);
    };

    return (
        <motion.div
            className={cx('Login')}
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
            <div className={cx('form-wrapper')}>
                <div className={cx('form-box')}>
                    <div className={cx('welcome-panel')}>
                        <h2>Hello, Welcome!</h2>
                        <p>Don't have an account? Sign up now!</p>
                        <Link to={routesconfig.register} className={cx('register-btn')}>
                            REGISTER
                        </Link>
                    </div>
                    <div className={cx('login-panel')}>
                        <form>
                            <h1>Login</h1>
                            <div className={cx('input-box')}>
                                <input type="text" placeholder="Username" />
                                <i className={cx('fa-solid fa-user')}></i>
                            </div>
                            <div className={cx('input-box')}>
                                <input type="password" placeholder="Password" />
                                <i className={cx('fa-solid fa-lock')}></i>
                            </div>
                            <div className={cx('forgot-link')}>
                                <a href="#">Forgot Password?</a>
                            </div>
                            <button type="button" className={cx('btn')} onClick={handleLogin}>
                                Login
                            </button>
                            <div className={cx('social-text')}>or Login with social platforms</div>
                            <div className={cx('social-icons')}>
                                <a href="#">
                                    <i className={cx('fa-brands fa-google')}></i>
                                </a>
                                <a href="#">
                                    <i className={cx('fa-brands fa-facebook')}></i>
                                </a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Login;
