import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import classNames from 'classnames/bind';
import style from './ForgotPassword.module.scss';
import routesconfig from '~/routes/routes';
import { AuthContext } from '~/context/AuthContext';

const cx = classNames.bind(style);

const ForgotPassword = () => {
    const navigate = useNavigate();
    const { api } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setMessage('');

        try {
            const response = await api.post('auth/forgot-password', { email });
            setMessage('Đã gửi link reset password đến email của bạn. Vui lòng kiểm tra email!');
        } catch (error) {
            setError(error.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại!');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            className={cx('forgot-password')}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
            <div className={cx('container')}>
                <div className={cx('forgot-password-box')}>
                    <button className={cx('back-btn')} onClick={() => navigate(routesconfig.login)}>
                        <i className={cx('fa-solid fa-arrow-left')}></i>
                    </button>
                    
                    <div className={cx('header')}>
                        <h1>Quên mật khẩu?</h1>
                        <p>Nhập email của bạn để nhận link reset mật khẩu</p>
                    </div>

                    <form onSubmit={handleSubmit} className={cx('form')}>
                        <div className={cx('input-box')}>
                            <input
                                type="email"
                                placeholder="Nhập email của bạn"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                            <i className={cx('fa-solid fa-envelope')}></i>
                        </div>

                        {error && (
                            <div className={cx('error-message')}>
                                <i className={cx('fa-solid fa-exclamation-circle')}></i>
                                {error}
                            </div>
                        )}

                        {message && (
                            <div className={cx('success-message')}>
                                <i className={cx('fa-solid fa-check-circle')}></i>
                                {message}
                            </div>
                        )}

                        <button 
                            type="submit" 
                            className={cx('submit-btn', { loading: isLoading })}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <i className={cx('fa-solid fa-spinner fa-spin')}></i>
                                    Đang gửi...
                                </>
                            ) : (
                                'Gửi link reset'
                            )}
                        </button>
                    </form>

                    <div className={cx('footer')}>
                        <p>Nhớ mật khẩu rồi? <Link to={routesconfig.login}>Đăng nhập</Link></p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ForgotPassword;