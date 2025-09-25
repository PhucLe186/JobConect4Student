import React, { useState, useEffect } from 'react';
import './Admin_dashboard.scss';
import Dashboard from '../component/Admin/Dashboard';
import JobManagement from '../component/Admin/JobManagement';
import UserManagement from '../component/Admin/UserManagement';
import ForumManagement from '../component/Admin/ForumManagement';
import { useTranslations } from '../component/Admin/useTranslations';

const AdminDashboard = () => {
    const [activeSection, setActiveSection] = useState('dashboard');
    const [showLogoutPopup, setShowLogoutPopup] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showLanguageModal, setShowLanguageModal] = useState(false);
    const { t, currentLanguage, changeLanguage } = useTranslations('vi');
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
    const [forumPosts, setForumPosts] = useState([
        {
            id: 1,
            title: 'Kinh nghiệm phỏng vấn IT',
            author: 'Nguyễn Văn A',
            comments: 12,
            date: '15/12/2024',
            status: 'active',
        },
        {
            id: 2,
            title: 'Cách viết CV ấn tượng',
            author: 'Trần Thị B',
            comments: 8,
            date: '14/12/2024',
            status: 'active',
        },
        {
            id: 3,
            title: 'Thảo luận về lương IT',
            author: 'Lê Văn C',
            comments: 25,
            date: '13/12/2024',
            status: 'pending',
        },
        {
            id: 4,
            title: 'Chia sẻ kinh nghiệm thực tập',
            author: 'Phạm Thị D',
            comments: 15,
            date: '12/12/2024',
            status: 'active',
        },
        {
            id: 5,
            title: 'Hỏi về các công ty startup',
            author: 'Hoàng Văn E',
            comments: 6,
            date: '11/12/2024',
            status: 'active',
        },
    ]);

    const showSection = (sectionId) => {
        setActiveSection(sectionId);
    };

    const handleLogout = () => {
        alert(t.logoutSuccess);
        setShowLogoutPopup(false);
        setShowUserMenu(false);
    };

    const handleLanguageChange = (lang) => {
        changeLanguage(lang);
        setShowLanguageModal(false);
        setShowUserMenu(false);
    };

    const handleApproveJob = (jobId) => {
        setJobs(jobs.map((job) => (job.id === jobId ? { ...job, status: 'recruiting' } : job)));
        alert(currentLanguage === 'vi' ? 'Đã duyệt việc làm!' : 'Job approved!');
    };

    const handleRejectJob = (jobId) => {
        setJobs(jobs.filter((job) => job.id !== jobId));
        alert(currentLanguage === 'vi' ? 'Đã từ chối việc làm!' : 'Job rejected!');
    };

    const handleDeleteJob = (jobId) => {
        setJobs(jobs.filter((job) => job.id !== jobId));
        alert(currentLanguage === 'vi' ? 'Đã xóa việc làm!' : 'Job deleted!');
    };

    const handleApprovePost = (postId) => {
        setForumPosts(forumPosts.map((post) => (post.id === postId ? { ...post, status: 'active' } : post)));
        alert(currentLanguage === 'vi' ? 'Đã duyệt bài viết!' : 'Post approved!');
    };

    const handleRejectPost = (postId) => {
        setForumPosts(forumPosts.filter((post) => post.id !== postId));
        alert(currentLanguage === 'vi' ? 'Đã từ chối bài viết!' : 'Post rejected!');
    };

    const handleDeletePost = (postId) => {
        setForumPosts(forumPosts.filter((post) => post.id !== postId));
        alert(currentLanguage === 'vi' ? 'Đã xóa bài viết!' : 'Post deleted!');
    };

    useEffect(() => {
        if (activeSection === 'dashboard') {
            drawCharts();
        }
    }, [activeSection]);

    const drawCharts = () => {
        // Vẽ biểu đồ cột người dùng
        const userCanvas = document.getElementById('userChart');
        if (userCanvas) {
            const ctx = userCanvas.getContext('2d');
            const data = [120, 150, 180, 200, 250, 300];
            const labels = ['2020', '2021', '2022', '2023', '2024', '2025'];

            ctx.clearRect(0, 0, userCanvas.width, userCanvas.height);

            const barWidth = 46;
            const barSpacing = 15;
            const maxValue = Math.max(...data);
            const chartHeight = 150;

            data.forEach((value, index) => {
                const barHeight = (value / maxValue) * chartHeight;
                const x = 40 + index * (barWidth + barSpacing);
                const y = 170 - barHeight;

                ctx.fillStyle = '#667eea';
                ctx.fillRect(x, y, barWidth, barHeight);

                ctx.fillStyle = '#333';
                ctx.font = '12px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(labels[index], x + barWidth / 2, 190);
                ctx.fillText(value, x + barWidth / 2, y - 5);
            });
        }

        // Vẽ biểu đồ tròn ngành nghề
        const jobCanvas = document.getElementById('jobChart');
        if (jobCanvas) {
            const ctx = jobCanvas.getContext('2d');
            const data = [
                { label: 'IT', value: 45, color: '#667eea' },
                { label: 'Marketing', value: 25, color: '#764ba2' },
                { label: 'Kế toán', value: 15, color: '#f093fb' },
                { label: 'Nhân sự', value: 10, color: '#4facfe' },
                { label: 'Khác', value: 5, color: '#43e97b' },
            ];

            ctx.clearRect(0, 0, jobCanvas.width, jobCanvas.height);

            const centerX = jobCanvas.width / 2;
            const centerY = jobCanvas.height / 2;
            const radius = 80;
            let currentAngle = 0;

            data.forEach((item) => {
                const sliceAngle = (item.value / 100) * 2 * Math.PI;

                ctx.beginPath();
                ctx.moveTo(centerX, centerY);
                ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
                ctx.closePath();
                ctx.fillStyle = item.color;
                ctx.fill();

                const labelAngle = currentAngle + sliceAngle / 2;
                const labelX = centerX + Math.cos(labelAngle) * (radius + 20);
                const labelY = centerY + Math.sin(labelAngle) * (radius + 20);

                ctx.fillStyle = '#333';
                ctx.font = '12px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(item.label, labelX, labelY);
                ctx.fillText(item.value + '%', labelX, labelY + 15);

                currentAngle += sliceAngle;
            });
        }
    };

    return (
        <div className="admin-container">
            <div className="admin-sidebar">
                <div className="admin-logo">
                    <h2>JobConnect Admin</h2>
                </div>
                <ul>
                    <li
                        className={activeSection === 'dashboard' ? 'active' : ''}
                        onClick={() => showSection('dashboard')}
                    >
                        Dashboard
                    </li>
                    <li className={activeSection === 'jobs' ? 'active' : ''} onClick={() => showSection('jobs')}>
                        {t.jobManagement}
                    </li>
                    <li className={activeSection === 'users' ? 'active' : ''} onClick={() => showSection('users')}>
                        {t.userManagement}
                    </li>
                    <li
                        className={activeSection === 'companies' ? 'active' : ''}
                        onClick={() => showSection('companies')}
                    >
                        {t.forumManagement}
                    </li>
                </ul>
            </div>

            <div className="admin-main">
                <div className="admin-header">
                    <h1>{t.adminTitle}</h1>
                    <div
                        className="admin-user"
                        onMouseEnter={() => setShowUserMenu(true)}
                        onMouseLeave={() => setShowUserMenu(false)}
                    >
                        <span className="user-name">Minh Trí ▼</span>
                        {showUserMenu && (
                            <div className="user-dropdown">
                                <div className="dropdown-item" onClick={() => setShowLanguageModal(true)}>
                                    {t.language}
                                </div>
                                <div className="dropdown-item" onClick={() => alert(t.forgotPasswordFunction)}>
                                    {t.forgotPassword}
                                </div>
                                <div className="dropdown-item" onClick={() => setShowLogoutPopup(true)}>
                                    {t.logout}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <main className="admin-content">
                    {activeSection === 'dashboard' && <Dashboard t={t} showSection={showSection} />}

                    {activeSection === 'jobs' && (
                        <JobManagement
                            t={t}
                            showSection={showSection}
                            jobs={jobs}
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            filterType={filterType}
                            setFilterType={setFilterType}
                            handleApproveJob={handleApproveJob}
                            handleRejectJob={handleRejectJob}
                            handleDeleteJob={handleDeleteJob}
                        />
                    )}

                    {activeSection === 'users' && (
                        <UserManagement
                            t={t}
                            showSection={showSection}
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            filterType={filterType}
                            setFilterType={setFilterType}
                        />
                    )}

                    {activeSection === 'companies' && (
                        <ForumManagement
                            t={t}
                            showSection={showSection}
                            forumPosts={forumPosts}
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            filterType={filterType}
                            setFilterType={setFilterType}
                            handleApprovePost={handleApprovePost}
                            handleRejectPost={handleRejectPost}
                            handleDeletePost={handleDeletePost}
                        />
                    )}
                </main>
            </div>

            {showLogoutPopup && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <h3>{t.confirmLogout}</h3>
                        <p>{t.logoutMessage}</p>
                        <div className="popup-buttons">
                            <button className="btn-cancel" onClick={() => setShowLogoutPopup(false)}>
                                {t.close}
                            </button>
                            <button className="btn-confirm" onClick={handleLogout}>
                                {t.logout}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showLanguageModal && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <h3>{t.chooseLanguage}</h3>
                        <p>{t.languageMessage}</p>
                        <div className="language-options">
                            <button
                                className={`language-btn ${currentLanguage === 'vi' ? 'active' : ''}`}
                                onClick={() => handleLanguageChange('vi')}
                            >
                                {t.vietnamese}
                            </button>
                            <button
                                className={`language-btn ${currentLanguage === 'en' ? 'active' : ''}`}
                                onClick={() => handleLanguageChange('en')}
                            >
                                {t.english}
                            </button>
                        </div>
                        <button className="btn-cancel" onClick={() => setShowLanguageModal(false)}>
                            {t.close}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
