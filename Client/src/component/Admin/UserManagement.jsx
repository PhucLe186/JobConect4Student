import React from 'react';

const UserManagement = ({ t, showSection, searchTerm, setSearchTerm, filterType, setFilterType }) => {
    return (
        <div className="content-section">
            <button className="back-btn" onClick={() => showSection('dashboard')}>
                {t.backToDashboard}
            </button>
            <h2>{t.userManagement}</h2>
            <div className="section-controls">
                <div className="search-filter-container">
                    <input
                        type="text"
                        className="section-search"
                        placeholder={t.searchUsers}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select
                        className="filter-dropdown"
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                    >
                        <option value="all">{t.all}</option>
                        <option value="recent">{t.recent}</option>
                    </select>
                </div>
            </div>
            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            {[
                                { key: 'fullName', label: t.fullName },
                                { key: 'email', label: t.email },
                                { key: 'type', label: t.type },
                                { key: 'status', label: t.status },
                                { key: 'actions', label: t.actions }
                            ].map(column => (
                                <th key={column.key}>{column.label}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            { name: 'Nguyễn Văn A', email: 'a@email.com', type: t.student, status: 'active' },
                            { name: 'Trần Thị B', email: 'tranthib@email.com', type: t.recruiter, status: 'active' },
                            { name: 'Lê Văn C', email: 'levanc@email.com', type: t.student, status: 'offline' }
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
                                        { label: t.edit, className: 'btn-edit', onClick: null },
                                        { label: t.view, className: 'btn-view', onClick: null },
                                        { label: t.delete, className: 'btn-delete', onClick: null }
                                    ].map((btn, btnIndex) => (
                                        <button key={btnIndex} className={btn.className} onClick={btn.onClick}>
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