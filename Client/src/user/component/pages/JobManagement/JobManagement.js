import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './JobManagement.module.scss';
import classNames from 'classnames/bind';

// 1. Import file dịch
import trans__jobManagement from "../../../../component/Translation/JobManagement"

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
        description: 'Tuyển dụng vị trí Frontend Developer có kinh nghiệm với ReactJS. Ứng viên cần có khả năng phát triển giao diện người dùng hiện đại, responsive và tối ưu hiệu suất. Yêu cầu thành thạo JavaScript ES6+, TypeScript, HTML5, CSS3. Kinh nghiệm với các thư viện như Redux, React Router. Ưu tiên ứng viên có kinh nghiệm làm việc với API RESTful, Git, và các công cụ build như Webpack.'
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
        description: 'Tìm kiếm Backend Developer chuyên về Node.js để phát triển các ứng dụng web và API. Ứng viên cần thành thạo JavaScript, Node.js, Express.js và các cơ sở dữ liệu NoSQL như MongoDB. Có kinh nghiệm thiết kế RESTful API, xử lý authentication, authorization. Hiểu biết về microservices, Docker, và cloud services là một lợi thế.'
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
        description: 'Cần tuyển UI/UX Designer sáng tạo và có tư duy thiết kế tốt. Ứng viên cần có khả năng nghiên cứu người dùng, tạo wireframe, prototype và thiết kế giao diện đẹp mắt, dễ sử dụng. Thành thạo các công cụ thiết kế như Figma, Sketch, Adobe XD. Có kinh nghiệm làm việc với design system và responsive design.'
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
        description: 'Tuyển Product Manager có kinh nghiệm quản lý sản phẩm công nghệ. Ứng viên cần có khả năng phân tích thị trường, định nghĩa yêu cầu sản phẩm, làm việc với các team kỹ thuật. Thành thạo phương pháp Agile/Scrum, các công cụ quản lý dự án như JIRA, Confluence. Có tư duy phân tích dữ liệu và hiểu biết về UX/UI.'
    },
];

// Helper format tiền tệ (Có thể tùy chỉnh locale theo language nếu muốn)
const currency = (v) =>
    v.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

// 2. Nhận prop `t` từ component cha để dịch menu này
function JobActionsMenu({ jobId, t }) {
    const handleEdit = () => {
        console.log(`Edit job ${jobId}`);
    };
    const handleDelete = () => {
        console.log(`Delete job ${jobId}`);
    };
    return (
        <div className={cx('job-card__dropdown')}>
            <button className={cx('job-card__dropdown-item')} onClick={handleEdit}>{t.actionEdit}</button>
            <button className={cx('job-card__dropdown-item')} onClick={handleDelete}>{t.actionDelete}</button>
        </div>
    );
}

// 3. Component chính nhận language
function JobManagement({ language = 'vi' }) {
    const [query, setQuery] = useState('');
    const [status, setStatus] = useState('all');
    const [dept, setDept] = useState('all');
    const [openMenuId, setOpenMenuId] = useState(null);
    const menuRef = useRef(null);
    const navigate = useNavigate();

    // 4. Lấy từ điển
    const t = trans__jobManagement[language];

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpenMenuId(null);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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
                    <div className={cx('jobs__stat-number')}>{MOCK_JOBS.length}</div>
                    <div className={cx('jobs__stat-label')}>{t.statTotal}</div>
                </div>
                <div className={cx('jobs__stat')}>
                    <div className={cx('jobs__stat-number')}>0</div>
                    <div className={cx('jobs__stat-label')}>{t.statPending}</div>
                </div>
                <div className={cx('jobs__stat')}>
                    <div className={cx('jobs__stat-number')}>0</div>
                    <div className={cx('jobs__stat-label')}>{t.statApproved}</div>
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
                            <option value="all">Tất cả trạng thái</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                        </select>
                        <span className={cx('jobs__select-caret')}>▾</span>
                    </div>
                    <div className={cx('jobs__select')}>
                        <select
                            className={cx('jobs__select-native')}
                            value={dept}
                            onChange={(e) => setDept(e.target.value)}
                        >
                            <option value="all">Tất cả phòng ban</option>
                            <option value="Engineering">Engineering</option>
                            <option value="Product">Product</option>
                            <option value="Design">Design</option>
                            <option value="Data">Data</option>
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
                        {MOCK_JOBS.map((job) => (
                            <tr key={job.id} className={cx('jobs__table-row')}>
                                <td className={cx('jobs__table-cell')}>
                                    <div className={cx('job-info')}>
                                        <h3 className={cx('job-info__title')}>{job.title}</h3>
                                        <div className={cx('job-info__meta')}>
                                            <span>{job.location}</span>
                                            <span>{currency(job.salaryMin)} - {currency(job.salaryMax)}</span>
                                            <span>{job.jobType === 'fulltime' ? 'Full-time' : job.jobType === 'parttime' ? 'Part-time' : 'Thực tập'}</span>
                                        </div>
                                        <div className={cx('job-info__stats')}>
                                            <span>{job.applicants} {t.applicants}</span>
                                            <span>{job.views} {t.views}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className={cx('jobs__table-cell')}>
                                    <span className={cx('status-badge', `status-badge--${job.status}`)}>
                                        {job.status === 'pending' ? 'Pending' : job.status === 'approved' ? 'Approved' : job.status}
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
                                        {openMenuId === job.id && <JobActionsMenu jobId={job.id} t={t} />}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default JobManagement;