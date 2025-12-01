import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './UserManagement.module.scss';
import { useNavigate } from 'react-router-dom';
import { dashboardAPI } from '../../../../services/api';
const cx = classNames.bind(styles);

const UserManagement = () => {
    const Navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await dashboardAPI.getAllUsers();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        Navigate('/dashboard');
    };

    const handleEdit = async (userId) => {
        const newName = prompt('Nhập tên mới:');
        if (newName) {
            try {
                await dashboardAPI.updateUser(userId, { name: newName });
                fetchUsers();
                alert('Cập nhật thành công!');
            } catch (error) {
                alert('Lỗi khi cập nhật người dùng');
            }
        }
    };

    const handleDelete = async (userId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
            try {
                await dashboardAPI.deleteUser(userId);
                fetchUsers();
                alert('Xóa thành công!');
            } catch (error) {
                alert('Lỗi khi xóa người dùng');
            }
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            user.email?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });
    return (
        <div className={cx('content-section')}>
            <button className={cx('back-btn')} onClick={handleBack}>Quay lại Dashboard</button>
            <h2>Quản lý người dùng</h2>
            <div className={cx('section-controls')}>
                <div className={cx('search-filter-container')}>
                    <input
                        type="text"
                        className={cx('section-search')}
                        placeholder="Tìm kiếm người dùng..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select
                        className={cx('filter-dropdown')}
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                    >
                        <option value="all">Tất cả</option>
                        <option value="recent">Đang online</option>
                    </select>
                </div>
            </div>
            <div className={cx('table-container')}>
                <table className={cx('data-table')}>
                    <thead>
                        <tr>
                            {[
                                { key: 'fullName', label: 'fullName' },
                                { key: 'email', label: 'email' },
                                { key: 'type', label: 'type' },
                                { key: 'status', label: 'status' },
                                { key: 'actions', label: 'actions' },
                            ].map((column) => (
                                <th key={column.key}>{column.label}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="5" style={{textAlign: 'center'}}>Đang tải...</td>
                            </tr>
                        ) : filteredUsers.length === 0 ? (
                            <tr>
                                <td colSpan="5" style={{textAlign: 'center'}}>Không có dữ liệu</td>
                            </tr>
                        ) : (
                            filteredUsers.map((user) => (
                                <tr key={user._id}>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.role === 'student' ? 'Sinh viên' : user.role === 'employer' ? 'Nhà tuyển dụng' : user.role}</td>
                                    <td>
                                        <span className={cx('status', user.status === 'online' ? 'online' : 'offline')}>
                                            {user.status === 'online' ? 'Online' : 'Offline'}
                                        </span>
                                    </td>
                                    <td>
                                        <button className={cx('btn-edit')} onClick={() => handleEdit(user._id)}>
                                            Sửa
                                        </button>
                                        <button className={cx('btn-delete')} onClick={() => handleDelete(user._id)}>
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManagement;
