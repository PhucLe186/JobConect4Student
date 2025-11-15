import React, { useState } from 'react';
import classNames from 'classnames/bind';
import style from './Register.module.scss';
const cx = classNames.bind(style);
const RegisterForm = ({ handleSubmit, switchToLogin }) => {
    const [genderSelected, setGenderSelected] = useState(false);

    return (
        <div className={cx('form-box', 'Register')}>
            <form onSubmit={(e) => handleSubmit(e, 'Register')}>
                <h1>Registration</h1>
                <div className={cx('input-box')}>
                    <input type="text" placeholder="Username" required />
                    <i className={cx('fa-solid fa-user')}></i>
                </div>
                <div className={cx('input-box')}>
                    <input type="email" placeholder="Email" required />
                    <i className={cx('fa-solid fa-envelope')}></i>
                </div>
                <div className={cx('input-box')}>
                    <input type="password" placeholder="Password" required />
                    <i className={cx('fa-solid fa-lock')}></i>
                </div>
                <div className={cx('input-row')}>
                    <div className={cx('input-box', 'half-width')}>
                        <input type="date" required />
                        <i className={cx('fa-solid fa-calendar')}></i>
                    </div>
                    <div className={cx('input-box', 'half-width')}>
                        <select required onChange={(e) => setGenderSelected(e.target.value !== '')}>
                            <option value="">Select Gender</option>
                            <option value="male">♂️ Male</option>
                            <option value="female">♀️ Female</option>
                            <option value="other">⚧️ Other</option>
                        </select>
                        {!genderSelected && <i className={cx('fa-solid fa-venus-mars')}></i>}
                    </div>
                </div>
                <button type="submit" className={cx('btn')}>
                    Register
                </button>
                <p>or register with social platforms</p>
                <div className={cx('social-icons')}>
                    <a href="#">
                        <i className={cx('fa-brands fa-google')}></i>
                    </a>
                    <a href="#">
                        <i className={cx('fa-brands fa-facebook')}></i>
                    </a>
                </div>
            </form>

            <div className={cx('Toggle-panel', 'Toggle-left')}>
                <h1>Hello, Welcome!</h1>
                <p>Don't have an account? Sign up now!</p>
                <button className={cx('btn', 'register-btn')} onClick={switchToLogin}>
                    Login
                </button>
            </div>
        </div>
    );
};

export default RegisterForm;
