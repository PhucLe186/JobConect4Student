import React from 'react';
import classNames from 'classnames/bind';
import styles from './UserManagement.module.scss';
const cx = classNames.bind(styles);

const UserManagement = () => {
    return (
        <div className={cx('content-section')}>
            <button className={cx('back-btn')}>backToDashboard</button>
            <h2>userManagement</h2>
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
                        <option value="all">all</option>
                        <option value="recent">recent</option>
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
                        {[
                            { name: 'Nguyễn Văn A', email: 'a@email.com', type: 'student', status: 'active' },
                            { name: 'Trần Thị B', email: 'tranthib@email.com', type: 'recruiter', status: 'active' },
                            { name: 'Lê Văn C', email: 'levanc@email.com', type: 'student', status: 'offline' },
                        ].map((user, index) => (
                            <tr key={index}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.type}</td>
                                <td>
                                    <span className={`status ${user.status === 'active' ? 'active' : 'pending'}`}>
                                        {user.status === 'active' ? 'active' : 'offline'}
                                    </span>
                                </td>
                                <td>
                                    {[
                                        { label: 'edit', className: 'btn-edit', onClick: null },
                                        { label: 'view', className: 'btn-view', onClick: null },
                                        { label: 'delete', className: 'btn-delete', onClick: null },
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
