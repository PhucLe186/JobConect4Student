import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './JobManagement.module.scss';
import trans__jobManagement from '../../../../component/Translation/JobManagement';

const cx = classNames.bind(styles);

const MOCK_JOBS = [
    {
        id: 1,
        title: 'Frontend Developer Reactjs',
        location: 'TP.HCM',
        province: 'TP.HCM',
        district: 'Quận 1',
        jobType: 'fulltime',
        salaryMin: 15000000,
        salaryMax: 20000000,
        applicants: 50,
        views: 100,
        tags: ['ReactJS', 'TypeScript', 'JavaScript'],
        status: 'pending',
        department: 'Engineering',
        description:
            'Tuyển dụng vị trí Frontend Developer có kinh nghiệm với ReactJS. Ứng viên cần có khả năng phát triển giao diện người dùng hiện đại, responsive và tối ưu hiệu suất. Yêu cầu thành thạo JavaScript ES6+, TypeScript, HTML5, CSS3. Kinh nghiệm với các thư viện như Redux, React Router. Ưu tiên ứng viên có kinh nghiệm làm việc với API RESTful, Git, và các công cụ build như Webpack.',
    },
    {
        id: 2,
        title: 'Backend Developer Nodejs',
        location: 'TP.HCM',
        province: 'TP.HCM',
        district: 'Quận 3',
        jobType: 'parttime',
        salaryMin: 15000000,
        salaryMax: 25000000,
        applicants: 20,
        views: 50,
        tags: ['NodeJS', 'Express', 'MongoDB'],
        status: 'pending',
        department: 'Engineering',
        description:
            'Tìm kiếm Backend Developer chuyên về Node.js để phát triển các ứng dụng web và API. Ứng viên cần thành thạo JavaScript, Node.js, Express.js và các cơ sở dữ liệu NoSQL như MongoDB. Có kinh nghiệm thiết kế RESTful API, xử lý authentication, authorization. Hiểu biết về microservices, Docker, và cloud services là một lợi thế.',
    },
    {
        id: 3,
        title: 'UI/UX Designer',
        location: 'Đà Nẵng',
        province: 'Đà Nẵng',
        district: 'Hải Châu',
        jobType: 'thuctap',
        salaryMin: 12000000,
        salaryMax: 18000000,
        applicants: 35,
        views: 80,
        tags: ['Figma', 'Sketch', 'Adobe XD'],
        status: 'approved',
        department: 'Design',
        description:
            'Cần tuyển UI/UX Designer sáng tạo và có tư duy thiết kế tốt. Ứng viên cần có khả năng nghiên cứu người dùng, tạo wireframe, prototype và thiết kế giao diện đẹp mắt, dễ sử dụng. Thành thạo các công cụ thiết kế như Figma, Sketch, Adobe XD. Có kinh nghiệm làm việc với design system và responsive design.',
    },
    {
        id: 4,
        title: 'Product Manager',
        location: 'Hà Nội',
        province: 'Hà Nội',
        district: 'Ba Đình',
        jobType: 'fulltime',
        salaryMin: 25000000,
        salaryMax: 40000000,
        applicants: 15,
        views: 120,
        tags: ['Agile', 'Scrum', 'JIRA'],
        status: 'approved',
        department: 'Product',
        description:
            'Tuyển Product Manager có kinh nghiệm quản lý sản phẩm công nghệ. Ứng viên cần có khả năng phân tích thị trường, định nghĩa yêu cầu sản phẩm, làm việc với các team kỹ thuật. Thành thạo phương pháp Agile/Scrum, các công cụ quản lý dự án như JIRA, Confluence. Có tư duy phân tích dữ liệu và hiểu biết về UX/UI.',
    },
];

const DEPARTMENT_OPTIONS = [...new Set(MOCK_JOBS.map((job) => job.department))];
const STATUS_OPTIONS = ['pending', 'approved'];

const currency = (value) =>
    value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

const getJobTypeLabel = (jobType) => {
    if (jobType === 'fulltime') return 'Full-time';
    if (jobType === 'parttime') return 'Part-time';
    return 'Thực tập';
};

const getStatusLabel = (jobStatus) => {
    if (jobStatus === 'pending') return 'Pending';
    if (jobStatus === 'approved') return 'Approved';
    return jobStatus;
};

function JobActionsMenu({ jobId, t }) {
    const handleEdit = () => {
        console.log(`Edit job ${jobId}`);
    };

    const handleDelete = () => {
        console.log(`Delete job ${jobId}`);
    };

    return (
        <div className={cx('job-card__dropdown')}>
            <button className={cx('job-card__dropdown-item')} onClick={handleEdit}>
                {t.actionEdit}
            </button>
            <button className={cx('job-card__dropdown-item')} onClick={handleDelete}>
                {t.actionDelete}
            </button>
        </div>
    );
}

function JobManagement({ language = 'vi' }) {
    const [query, setQuery] = useState('');
    const [status, setStatus] = useState('all');
    const [dept, setDept] = useState('all');
    const [openMenuId, setOpenMenuId] = useState(null);
    const menuRef = useRef(null);
    const navigate = useNavigate();

    const t = trans__jobManagement[language];
    const normalizedQuery = query.trim().toLowerCase();

    const filteredJobs = MOCK_JOBS.filter((job) => {
        const matchesTitle =
            normalizedQuery.length === 0 || job.title.toLowerCase().includes(normalizedQuery);
        const matchesStatus = status === 'all' || job.status === status;
        const matchesDepartment = dept === 'all' || job.department === dept;

        return matchesTitle && matchesStatus && matchesDepartment;
    });

    const pendingJobs = filteredJobs.filter((job) => job.status === 'pending').length;
    const approvedJobs = filteredJobs.filter((job) => job.status === 'approved').length;

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpenMenuId(null);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        setOpenMenuId(null);
    }, [query, status, dept]);

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
                    <div className={cx('jobs__stat-number')}>{pendingJobs}</div>
                    <div className={cx('jobs__stat-label')}>{t.statPending}</div>
                </div>
                <div className={cx('jobs__stat')}>
                    <div className={cx('jobs__stat-number')}>{approvedJobs}</div>
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
                                    {getStatusLabel(statusOption)}
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
                            {DEPARTMENT_OPTIONS.map((department) => (
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
                            <th className={cx('jobs__table-header')}>Quản lý tin đăng</th>
                            <th className={cx('jobs__table-header')}>Trạng thái</th>
                            <th className={cx('jobs__table-header')}>Mô tả</th>
                            <th className={cx('jobs__table-header')}>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredJobs.length === 0 ? (
                            <tr className={cx('jobs__table-row')}>
                                <td className={cx('jobs__empty-state')} colSpan="4">
                                    Không tìm thấy tin đăng phù hợp với bộ lọc hiện tại.
                                </td>
                            </tr>
                        ) : (
                            filteredJobs.map((job) => (
                                <tr key={job.id} className={cx('jobs__table-row')}>
                                    <td className={cx('jobs__table-cell')}>
                                        <div className={cx('job-info')}>
                                            <h3 className={cx('job-info__title')}>{job.title}</h3>
                                            <div className={cx('job-info__meta')}>
                                                <span>{job.location}</span>
                                                <span>
                                                    {currency(job.salaryMin)} - {currency(job.salaryMax)}
                                                </span>
                                                <span>{getJobTypeLabel(job.jobType)}</span>
                                                <span>{job.department}</span>
                                            </div>
                                            <div className={cx('job-info__stats')}>
                                                <span>
                                                    {job.applicants} {t.applicants}
                                                </span>
                                                <span>
                                                    {job.views} {t.views}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className={cx('jobs__table-cell')}>
                                        <span
                                            className={cx(
                                                'status-badge',
                                                `status-badge--${job.status}`,
                                            )}
                                        >
                                            {getStatusLabel(job.status)}
                                        </span>
                                    </td>
                                    <td className={cx('jobs__table-cell')}>
                                        <div className={cx('job-description')}>
                                            <p>{job.description}</p>
                                            <div className={cx('job-tags')}>
                                                {job.tags.map((tag) => (
                                                    <span key={tag} className={cx('job-tag')}>
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
                                            {openMenuId === job.id && (
                                                <JobActionsMenu jobId={job.id} t={t} />
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default JobManagement;
