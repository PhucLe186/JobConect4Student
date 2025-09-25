import React from 'react';

const JobManagement = ({ t, showSection, jobs, searchTerm, setSearchTerm, filterType, setFilterType, handleApproveJob, handleRejectJob, handleDeleteJob }) => {
    return (
        <div className="content-section">
            <button className="back-btn" onClick={() => showSection('dashboard')}>
                {t.backToDashboard}
            </button>
            <h2>{t.jobManagement}</h2>
            <div className="section-controls">
                <div className="search-filter-container">
                    <input
                        type="text"
                        className="section-search"
                        placeholder={t.searchJobs}
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
                            <th>{t.title}</th>
                            <th>{t.company}</th>
                            <th>{t.salary}</th>
                            <th>{t.status}</th>
                            <th>{t.actions}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {jobs.map(job => (
                            <tr key={job.id}>
                                <td>{job.title}</td>
                                <td>{job.company}</td>
                                <td>{job.salary}</td>
                                <td>
                                    <span className={`status ${
                                        job.status === 'recruiting' ? 'active' : 
                                        job.status === 'pending' ? 'pending' : 'inactive'
                                    }`}>
                                        {job.status === 'recruiting' ? t.recruiting :
                                         job.status === 'pending' ? t.pending : t.closed}
                                    </span>
                                </td>
                                <td>
                                    {job.status === 'pending' ? (
                                        <>
                                            <button className="btn-edit" onClick={() => handleApproveJob(job.id)}>
                                                {t.approve}
                                            </button>
                                            <button className="btn-delete" onClick={() => handleRejectJob(job.id)}>
                                                {t.reject}
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button className="btn-edit">{t.edit}</button>
                                            <button className="btn-delete" onClick={() => handleDeleteJob(job.id)}>
                                                {t.delete}
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default JobManagement;