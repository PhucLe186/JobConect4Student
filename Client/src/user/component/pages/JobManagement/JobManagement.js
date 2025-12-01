import React, { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './JobManagement.module.scss';
import classNames from 'classnames/bind';
import translations from '~/component/Translation';
import { AuthContext } from '~/context/AuthContext';

const cx = classNames.bind(styles);





// 2. Nhận prop `t` từ component cha để dịch menu này
function JobActionsMenu({ jobId, t, onDelete }) {
    const handleEdit = () => {
        console.log(`Edit job ${jobId}`);
    };
    const handleDelete = () => {
        onDelete(jobId);
    };
    return (
        <div className={cx('job-card__dropdown')}>
            <button className={cx('job-card__dropdown-item')} onClick={handleEdit}>{t.actionEdit}</button>
            <button className={cx('job-card__dropdown-item')} onClick={handleDelete}>{t.actionDelete}</button>
        </div>
    );
}

// 3. Component chính nhận language
function JobManagement() {
    const {language, api}= useContext(AuthContext)
    const [query, setQuery] = useState('');
    const [status, setStatus] = useState('all');
    const [dept, setDept] = useState('all');
    const [openMenuId, setOpenMenuId] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const menuRef = useRef(null);
    const navigate = useNavigate();
    const t = translations[language];

    useEffect(() => {
        fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const response = await api.get('/jobs');
            if (response.data) {
                setJobs(response.data);
            }
        } catch (error) {
            console.error('Error fetching jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (jobId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa việc làm này?')) {
            try {
                await api.delete(`/jobs/${jobId}`);
                fetchJobs(); // Reload danh sách
                alert('Xóa việc làm thành công!');
            } catch (error) {
                console.error('Error deleting job:', error);
                alert('Lỗi khi xóa việc làm');
            }
        }
    };

    const filteredJobs = jobs.filter(job => {
        const matchesQuery = job.title?.toLowerCase().includes(query.toLowerCase());
        const matchesStatus = status === 'all' || 
                            (status === 'pending' && job.status === 'draft') ||
                            (status === 'approved' && job.status === 'open');
        return matchesQuery && matchesStatus;
    });

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpenMenuId(null);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const stats = {
        total: jobs.length,
        pending: jobs.filter(j => j.status === 'draft').length,
        approved: jobs.filter(j => j.status === 'open').length
    };

    if (loading) {
        return <div className={cx('loading')}>Đang tải...</div>;
    }

    return (
        <div className={cx('jobs')}>
            <div className={cx('jobs__header')}>
                <h1 className={cx('jobs__title')}>{t.title}</h1>
                <button
                    className={cx('jobs__new-btn')}
                    onClick={() => navigate('/newjob')}>{t.btnNewJob}
                </button>
            </div>

            <div className={cx('jobs__stats')}>
                <div className={cx('jobs__stat')}>
                    <div className={cx('jobs__stat-number')}>{stats.total}</div>
                    <div className={cx('jobs__stat-label')}>Tổng việc làm</div>
                </div>
                <div className={cx('jobs__stat')}>
                    <div className={cx('jobs__stat-number')}>{stats.pending}</div>
                    <div className={cx('jobs__stat-label')}>Chờ duyệt</div>
                </div>
                <div className={cx('jobs__stat')}>
                    <div className={cx('jobs__stat-number')}>{stats.approved}</div>
                    <div className={cx('jobs__stat-label')}>Đã duyệt</div>
                </div>
            </div>

            <div className={cx('jobs__filter-card')}>
                <div className={cx('jobs__search')}>
                    <input
                        className={cx('jobs__search-input')}
                        placeholder={t.searchPlaceholder}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <span className={cx('jobs__search-icon')} aria-hidden>
                        🔍
                    </span>
                </div>
                <div className={cx('jobs__filters')}>
                    <div className={cx('jobs__select')}>
                        <select
                            className={cx('jobs__select-native')}
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="all">{t.filterStatusAll}</option>
                            <option value="pending">{t.filterStatusPending}</option>
                            <option value="approved">{t.filterStatusApproved}</option>
                        </select>
                        <span className={cx('jobs__select-caret')}>▾</span>
                    </div>
                    <div className={cx('jobs__select')}>
                        <select
                            className={cx('jobs__select-native')}
                            value={dept}
                            onChange={(e) => setDept(e.target.value)}
                        >
                            <option value="all">{t.filterDeptAll}</option>
                            <option value="Engineering">Engineering</option>
                            <option value="Product">Product</option>
                            <option value="Design">Design</option>
                            <option value="Data">Data</option>
                        </select>
                        <span className={cx('jobs__select-caret')}>▾</span>
                    </div>
                </div>
            </div>

            <div className={cx('jobs__list')}>
                {filteredJobs.length === 0 ? (
                    <div style={{textAlign: 'center', padding: '40px', color: '#666'}}>
                        {loading ? 'Đang tải...' : 'Không có việc làm nào'}
                    </div>
                ) : (
                    filteredJobs.map((job) => (
                        <article key={job._id} className={cx('job-card')}>
                            <header className={cx('job-card__header')}>
                                <h3 className={cx('job-card__title')}>{job.title}</h3>
                                <div className={cx('job-status', job.status)}>
                                    {job.status === 'draft' ? 'Chờ duyệt' : 
                                     job.status === 'open' ? 'Đang tuyển' : 'Đã đóng'}
                                </div>
                                <div
                                    className={cx('job-card__more-wrapper')}
                                    ref={openMenuId === job._id ? menuRef : null}
                                >
                                    <button
                                        className={cx('job-card__more-btn')}
                                        aria-label="More options"
                                        onClick={() =>
                                            setOpenMenuId(openMenuId === job._id ? null : job._id)
                                        }>⋮</button>
                                    {openMenuId === job._id && <JobActionsMenu jobId={job._id} t={t} onDelete={handleDelete} />}
                                </div>
                            </header>
                            <ul className={cx('job-card__meta')}>
                                <li className={cx('job-card__meta-item')}>📍 {job.location}</li>
                                <li className={cx('job-card__meta-item')}>
                                    💲 {job.min_salary?.toLocaleString()} - {job.max_salary?.toLocaleString()} VNĐ
                                </li>
                                <li className={cx('job-card__meta-item')}>
                                    📅 Hạn: {new Date(job.deadline).toLocaleDateString('vi-VN')}
                                </li>
                                <li className={cx('job-card__meta-item')}>
                                    🏢 {job.job_type === 'full-time' ? 'Toàn thời gian' : 
                                         job.job_type === 'part-time' ? 'Bán thời gian' : 'Thực tập'}
                                </li>
                            </ul>
                            {job.industry && (
                                <div className={cx('job-card__tags')}>
                                    <span className={cx('job-card__tag')}>
                                        {job.industry}
                                    </span>
                                    <span className={cx('job-card__tag')}>
                                        {job.level}
                                    </span>
                                </div>
                            )}
                        </article>
                    ))
                )}
            </div>
        </div>
    );
}

export default JobManagement;