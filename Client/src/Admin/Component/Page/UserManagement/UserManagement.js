import React from 'react';
import classNames from 'classnames/bind';
import { useNavigate } from 'react-router-dom';
import { useAdminLanguage } from '../../../Context/AdminLanguageContext';
import adminTranslations from '../../../Translation/AdminTranslations';
import styles from './UserManagement.module.scss';
const cx = classNames.bind(styles);

const UserManagement = () => {
    const Navigate = useNavigate();
    const { language } = useAdminLanguage();
    const t = adminTranslations[language];
    
    const handleBack = () => {
        Navigate('/dashboard');
    }
    
    const handleEdit = (user) => {
        alert(`Chỉnh sửa người dùng: ${user.name}`);
    }
    
    const handleView = (user) => {
        alert(`Xem chi tiết: ${user.name}\nEmail: ${user.email}\nLoại: ${user.type}\nTrạng thái: ${user.status}`);
    }
    
    const handleDelete = (user) => {
        if (window.confirm(`Bạn có chắc muốn xóa người dùng ${user.name}?`)) {
            alert(`Đã xóa người dùng: ${user.name}`);
        }
    }
    return (
        <div className={cx('content-section')}>
            <button className={cx('back-btn')} onClick={handleBack}>{t.backToDashboard}</button>
            <h2>{t.userManagement}</h2>
            <div className={cx('section-controls')}>
                <div className={cx('search-filter-container')}>
                    <input
                        type="text"
                        className={cx('section-search')}
                        // placeholder={t.searchUsers
                        // value={searchTerm}
                        // onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select
                        className={cx('filter-dropdown')}
                        // value={filterType}
                        // onChange={(e) => setFilterType(e.target.value)}
                    >
                        <option value="all">{t.all}</option>
                        <option value="recent">{t.recent}</option>
                    </select>
                </div>
            </div>
            <div className={cx('table-container')}>
                <table className={cx('data-table')}>
                    <thead>
                        <tr>
                            {[
                                { key: 'fullName', label: t.fullName },
                                { key: 'email', label: t.email },
                                { key: 'type', label: t.type },
                                { key: 'status', label: t.status },
                                { key: 'actions', label: t.actions },
                            ].map((column) => (
                                <th key={column.key}>{column.label}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            { id: 1, name: 'Nguyễn Văn A', email: 'a@email.com', type: 'student', status: 'active' },
                            { id: 2, name: 'Trần Thị B', email: 'tranthib@email.com', type: 'recruiter', status: 'active' },
                            { id: 3, name: 'Lê Văn C', email: 'levanc@email.com', type: 'student', status: 'offline' },
                        ].map((user, index) => (
                            <tr key={index}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.type}</td>
                                <td>
                                    <span className={`status ${user.status === 'active' ? 'active' : 'pending'}`}>
                                        {user.status === 'active' ? t.active : t.offline}
                                    </span>
                                </td>
                                <td>
                                    {[
                                        { label: t.edit, className: 'btn-edit', onClick: () => handleEdit(user) },
                                        { label: t.view, className: 'btn-view', onClick: () => handleView(user) },
                                        { label: t.delete, className: 'btn-delete', onClick: () => handleDelete(user) },
                                    ].map((btn, btnIndex) => (
                                        <button key={btnIndex} className={cx(btn.className)} onClick={btn.onClick}>
                                            {btn.label}
                                        </button>
                                    ))}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManagement;
