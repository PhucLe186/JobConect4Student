import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './JobManagement.module.scss';
import { useNavigate } from 'react-router-dom';
import { dashboardAPI } from '../../../../services/api';

const cx = classNames.bind(styles);

const JobManagement = () => {
    const Navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const data = await dashboardAPI.getAllJobs();
            setJobs(data);
        } catch (error) {
            console.error('Error fetching jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        Navigate('/dashboard');
    };

    const handleApprove = async (jobId) => {
        try {
            await dashboardAPI.approveJob(jobId);
            fetchJobs();
            alert('Duyệt việc làm thành công!');
        } catch (error) {
            alert('Lỗi khi duyệt việc làm');
        }
    };

    const handleReject = async (jobId) => {
        try {
            await dashboardAPI.rejectJob(jobId);
            fetchJobs();
            alert('Từ chối việc làm thành công!');
        } catch (error) {
            alert('Lỗi khi từ chối việc làm');
        }
    };

    const handleDelete = async (jobId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa việc làm này?')) {
            try {
                await dashboardAPI.deleteJob(jobId);
                fetchJobs();
                alert('Xóa thành công!');
            } catch (error) {
                alert('Lỗi khi xóa việc làm');
            }
        }
    };

    const filteredJobs = jobs.filter(job => {
        const matchesSearch = job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            job.company_name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterType === 'all' || 
                            (filterType === 'pending' && job.status === 'draft');
        return matchesSearch && matchesFilter;
    });

    return (
        
        <div className={cx('content-section')}>
            <button className={cx('back-btn')} onClick={handleBack}>Quay lại Dashboard</button>
            <h2>Quản lý việc làm</h2>
            <div className={cx('section-controls')}>
                <div className={cx('search-filter-container')}>
                    <input
                        type="text"
                        className={cx('section-search')}
                        placeholder="Tìm kiếm việc làm..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select
                        className={cx('filter-dropdown')}
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                    >
                        <option value="all">Tất cả</option>
                        <option value="pending">Chờ duyệt</option>
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
                        {loading ? (
                            <tr>
                                <td colSpan="5" style={{textAlign: 'center'}}>Đang tải...</td>
                            </tr>
                        ) : filteredJobs.length === 0 ? (
                            <tr>
                                <td colSpan="5" style={{textAlign: 'center'}}>Không có dữ liệu</td>
                            </tr>
                        ) : (
                            filteredJobs.map((job) => (
                                <tr key={job._id}>
                                    <td>{job.title}</td>
                                    <td>{job.company_name}</td>
                                    <td>{job.min_salary} - {job.max_salary} VNĐ</td>
                                    <td>
                                        <span className={cx('status', 
                                            job.status === 'open' ? 'active' :
                                            job.status === 'draft' ? 'pending' : 'inactive'
                                        )}>
                                            {job.status === 'open' ? 'Đang tuyển' :
                                             job.status === 'draft' ? 'Chờ duyệt' : 'Đã đóng'}
                                        </span>
                                    </td>
                                    <td>
                                        {job.status === 'draft' ? (
                                            <>
                                                <button className={cx('btn-edit')} onClick={() => handleApprove(job._id)}>
                                                    Duyệt
                                                </button>
                                                <button className={cx('btn-delete')} onClick={() => handleReject(job._id)}>
                                                    Từ chối
                                                </button>
                                            </>
                                        ) : (
                                            <button className={cx('btn-delete')} onClick={() => handleDelete(job._id)}>
                                                Xóa
                                            </button>
                                        )}
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

export default JobManagement;
