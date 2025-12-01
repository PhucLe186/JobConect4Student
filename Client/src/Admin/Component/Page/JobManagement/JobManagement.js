import React, { useState } from 'react';
import classNames from 'classnames/bind';
import { useNavigate } from 'react-router-dom';
import { useAdminLanguage } from '../../../Context/AdminLanguageContext';
import adminTranslations from '../../../Translation/AdminTranslations';
import styles from './JobManagement.module.scss';

const cx = classNames.bind(styles);

const JobManagement = () => {
    const Navigate = useNavigate();
    const { language } = useAdminLanguage();
    const t = adminTranslations[language];
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
     const handleBack = () => {
        Navigate('/dashboard')
    }
    
    const handleEdit = (job) => {
        alert(`Chỉnh sửa công việc: ${job.title}`);
    }
    
    const handleDelete = (job) => {
        if (window.confirm(`Bạn có chắc muốn xóa công việc "${job.title}"?`)) {
            setJobs(jobs.filter(j => j.id !== job.id));
            alert(`Đã xóa công việc: ${job.title}`);
        }
    }
    
    const handleApprove = (job) => {
        setJobs(jobs.map(j => j.id === job.id ? {...j, status: 'recruiting'} : j));
        alert(`Đã duyệt công việc: ${job.title}`);
    }
    
    const handleReject = (job) => {
        if (window.confirm(`Bạn có chắc muốn từ chối công việc "${job.title}"?`)) {
            setJobs(jobs.map(j => j.id === job.id ? {...j, status: 'closed'} : j));
            alert(`Đã từ chối công việc: ${job.title}`);
        }
    }

    return (
        
        <div className={cx('content-section')}>
            <button className={cx('back-btn')} onClick={handleBack}>{t.backToDashboard}</button>
            <h2>{t.jobManagement}</h2>
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
                                { key: 'title', label: t.title },
                                { key: 'company', label: t.company },
                                { key: 'salary', label: t.salary },
                                { key: 'status', label: t.status },
                                { key: 'actions', label: t.actions },
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
                                            ? t.recruiting
                                            : job.status === 'pending'
                                            ? t.pending
                                            : t.closed}
                                    </span>
                                </td>
                                <td>
                                    {(job.status === 'pending'
                                        ? [
                                              {
                                                  label: t.approve,
                                                  className: 'btn-edit',
                                                  onClick: () => handleApprove(job),
                                              },
                                              {
                                                  label: t.reject,
                                                  className: 'btn-delete',
                                                  onClick: () => handleReject(job),
                                              },
                                          ]
                                        : [
                                              { label: t.edit, className: 'btn-edit', onClick: () => handleEdit(job) },
                                              {
                                                  label: t.delete,
                                                  className: 'btn-delete',
                                                  onClick: () => handleDelete(job),
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
