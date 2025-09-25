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
                            <th>{t.fullName}</th>
                            <th>{t.email}</th>
                            <th>{t.type}</th>
                            <th>{t.status}</th>
                            <th>{t.actions}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Nguyễn Văn A</td>
                            <td>a@email.com</td>
                            <td>{t.student}</td>
                            <td>
                                <span className="status active">{t.active}</span>
                            </td>
                            <td>
                                <button className="btn-edit">{t.edit}</button>
                                <button className="btn-view">{t.view}</button>
                                <button className="btn-delete">{t.delete}</button>
                            </td>
                        </tr>
                        <tr>
                            <td>Trần Thị B</td>
                            <td>tranthib@email.com</td>
                            <td>{t.recruiter}</td>
                            <td>
                                <span className="status active">{t.active}</span>
                            </td>
                            <td>
                                <button className="btn-edit">{t.edit}</button>
                                <button className="btn-view">{t.view}</button>
                                <button className="btn-delete">{t.delete}</button>
                            </td>
                        </tr>
                        <tr>
                            <td>Lê Văn C</td>
                            <td>levanc@email.com</td>
                            <td>{t.student}</td>
                            <td>
                                <span className="status pending">{t.offline}</span>
                            </td>
                            <td>
                                <button className="btn-edit">{t.edit}</button>
                                <button className="btn-view">{t.view}</button>
                                <button className="btn-delete">{t.delete}</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManagement;