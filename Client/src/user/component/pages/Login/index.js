import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import classNames from 'classnames/bind';
import style from './Login.module.scss';
import routesconfig from '~/routes/routes';
import { AuthContext } from '~/context/AuthContext';

const cx = classNames.bind(style);

const Login = () => {
    const navigate = useNavigate();
    const {login}= useContext(AuthContext)
    const [Data, setData]= useState({
        email:'',
        password:''
    })

    const handleLogin = async(e) => {
        e.preventDefault();
        login(Data)
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
                                <input 
                                    type="email"
                                    placeholder="Email" 
                                    value={Data.email} 
                                    onChange={e=> setData({...Data,email: e.target.value })} />
                                <i className={cx('fa-solid fa-user')}></i>
                            </div>
                            <div className={cx('input-box')}>
                                <input 
                                    type="password" 
                                    placeholder="Password" 
                                    value={Data.password} 
                                    onChange={e=> setData({...Data,password: e.target.value })} />
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
