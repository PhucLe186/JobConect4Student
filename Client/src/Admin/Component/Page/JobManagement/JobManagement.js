import React, { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './JobManagement.module.scss';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

const JobManagement = () => {
    const Navigate=useNavigate()
    const [jobs, setJobs] = useState([
        { id: 1, title: 'Frontend Developer', company: 'FPT Software', salary: '15-25 triệu', status: 'recruiting' },
        { id: 2, title: 'Backend Developer', company: 'Viettel Group', salary: '18-30 triệu', status: 'recruiting' },
        { id: 3, title: 'Marketing Manager', company: 'Shopee Vietnam', salary: '20-35 triệu', status: 'pending' },
        { id: 4, title: 'Data Analyst', company: 'VinGroup', salary: '12-20 triệu', status: 'recruiting' },
        { id: 5, title: 'UI/UX Designer', company: 'Grab Vietnam', salary: '14-22 triệu', status: 'recruiting' },
        { id: 6, title: 'DevOps Engineer', company: 'TechComBank', salary: '25-40 triệu', status: 'pending' },
        { id: 7, title: 'Product Manager', company: 'Tiki Corporation', salary: '30-50 triệu', status: 'recruiting' },
        { id: 8, title: 'Mobile Developer', company: 'VNG Corporation', salary: '16-28 triệu', status: 'recruiting' },
        { id: 9, title: 'QA Engineer', company: 'Momo', salary: '13-18 triệu', status: 'closed' },
        { id: 10, title: 'Business Analyst', company: 'VNPAY', salary: '15-25 triệu', status: 'pending' },
        { id: 11, title: 'Fullstack Developer', company: 'Tech Corp', salary: '15-20 triệu', status: 'pending' },
    ]);
     const handleBack=()=> {
        Navigate('/dashboard')
    }

    return (
        
        <div className={cx('content-section')}>
            <button className={cx('back-btn')} onClick={handleBack}>backToDashboard</button>
            <h2>jobManagement</h2>
            <div className={cx('section-controls')}>
                <div className={cx('search-filter-container')}>
                    <input
                        type="text"
                        className={cx('section-search')}
                        // placeholder={t.searchJobs}
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
                                { key: 'title', label: 'title' },
                                { key: 'company', label: 'company' },
                                { key: 'salary', label: 'salary' },
                                { key: 'status', label: 'status' },
                                { key: 'actions', label: 'actions' },
                            ].map((column) => (
                                <th key={column.key}>{column.label}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {jobs.map((job) => (
                            <tr key={job.id}>
                                <td>{job.title}</td>
                                <td>{job.company}</td>
                                <td>{job.salary}</td>
                                <td>
                                    <span
                                        className={`status ${
                                            job.status === 'recruiting'
                                                ? 'active'
                                                : job.status === 'pending'
                                                ? 'pending'
                                                : 'inactive'
                                        }`}
                                    >
                                        {job.status === 'recruiting'
                                            ? 'recruiting'
                                            : job.status === 'pending'
                                            ? 'pending'
                                            : 'closed'}
                                    </span>
                                </td>
                                <td>
                                    {(job.status === 'pending'
                                        ? [
                                              {
                                                  label: 'approve',
                                                  className: 'btn-edit',
                                                  //   onClick: () => handleApproveJob(job.id),
                                              },
                                              {
                                                  label: 'reject',
                                                  className: 'btn-delete',
                                                  //   onClick: () => handleRejectJob(job.id),
                                              },
                                          ]
                                        : [
                                              { label: 'edit', className: 'btn-edit', onClick: null },
                                              {
                                                  label: 'delete',
                                                  className: 'btn-delete',
                                                  //   onClick: () => handleDeleteJob(job.id),
                                              },
                                          ]
                                    ).map((btn, index) => (
                                        <button key={index} className={cx(btn.className)} onClick={btn.onClick}>
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

export default JobManagement;
