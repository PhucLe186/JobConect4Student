import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './JobManagement.module.scss';
import { AuthContext } from '~/context/AuthContext';

const cx = classNames.bind(styles);

const translations = {
    vi: {
        title: 'Quản lý tin đăng',
        btnNewJob: 'Đăng tin mới',
        statTotal: 'Tổng tin đăng',
        statPending: 'Chờ duyệt',
        statApproved: 'Đã duyệt',
        searchPlaceholder: 'Tìm kiếm theo tiêu đề...',
        filterStatusAll: 'Tất cả trạng thái',
        filterStatusDraft: 'Chờ duyệt',
        filterStatusOpen: 'Đã duyệt',
        filterStatusClose: 'Đã đóng',
        filterDeptAll: 'Tất cả phòng ban',
        tableTitle: 'Quản lý tin đăng',
        tableStatus: 'Trạng thái',
        tableDescription: 'Mô tả',
        tableAction: 'Thao tác',
        actionEdit: 'Sửa',
        actionDelete: 'Xóa',
        loading: 'Đang tải tin tuyển dụng từ MongoDB...',
        loginRequired: 'Vui lòng đăng nhập bằng tài khoản nhà tuyển dụng để quản lý tin đăng.',
        empty: 'Chưa có tin tuyển dụng nào trong database.',
        emptyFiltered: 'Không tìm thấy tin đăng phù hợp với bộ lọc hiện tại.',
        deadline: 'Hạn nộp',
        experience: 'Kinh nghiệm',
        industryFallback: 'Chưa cập nhật ngành nghề',
        departmentFallback: 'Chưa phân phòng ban',
        noDescription: 'Chưa có mô tả chi tiết.',
    },
    en: {
        title: 'Job Management',
        btnNewJob: 'Post New Job',
        statTotal: 'Total Jobs',
        statPending: 'Pending',
        statApproved: 'Approved',
        searchPlaceholder: 'Search by title...',
        filterStatusAll: 'All statuses',
        filterStatusDraft: 'Pending',
        filterStatusOpen: 'Approved',
        filterStatusClose: 'Closed',
        filterDeptAll: 'All departments',
        tableTitle: 'Job posting',
        tableStatus: 'Status',
        tableDescription: 'Description',
        tableAction: 'Actions',
        actionEdit: 'Edit',
        actionDelete: 'Delete',
        loading: 'Loading jobs from MongoDB...',
        loginRequired: 'Please sign in as an employer to manage job posts.',
        empty: 'No jobs found in the database.',
        emptyFiltered: 'No jobs match the current filters.',
        deadline: 'Deadline',
        experience: 'Experience',
        industryFallback: 'Industry not updated',
        departmentFallback: 'Department not assigned',
        noDescription: 'No detailed description yet.',
    },
};

const STATUS_OPTIONS = ['draft', 'open', 'close'];

const currency = (value) =>
    Number(value || 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

const getStatusLabel = (status, t) => {
    if (status === 'draft') return t.filterStatusDraft;
    if (status === 'open') return t.filterStatusOpen;
    if (status === 'close') return t.filterStatusClose;
    return status || '';
};

const getJobTypeLabel = (jobType) => {
    if (jobType === 'full-time') return 'Full-time';
    if (jobType === 'part-time') return 'Part-time';
    if (jobType === 'internship') return 'Internship';
    return jobType || '';
};

const formatDate = (value) => {
    if (!value) return '--';

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '--';

    return date.toLocaleDateString('vi-VN');
};

function JobActionsMenu({ jobId, t }) {
    return (
        <div className={cx('job-card__dropdown')}>
            <button
                className={cx('job-card__dropdown-item')}
                onClick={() => console.log(`Edit job ${jobId}`)}
            >
                {t.actionEdit}
            </button>
            <button
                className={cx('job-card__dropdown-item')}
                onClick={() => console.log(`Delete job ${jobId}`)}
            >
                {t.actionDelete}
            </button>
        </div>
    );
}

function JobManagement({ language = 'vi' }) {
    const [jobs, setJobs] = useState([]);
    const [query, setQuery] = useState('');
    const [status, setStatus] = useState('all');
    const [dept, setDept] = useState('all');
    const [openMenuId, setOpenMenuId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const menuRef = useRef(null);
    const navigate = useNavigate();
    const { api, user } = useContext(AuthContext);
    const t = translations[language] || translations.vi;

    useEffect(() => {
        let mounted = true;

        const fetchJobs = async () => {
            if (!user || user.type !== 'employer') {
                if (mounted) {
                    setJobs([]);
                    setError(t.loginRequired);
                    setLoading(false);
                }
                return;
            }

            setLoading(true);
            setError('');

            try {
                const response = await api.get('jobs/my-jobs');
                if (!mounted) return;
                setJobs(Array.isArray(response.data) ? response.data : []);
            } catch (fetchError) {
                if (!mounted) return;
                const message =
                    fetchError?.response?.data?.message ||
                    fetchError?.response?.data?.error ||
                    'Không thể tải danh sách tin đăng từ database.';

                setError(Array.isArray(message) ? message.join(', ') : String(message));
                setJobs([]);
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        fetchJobs();

        return () => {
            mounted = false;
        };
    }, [api, t.loginRequired, user]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpenMenuId(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        setOpenMenuId(null);
    }, [query, status, dept]);

    const departmentOptions = useMemo(
        () =>
            [...new Set(jobs.map((job) => (job.department || '').trim()).filter(Boolean))].sort(),
        [jobs],
    );

    const filteredJobs = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();

        return jobs.filter((job) => {
            const title = (job.title || '').toLowerCase();
            const department = (job.department || '').trim();
            const matchesTitle = !normalizedQuery || title.includes(normalizedQuery);
            const matchesStatus = status === 'all' || job.status === status;
            const matchesDepartment = dept === 'all' || department === dept;

            return matchesTitle && matchesStatus && matchesDepartment;
        });
    }, [dept, jobs, query, status]);

    const draftCount = filteredJobs.filter((job) => job.status === 'draft').length;
    const openCount = filteredJobs.filter((job) => job.status === 'open').length;

    const feedbackText = error
        ? error
        : loading
          ? t.loading
          : jobs.length === 0
            ? t.empty
            : t.emptyFiltered;

    return (
        <div className={cx('jobs')}>
            <div className={cx('jobs__header')}>
                <h1 className={cx('jobs__title')}>{t.title}</h1>
                <button className={cx('jobs__new-btn')} onClick={() => navigate('/newjob')}>
                    {t.btnNewJob}
                </button>
            </div>

            <div className={cx('jobs__stats')}>
                <div className={cx('jobs__stat')}>
                    <div className={cx('jobs__stat-number')}>{filteredJobs.length}</div>
                    <div className={cx('jobs__stat-label')}>{t.statTotal}</div>
                </div>
                <div className={cx('jobs__stat')}>
                    <div className={cx('jobs__stat-number')}>{draftCount}</div>
                    <div className={cx('jobs__stat-label')}>{t.statPending}</div>
                </div>
                <div className={cx('jobs__stat')}>
                    <div className={cx('jobs__stat-number')}>{openCount}</div>
                    <div className={cx('jobs__stat-label')}>{t.statApproved}</div>
                </div>
            </div>

            <div className={cx('jobs__filter-card')}>
                <div className={cx('jobs__search')}>
                    <input
                        className={cx('jobs__search-input')}
                        placeholder={t.searchPlaceholder}
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
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
                            onChange={(event) => setStatus(event.target.value)}
                        >
                            <option value="all">{t.filterStatusAll}</option>
                            {STATUS_OPTIONS.map((statusOption) => (
                                <option key={statusOption} value={statusOption}>
                                    {getStatusLabel(statusOption, t)}
                                </option>
                            ))}
                        </select>
                        <span className={cx('jobs__select-caret')}>▾</span>
                    </div>

                    <div className={cx('jobs__select')}>
                        <select
                            className={cx('jobs__select-native')}
                            value={dept}
                            onChange={(event) => setDept(event.target.value)}
                        >
                            <option value="all">{t.filterDeptAll}</option>
                            {departmentOptions.map((department) => (
                                <option key={department} value={department}>
                                    {department}
                                </option>
                            ))}
                        </select>
                        <span className={cx('jobs__select-caret')}>▾</span>
                    </div>
                </div>
            </div>

            <div className={cx('jobs__table-container')}>
                <table className={cx('jobs__table')}>
                    <thead>
                        <tr>
                            <th className={cx('jobs__table-header')}>{t.tableTitle}</th>
                            <th className={cx('jobs__table-header')}>{t.tableStatus}</th>
                            <th className={cx('jobs__table-header')}>{t.tableDescription}</th>
                            <th className={cx('jobs__table-header')}>{t.tableAction}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading || error || filteredJobs.length === 0 ? (
                            <tr className={cx('jobs__table-row')}>
                                <td className={cx('jobs__feedback')} colSpan="4">
                                    {feedbackText}
                                </td>
                            </tr>
                        ) : (
                            filteredJobs.map((job) => {
                                const department = job.department || t.departmentFallback;
                                const tags = [
                                    department,
                                    job.industry || t.industryFallback,
                                    job.experience,
                                    job.level,
                                ].filter(Boolean);

                                return (
                                    <tr key={job.id} className={cx('jobs__table-row')}>
                                        <td className={cx('jobs__table-cell')}>
                                            <div className={cx('job-info')}>
                                                <h3 className={cx('job-info__title')}>{job.title}</h3>
                                                <div className={cx('job-info__meta')}>
                                                    <span>{job.location || '--'}</span>
                                                    <span>
                                                        {currency(job.min_salary)} - {currency(job.max_salary)}
                                                    </span>
                                                    <span>{getJobTypeLabel(job.job_type)}</span>
                                                    <span>{department}</span>
                                                </div>
                                                <div className={cx('job-info__stats')}>
                                                    <span>
                                                        {t.deadline}: {formatDate(job.deadline)}
                                                    </span>
                                                    <span>
                                                        {t.experience}: {job.experience || '--'}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>

                                        <td className={cx('jobs__table-cell')}>
                                            <span className={cx('status-badge', `status-badge--${job.status}`)}>
                                                {getStatusLabel(job.status, t)}
                                            </span>
                                        </td>

                                        <td className={cx('jobs__table-cell')}>
                                            <div className={cx('job-description')}>
                                                <p>{job.description || t.noDescription}</p>
                                                <div className={cx('job-tags')}>
                                                    {tags.map((tag) => (
                                                        <span key={`${job.id}-${tag}`} className={cx('job-tag')}>
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </td>

                                        <td className={cx('jobs__table-cell')}>
                                            <div
                                                className={cx('action-menu-wrapper')}
                                                ref={openMenuId === job.id ? menuRef : null}
                                            >
                                                <button
                                                    className={cx('action-menu-btn')}
                                                    onClick={() =>
                                                        setOpenMenuId(openMenuId === job.id ? null : job.id)
                                                    }
                                                >
                                                    ⋮
                                                </button>
                                                {openMenuId === job.id ? (
                                                    <JobActionsMenu jobId={job.id} t={t} />
                                                ) : null}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default JobManagement;
