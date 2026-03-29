import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import classNames from 'classnames/bind';
import style from './Login.module.scss';
import routesconfig from '~/routes/routes';
import { AuthContext } from '~/context/AuthContext';
import { socialAuthService } from '~/Lib/socialAuth';

const cx = classNames.bind(style);

const Login = () => {
    const navigate = useNavigate();
    const {login}= useContext(AuthContext)
    const [Data, setData]= useState({
        email:'',
        password:''
    })
    const [errors, setErrors] = useState({});
    const [socialLoading, setSocialLoading] = useState({
        google: false,
        facebook: false
    });

    const handleLogin = async(e) => {
        e.preventDefault();
        const newErrors = {};
        if (!Data.email) newErrors.email = 'Vui lòng nhập email.';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(Data.email)) newErrors.email = 'Email không hợp lệ.';
        if (!Data.password) newErrors.password = 'Vui lòng nhập mật khẩu.';
        if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
        setErrors({});
        login(Data);
    };

    const handleGoogleLogin = async () => {
        setSocialLoading(prev => ({ ...prev, google: true }));
        
        const result = await socialAuthService.signInWithGoogle();
        
        if (result.success) {
            // Chuyển đến trang chọn role với thông tin user
            navigate(routesconfig.socialRoleSelection, {
                state: {
                    userInfo: result.userInfo,
                    provider: result.provider
                }
            });
        } else {
            alert('Đăng nhập Google thất bại: ' + result.error);
        }
        
        setSocialLoading(prev => ({ ...prev, google: false }));
    };

    const handleFacebookLogin = async () => {
        setSocialLoading(prev => ({ ...prev, facebook: true }));
        
        const result = await socialAuthService.signInWithFacebook();
        
        if (result.success) {
            // Chuyển đến trang chọn role với thông tin user
            navigate(routesconfig.socialRoleSelection, {
                state: {
                    userInfo: result.userInfo,
                    provider: result.provider
                }
            });
        } else {
            alert('Đăng nhập Facebook thất bại: ' + result.error);
        }
        
        setSocialLoading(prev => ({ ...prev, facebook: false }));
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
                        <Link to={routesconfig.role} className={cx('register-btn')}>
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
                                    onChange={e=> { setData({...Data, email: e.target.value}); setErrors(prev => ({...prev, email: ''})); }} />
                                <i className={cx('fa-solid fa-user')}></i>
                                {errors.email && <span className={cx('error-msg')}>{errors.email}</span>}
                            </div>
                            <div className={cx('input-box')}>
                                <input 
                                    type="password" 
                                    placeholder="Password" 
                                    value={Data.password} 
                                    onChange={e=> { setData({...Data, password: e.target.value}); setErrors(prev => ({...prev, password: ''})); }} />
                                <i className={cx('fa-solid fa-lock')}></i>
                                {errors.password && <span className={cx('error-msg')}>{errors.password}</span>}
                            </div>
                            <div className={cx('forgot-link')}>
                                <Link to={routesconfig.forgotPassword}>Forgot Password?</Link>
                            </div>
                            <button type="button" className={cx('btn')} onClick={handleLogin}>
                                Login
                            </button>
                            <div className={cx('social-text')}>or Login with social platforms</div>
                            <div className={cx('social-icons')}>
                                <button 
                                    type="button"
                                    onClick={handleGoogleLogin}
                                    disabled={socialLoading.google || socialLoading.facebook}
                                    className={cx('social-btn', { loading: socialLoading.google })}
                                >
                                    {socialLoading.google ? (
                                        <i className={cx('fa-solid fa-spinner fa-spin')}></i>
                                    ) : (
                                        <i className={cx('fa-brands fa-google')}></i>
                                    )}
                                </button>
                                <button 
                                    type="button"
                                    onClick={handleFacebookLogin}
                                    disabled={socialLoading.google || socialLoading.facebook}
                                    className={cx('social-btn', { loading: socialLoading.facebook })}
                                >
                                    {socialLoading.facebook ? (
                                        <i className={cx('fa-solid fa-spinner fa-spin')}></i>
                                    ) : (
                                        <i className={cx('fa-brands fa-facebook')}></i>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Login;
