import React from 'react';
import classNames from 'classnames/bind';
import style from './Login.module.scss';

const cx = classNames.bind(style);

const Login = () => {
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Login submitted');
    };

    return (
        <div className={cx('Login')}>
            <div className={cx('form-wrapper')}>
                <div className={cx('form-box')}>
                    <div className={cx('welcome-panel')}>
                <h2>Hello, Welcome!</h2>
                <p>Don't have an account? Sign up now!</p>
                <button className={cx('register-btn')}>Register</button>
            </div>
            <div className={cx('login-panel')}>
                <form onSubmit={handleSubmit}>
                    <h1>Login</h1>
                    <div className={cx('input-box')}>
                        <input type="text" placeholder="Username" required />
                        <i className={cx('fa-solid fa-user')}></i>
                    </div>
                    <div className={cx('input-box')}>
                        <input type="password" placeholder="Password" required />
                        <i className={cx('fa-solid fa-lock')}></i>
                    </div>
                    <div className={cx('forgot-link')}>
                        <a href="#">Forgot Password?</a>
                    </div>
                    <button type="submit" className={cx('btn')}>
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
        </div>
    );
};

export default Login;
