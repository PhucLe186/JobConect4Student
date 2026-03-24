import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import classNames from 'classnames/bind';
import style from './Register.module.scss';
import routesconfig from '~/routes/routes';
import { AuthContext } from '~/context/AuthContext';
import { socialAuthService } from '~/Lib/socialAuth';

const cx = classNames.bind(style);

const RegisterForm = () => {
    const params = new URLSearchParams(window.location.search);
    const role = params.get("role");
    const {register}= useContext(AuthContext)

    const [genderSelected, setGenderSelected] = useState(false);
    const navigate = useNavigate();
    const [Data, setData]= useState({
        name:'',
        email:'',
        password:'',
        Confirm_Password:'',
        gender:'',
        dateOfbirth:'',
        role: role || '',
    })
    const [errors, setErrors] = useState({});
    const [socialLoading, setSocialLoading] = useState({
        google: false,
        facebook: false
    });

    const validate = () => {
        const newErrors = {};
        if (!Data.name.trim()) newErrors.name = 'Vui lòng nhập họ tên.';
        else if (/^[0-9]+$/.test(Data.name.trim())) newErrors.name = 'Họ tên không hợp lệ.';

        if (!Data.email) newErrors.email = 'Vui lòng nhập email.';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(Data.email)) newErrors.email = 'Email không hợp lệ.';

        if (!Data.password) newErrors.password = 'Vui lòng nhập mật khẩu.';
        else if (Data.password.length < 6) newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự.';
        else if (!/(?=.*[A-Z])|(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(Data.password))
            newErrors.password = 'Mật khẩu phải có ít nhất 1 chữ hoa hoặc 1 ký tự đặc biệt.';

        if (!Data.Confirm_Password) newErrors.Confirm_Password = 'Vui lòng xác nhận mật khẩu.';
        else if (Data.password !== Data.Confirm_Password) newErrors.Confirm_Password = 'Mật khẩu xác nhận không khớp.';

        if (!Data.dateOfbirth) newErrors.dateOfbirth = 'Vui lòng chọn ngày sinh.';
        if (!Data.gender) newErrors.gender = 'Vui lòng chọn giới tính.';
        if (!Data.role) newErrors.role = 'Vui lòng chọn vai trò.';

        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        setErrors({});
        const submitData = { ...Data };
        delete submitData.Confirm_Password;
        register(submitData);
    };

    const handleGoogleLogin = async () => {
        setSocialLoading(prev => ({ ...prev, google: true }));
        
        const result = await socialAuthService.signInWithGoogle();
        
        if (result.success) {
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
                            <input 
                                type="text"
                                placeholder="Name" 
                                value={Data.name} 
                                onChange={e=> { setData({...Data, name: e.target.value}); setErrors(prev => ({...prev, name: ''})); }} />
                            <i className={cx('fa-solid fa-user')}></i>
                            {errors.name && <span className={cx('error-msg')}>{errors.name}</span>}
                        </div>
                        <div className={cx('input-box')}>
                            <input 
                                type="email" 
                                placeholder="Email" 
                                value={Data.email} 
                                onChange={e=> { setData({...Data, email: e.target.value}); setErrors(prev => ({...prev, email: ''})); }} />
                            <i className={cx('fa-solid fa-envelope')}></i>
                            {errors.email && <span className={cx('error-msg')}>{errors.email}</span>}
                        </div>
                        <div className={cx('input-box')}>
                            <input 
                                type="password"
                                placeholder="Password (≥6 ký tự, có chữ hoa hoặc ký tự đặc biệt)" 
                                value={Data.password} 
                                onChange={e=> { setData({...Data, password: e.target.value}); setErrors(prev => ({...prev, password: ''})); }} />
                            <i className={cx('fa-solid fa-lock')}></i>
                            {errors.password && <span className={cx('error-msg')}>{errors.password}</span>}
                        </div>
                        <div className={cx('input-box')}>
                            <input 
                                type="password" 
                                placeholder="Confirm Password"
                                value={Data.Confirm_Password} 
                                onChange={e=> { setData({...Data, Confirm_Password: e.target.value}); setErrors(prev => ({...prev, Confirm_Password: ''})); }} />
                            <i className={cx('fa-solid fa-lock')}></i>
                            {errors.Confirm_Password && <span className={cx('error-msg')}>{errors.Confirm_Password}</span>}
                        </div>
                        <div className={cx('input-row')}>
                            <div className={cx('input-box', 'half-width')}>
                                <input 
                                    type="date" 
                                    value={Data.dateOfbirth} 
                                    onChange={e=> { setData({...Data, dateOfbirth: e.target.value}); setErrors(prev => ({...prev, dateOfbirth: ''})); }} />
                                <i className={cx('fa-solid fa-calendar')}></i>
                                {errors.dateOfbirth && <span className={cx('error-msg')}>{errors.dateOfbirth}</span>}
                            </div>
                            <div className={cx('input-box', 'half-width')}>
                                <select value={Data.gender} onChange={(e) => { setData({...Data, gender: e.target.value}); setErrors(prev => ({...prev, gender: ''})); }}>
                                    <option value="">Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                                {!genderSelected && <i className={cx('fa-solid fa-venus-mars')}></i>}
                                {errors.gender && <span className={cx('error-msg')}>{errors.gender}</span>}
                            </div>
                        </div>
                        <div className={cx('input-box')}>
                            <select value={Data.role} onChange={(e) => { setData({...Data, role: e.target.value}); setErrors(prev => ({...prev, role: ''})); }}>
                                <option value="">Select Role</option>
                                <option value="student">Student</option>
                                <option value="employer">Employer</option>
                            </select>
                            <i className={cx('fa-solid fa-user-tag')}></i>
                            {errors.role && <span className={cx('error-msg')}>{errors.role}</span>}
                        </div>
                        <button type="submit" className={cx('register-btn')}>
                            Register
                        </button>
                        <div className={cx('social-text')}>or register with social platforms</div>
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
