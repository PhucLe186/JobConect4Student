import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import classNames from 'classnames/bind';
import style from './SocialRoleSelection.module.scss';
import routesconfig from '~/routes/routes';

const cx = classNames.bind(style);

const SocialRoleSelection = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedRole, setSelectedRole] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Lấy thông tin user từ state được truyền từ social login
    const { userInfo, provider } = location.state || {};

    const handleRoleSelect = async (role) => {
        setSelectedRole(role);
        setIsLoading(true);

        try {
            // Gửi thông tin user và role đến server để tạo tài khoản
            const response = await fetch('/api/auth/social-register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...userInfo,
                    role,
                    provider
                }),
            });

            if (response.ok) {
                const data = await response.json();
                // Lưu token và chuyển hướng
                localStorage.setItem('token', data.token);
                navigate(routesconfig.home);
            } else {
                throw new Error('Registration failed');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Có lỗi xảy ra. Vui lòng thử lại!');
        } finally {
            setIsLoading(false);
        }
    };

    if (!userInfo) {
        navigate(routesconfig.login);
        return null;
    }

    return (
        <motion.div
            className={cx('social-role-selection')}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
            <div className={cx('container')}>
                <div className={cx('selection-box')}>
                    <div className={cx('user-info')}>
                        <img 
                            src={userInfo.photoURL || 'https://via.placeholder.com/80'} 
                            alt="Profile" 
                            className={cx('profile-image')}
                        />
                        <h2>Xin chào, {userInfo.displayName}!</h2>
                        <p>Vui lòng chọn vai trò của bạn để tiếp tục</p>
                    </div>

                    <div className={cx('role-options')}>
                        <div 
                            className={cx('role-card', { 
                                selected: selectedRole === 'student',
                                loading: isLoading && selectedRole === 'student'
                            })} 
                            onClick={() => !isLoading && handleRoleSelect('student')}
                        >
                            <div className={cx('role-icon')}>
                                <i className={cx('fa-solid fa-graduation-cap')}></i>
                            </div>
                            <h3>Sinh viên</h3>
                            <p>Tìm kiếm việc làm và thực tập</p>
                            {isLoading && selectedRole === 'student' && (
                                <div className={cx('loading-spinner')}>
                                    <i className={cx('fa-solid fa-spinner fa-spin')}></i>
                                </div>
                            )}
                        </div>

                        <div 
                            className={cx('role-card', { 
                                selected: selectedRole === 'employer',
                                loading: isLoading && selectedRole === 'employer'
                            })} 
                            onClick={() => !isLoading && handleRoleSelect('employer')}
                        >
                            <div className={cx('role-icon')}>
                                <i className={cx('fa-solid fa-building')}></i>
                            </div>
                            <h3>Nhà tuyển dụng</h3>
                            <p>Tuyển dụng nhân tài</p>
                            {isLoading && selectedRole === 'employer' && (
                                <div className={cx('loading-spinner')}>
                                    <i className={cx('fa-solid fa-spinner fa-spin')}></i>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className={cx('footer')}>
                        <button 
                            className={cx('back-btn')} 
                            onClick={() => navigate(routesconfig.login)}
                            disabled={isLoading}
                        >
                            <i className={cx('fa-solid fa-arrow-left')}></i>
                            Quay lại
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default SocialRoleSelection;