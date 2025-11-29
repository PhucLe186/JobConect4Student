import React, { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './JobManagement.module.scss';
import classNames from 'classnames/bind';
import translations from '~/component/Translation';
import { AuthContext } from '~/context/AuthContext';

const cx = classNames.bind(styles);

const MOCK_JOBS = [
    {
        id: 1,
        title: 'Frontend Developer Reactjs',
        location: 'TP.HCM',
        salaryMin: 15000000,
        salaryMax: 20000000,
        applicants: 50,
        views: 100,
        tags: ['ReactJS', 'TypeScript', 'JavaScript'],
        status: 'approved',
        department: 'Engineering',
    },
    {
        id: 2,
        title: 'Backend Developer Nodejs',
        location: 'TP.HCM',
        salaryMin: 15000000,
        salaryMax: 25000000,
        applicants: 20,
        views: 50,
        tags: ['NodeJS', 'Express', 'MongoDB'],
        status: 'pending',
        department: 'Engineering',
    },
    {
        id: 3,
        title: 'UI/UX Designer',
        location: 'Đà Nẵng',
        salaryMin: 12000000,
        salaryMax: 18000000,
        applicants: 35,
        views: 80,
        tags: ['Figma', 'Sketch', 'Adobe XD'],
        status: 'approved',
        department: 'Design',
    },
    {
        id: 4,
        title: 'Product Manager',
        location: 'Hà Nội',
        salaryMin: 25000000,
        salaryMax: 40000000,
        applicants: 15,
        views: 120,
        tags: ['Agile', 'Scrum', 'JIRA'],
        status: 'approved',
        department: 'Product',
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
function JobManagement() {
    const {language}= useContext(AuthContext)
    const [query, setQuery] = useState('');
    const [status, setStatus] = useState('all');
    const [dept, setDept] = useState('all');
    const [openMenuId, setOpenMenuId] = useState(null);
    const menuRef = useRef(null);
    const navigate = useNavigate();
    const t = translations[language];

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
                {MOCK_JOBS.map((job) => (
                    <article key={job.id} className={cx('job-card')}>
                        <header className={cx('job-card__header')}>
                            <h3 className={cx('job-card__title')}>{job.title}</h3>
                            <div
                                className={cx('job-card__more-wrapper')}
                                ref={openMenuId === job.id ? menuRef : null}
                            >
                                <button
                                    className={cx('job-card__more-btn')}
                                    aria-label="More options"
                                    onClick={() =>
                                        setOpenMenuId(openMenuId === job.id ? null : job.id)
                                    }>⋮</button>
                                {/* 5. Truyền t vào menu con */}
                                {openMenuId === job.id && <JobActionsMenu jobId={job.id} t={t} />}
                            </div>
                        </header>
                        <ul className={cx('job-card__meta')}>
                            <li className={cx('job-card__meta-item')}>📍 {job.location}</li>
                            <li className={cx('job-card__meta-item')}>
                                💲 {currency(job.salaryMin)} - {currency(job.salaryMax)}
                            </li>
                            <li className={cx('job-card__meta-item')}>
                                👥 {job.applicants} {t.applicants}
                            </li>
                            <li className={cx('job-card__meta-item')}>
                                👁️ {job.views} {t.views}
                            </li>
                        </ul>
                        <div className={cx('job-card__tags')}>
                            {job.tags.map((tag) => (
                                <span key={tag} className={cx('job-card__tag')}>
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}

export default JobManagement;