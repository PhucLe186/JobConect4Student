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
        <div className={cx('form-box', 'Login')}>
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
                <p>or Login with social platforms</p>
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
    );
};

export default Login;
