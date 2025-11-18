import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import classNames from 'classnames/bind';
import style from './Register.module.scss';
import routesconfig from '~/routes/routes';

const cx = classNames.bind(style);

const RegisterForm = () => {
    const [genderSelected, setGenderSelected] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Register submitted');
        // Add registration logic here
        // After successful registration, navigate to login
        navigate(routesconfig.login);
    };

    return (
        <motion.div
            className={cx('Register')}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
            <div className={cx('register-container')}>
                <div className={cx('register-form')}>
                    <h1>Registration</h1>
                    <form onSubmit={handleSubmit}>
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
                        <div className={cx('input-box')}>
                            <input type="password" placeholder="Confirm Password" required />
                            <i className={cx('fa-solid fa-lock')}></i>
                        </div>
                        <div className={cx('input-row')}>
                            <div className={cx('input-box', 'half-width')}>
                                <input type="date" placeholder="mm/dd/yyyy" required />
                                <i className={cx('fa-solid fa-calendar')}></i>
                            </div>
                            <div className={cx('input-box', 'half-width')}>
                                <select required onChange={(e) => setGenderSelected(e.target.value !== '')}>
                                    <option value="">Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                                {!genderSelected && <i className={cx('fa-solid fa-venus-mars')}></i>}
                            </div>
                        </div>
                        <button type="submit" className={cx('register-btn')}>
                            Register
                        </button>
                        <div className={cx('social-text')}>or register with social platforms</div>
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
                <div className={cx('welcome-panel')}>
                    <h2>Welcome Back!</h2>
                    <p>Already have an Account?</p>
                    <Link to={routesconfig.login} className={cx('login-btn')}>
                        Login
                    </Link>
                </div>
            </div>
        </motion.div>
    );
};

export default RegisterForm;
