import React, { useState, useEffect } from 'react';
import './Admin_dashboard.scss';

const AdminDashboard = () => {
    const [activeSection, setActiveSection] = useState('dashboard');
    const [showLogoutPopup, setShowLogoutPopup] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showLanguageModal, setShowLanguageModal] = useState(false);
    const [currentLanguage, setCurrentLanguage] = useState('vi');
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
        { id: 11, title: 'Fullstack Developer', company: 'Tech Corp', salary: '15-20 triệu', status: 'pending' }
    ]);
    const [forumPosts, setForumPosts] = useState([
        { id: 1, title: 'Kinh nghiệm phỏng vấn IT', author: 'Nguyễn Văn A', comments: 12, date: '15/12/2024', status: 'active' },
        { id: 2, title: 'Cách viết CV ấn tượng', author: 'Trần Thị B', comments: 8, date: '14/12/2024', status: 'active' },
        { id: 3, title: 'Thảo luận về lương IT', author: 'Lê Văn C', comments: 25, date: '13/12/2024', status: 'pending' },
        { id: 4, title: 'Chia sẻ kinh nghiệm thực tập', author: 'Phạm Thị D', comments: 15, date: '12/12/2024', status: 'active' },
        { id: 5, title: 'Hỏi về các công ty startup', author: 'Hoàng Văn E', comments: 6, date: '11/12/2024', status: 'active' }
    ]);

    const showSection = (sectionId) => {
        setActiveSection(sectionId);
    };

    const handleLogout = () => {
        alert(t.logoutSuccess);
        setShowLogoutPopup(false);
        setShowUserMenu(false);
    };

    const translations = {
        vi: {
            adminTitle: 'Trang quản trị',
            dashboard: 'Dashboard',
            jobManagement: 'Quản lý việc làm',
            userManagement: 'Quản lý người dùng',
            forumManagement: 'Quản lý diễn đàn',
            searchPlaceholder: 'Tìm kiếm người dùng, việc làm, công ty...',
            language: 'Ngôn ngữ',
            forgotPassword: 'Quên mật khẩu',
            logout: 'Đăng xuất',
            dashboardOverview: 'Dashboard Tổng Quan',
            totalUsers: 'Tổng người dùng',
            totalJobs: 'Tổng việc làm',
            totalPosts: 'Tổng bài đăng',
            pendingApplications: 'Đơn chờ duyệt',
            userRegistrationChart: 'Lượng người dùng đăng ký theo tháng',
            jobCategoryChart: 'Phân bố ngành nghề tuyển dụng',
            backToDashboard: '← Quay lại Dashboard',
            searchJobs: 'Tìm kiếm việc làm...',
            searchUsers: 'Tìm kiếm người dùng...',
            searchPosts: 'Tìm kiếm bài viết...',
            all: 'Tất cả',
            recent: 'Gần đây',
            title: 'Tiêu đề',
            company: 'Công ty',
            salary: 'Lương',
            status: 'Trạng thái',
            actions: 'Thao tác',
            recruiting: 'Đang tuyển',
            pending: 'Chờ duyệt',
            closed: 'Đã đóng',
            edit: 'Sửa',
            delete: 'Xóa',
            view: 'Xem',
            approve: 'Duyệt',
            reject: 'Từ chối',
            fullName: 'Họ tên',
            email: 'Email',
            type: 'Loại',
            student: 'Sinh viên',
            recruiter: 'Nhà tuyển dụng',
            active: 'Hoạt động',
            offline: 'Offline',
            totalPostsCount: 'Tổng bài viết',
            comments: 'Bình luận',
            activeMembers: 'Thành viên hoạt động',
            author: 'Tác giả',
            postDate: 'Ngày đăng',
            confirmLogout: 'Xác nhận đăng xuất',
            logoutMessage: 'Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?',
            close: 'Đóng',
            chooseLanguage: 'Chọn ngôn ngữ',
            languageMessage: 'Vui lòng chọn ngôn ngữ hiển thị:',
            vietnamese: 'Tiếng Việt',
            english: 'English',
            logoutSuccess: 'Đăng xuất thành công!',
            languageChanged: 'Đã chuyển sang',
            forgotPasswordFunction: 'Chức năng quên mật khẩu',
        },
        en: {
            adminTitle: 'Admin Panel',
            dashboard: 'Dashboard',
            jobManagement: 'Job Management',
            userManagement: 'User Management',
            forumManagement: 'Forum Management',
            searchPlaceholder: 'Search users, jobs, companies...',
            language: 'Language',
            forgotPassword: 'Forgot Password',
            logout: 'Logout',
            dashboardOverview: 'Dashboard Overview',
            totalUsers: 'Total Users',
            totalJobs: 'Total Jobs',
            totalPosts: 'Total Posts',
            pendingApplications: 'Pending Applications',
            userRegistrationChart: 'Monthly User Registration',
            jobCategoryChart: 'Job Category Distribution',
            backToDashboard: '← Back to Dashboard',
            searchJobs: 'Search jobs...',
            searchUsers: 'Search users...',
            searchPosts: 'Search posts...',
            all: 'All',
            recent: 'Recent',
            title: 'Title',
            company: 'Company',
            salary: 'Salary',
            status: 'Status',
            actions: 'Actions',
            recruiting: 'Recruiting',
            pending: 'Pending',
            closed: 'Closed',
            edit: 'Edit',
            delete: 'Delete',
            view: 'View',
            approve: 'Approve',
            reject: 'Reject',
            fullName: 'Full Name',
            email: 'Email',
            type: 'Type',
            student: 'Student',
            recruiter: 'Recruiter',
            active: 'Active',
            offline: 'Offline',
            totalPostsCount: 'Total Posts',
            comments: 'Comments',
            activeMembers: 'Active Members',
            author: 'Author',
            postDate: 'Post Date',
            confirmLogout: 'Confirm Logout',
            logoutMessage: 'Are you sure you want to logout?',
            close: 'Close',
            chooseLanguage: 'Choose Language',
            languageMessage: 'Please select display language:',
            vietnamese: 'Vietnamese',
            english: 'English',
            logoutSuccess: 'Logout successful!',
            languageChanged: 'Switched to',
            forgotPasswordFunction: 'Forgot password function',
        },
    };

    const t = translations[currentLanguage];

    const handleLanguageChange = (lang) => {
        setCurrentLanguage(lang);
        setShowLanguageModal(false);
        setShowUserMenu(false);
        alert(
            `${translations[lang].languageChanged} ${
                lang === 'vi' ? translations[lang].vietnamese : translations[lang].english
            }`,
        );
    };

    const handleApproveJob = (jobId) => {
        setJobs(jobs.map(job => 
            job.id === jobId ? { ...job, status: 'recruiting' } : job
        ));
        alert(currentLanguage === 'vi' ? 'Đã duyệt việc làm!' : 'Job approved!');
    };

    const handleRejectJob = (jobId) => {
        setJobs(jobs.filter(job => job.id !== jobId));
        alert(currentLanguage === 'vi' ? 'Đã từ chối việc làm!' : 'Job rejected!');
    };

    const handleDeleteJob = (jobId) => {
        setJobs(jobs.filter(job => job.id !== jobId));
        alert(currentLanguage === 'vi' ? 'Đã xóa việc làm!' : 'Job deleted!');
    };

    const handleApprovePost = (postId) => {
        setForumPosts(forumPosts.map(post => 
            post.id === postId ? { ...post, status: 'active' } : post
        ));
        alert(currentLanguage === 'vi' ? 'Đã duyệt bài viết!' : 'Post approved!');
    };

    const handleRejectPost = (postId) => {
        setForumPosts(forumPosts.filter(post => post.id !== postId));
        alert(currentLanguage === 'vi' ? 'Đã từ chối bài viết!' : 'Post rejected!');
    };

    const handleDeletePost = (postId) => {
        setForumPosts(forumPosts.filter(post => post.id !== postId));
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
                    {activeSection === 'dashboard' && (
                        <div className="content-section active">
                            <h2>{t.dashboardOverview}</h2>
                            <div className="stats-grid">
                                <div className="stat-card" onClick={() => showSection('users')}>
                                    <div className="stat-info">
                                        <h3>1,250</h3>
                                        <p>{t.totalUsers}</p>
                                    </div>
                                </div>
                                <div className="stat-card" onClick={() => showSection('jobs')}>
                                    <div className="stat-info">
                                        <h3>340</h3>
                                        <p>{t.totalJobs}</p>
                                    </div>
                                </div>
                                <div className="stat-card" onClick={() => showSection('companies')}>
                                    <div className="stat-info">
                                        <h3>85</h3>
                                        <p>{t.totalPosts}</p>
                                    </div>
                                </div>
                                <div className="stat-card" onClick={() => showSection('jobs')}>
                                    <div className="stat-info">
                                        <h3>156</h3>
                                        <p>{t.pendingApplications}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="charts-container">
                                <div className="chart-card">
                                    <h3>{t.userRegistrationChart}</h3>
                                    <canvas id="userChart" width="400" height="200"></canvas>
                                </div>
                                <div className="chart-card">
                                    <h3>{t.jobCategoryChart}</h3>
                                    <canvas id="jobChart" width="300" height="300"></canvas>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeSection === 'jobs' && (
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
                    )}

                    {activeSection === 'users' && (
                        <div className="content-section">
                            <button className="back-btn" onClick={() => showSection('dashboard')}>
                                {t.backToDashboard}
                            </button>
                            <h2>{t.userManagement}</h2>
                            <div className="section-controls">
                                <div className="search-filter-container">
                                    <input
                                        type="text"
                                        className="section-search"
                                        placeholder={t.searchUsers}
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
                                            <th>{t.fullName}</th>
                                            <th>{t.email}</th>
                                            <th>{t.type}</th>
                                            <th>{t.status}</th>
                                            <th>{t.actions}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Nguyễn Văn A</td>
                                            <td>a@email.com</td>
                                            <td>{t.student}</td>
                                            <td>
                                                <span className="status active">{t.active}</span>
                                            </td>
                                            <td>
                                                <button className="btn-edit">{t.edit}</button>
                                                <button className="btn-view">{t.view}</button>
                                                <button className="btn-delete">{t.delete}</button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Trần Thị B</td>
                                            <td>tranthib@email.com</td>
                                            <td>{t.recruiter}</td>
                                            <td>
                                                <span className="status active">{t.active}</span>
                                            </td>
                                            <td>
                                                <button className="btn-edit">{t.edit}</button>
                                                <button className="btn-view">{t.view}</button>
                                                <button className="btn-delete">{t.delete}</button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Lê Văn C</td>
                                            <td>levanc@email.com</td>
                                            <td>{t.student}</td>
                                            <td>
                                                <span className="status pending">{t.offline}</span>
                                            </td>
                                            <td>
                                                <button className="btn-edit">{t.edit}</button>
                                                <button className="btn-view">{t.view}</button>
                                                <button className="btn-delete">{t.delete}</button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Phạm Thị D</td>
                                            <td>phamthid@email.com</td>
                                            <td>{t.student}</td>
                                            <td>
                                                <span className="status active">{t.active}</span>
                                            </td>
                                            <td>
                                                <button className="btn-edit">{t.edit}</button>
                                                <button className="btn-view">{t.view}</button>
                                                <button className="btn-delete">{t.delete}</button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Hoàng Văn E</td>
                                            <td>hoangvane@email.com</td>
                                            <td>{t.recruiter}</td>
                                            <td>
                                                <span className="status active">{t.active}</span>
                                            </td>
                                            <td>
                                                <button className="btn-edit">{t.edit}</button>
                                                <button className="btn-view">{t.view}</button>
                                                <button className="btn-delete">{t.delete}</button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Vũ Thị F</td>
                                            <td>vuthif@email.com</td>
                                            <td>{t.student}</td>
                                            <td>
                                                <span className="status active">{t.active}</span>
                                            </td>
                                            <td>
                                                <button className="btn-edit">{t.edit}</button>
                                                <button className="btn-view">{t.view}</button>
                                                <button className="btn-delete">{t.delete}</button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Đỗ Văn G</td>
                                            <td>dovang@email.com</td>
                                            <td>{t.student}</td>
                                            <td>
                                                <span className="status pending">{t.offline}</span>
                                            </td>
                                            <td>
                                                <button className="btn-edit">{t.edit}</button>
                                                <button className="btn-view">{t.view}</button>
                                                <button className="btn-delete">{t.delete}</button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Bùi Thị H</td>
                                            <td>buithih@email.com</td>
                                            <td>{t.recruiter}</td>
                                            <td>
                                                <span className="status active">{t.active}</span>
                                            </td>
                                            <td>
                                                <button className="btn-edit">{t.edit}</button>
                                                <button className="btn-view">{t.view}</button>
                                                <button className="btn-delete">{t.delete}</button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Ngô Văn I</td>
                                            <td>ngovani@email.com</td>
                                            <td>{t.student}</td>
                                            <td>
                                                <span className="status active">{t.active}</span>
                                            </td>
                                            <td>
                                                <button className="btn-edit">{t.edit}</button>
                                                <button className="btn-view">{t.view}</button>
                                                <button className="btn-delete">{t.delete}</button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Đinh Thị K</td>
                                            <td>dinhthik@email.com</td>
                                            <td>{t.student}</td>
                                            <td>
                                                <span className="status active">{t.active}</span>
                                            </td>
                                            <td>
                                                <button className="btn-edit">{t.edit}</button>
                                                <button className="btn-view">{t.view}</button>
                                                <button className="btn-delete">{t.delete}</button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Mai Văn L</td>
                                            <td>maivanl@email.com</td>
                                            <td>{t.recruiter}</td>
                                            <td>
                                                <span className="status pending">{t.offline}</span>
                                            </td>
                                            <td>
                                                <button className="btn-edit">{t.edit}</button>
                                                <button className="btn-view">{t.view}</button>
                                                <button className="btn-delete">{t.delete}</button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeSection === 'companies' && (
                        <div className="content-section">
                            <button className="back-btn" onClick={() => showSection('dashboard')}>
                                {t.backToDashboard}
                            </button>
                            <h2>{t.forumManagement}</h2>
                            <div className="forum-stats">
                                <div className="forum-stat-card">
                                    <h4>{t.totalPostsCount}</h4>
                                    <span>245</span>
                                </div>
                                <div className="forum-stat-card">
                                    <h4>{t.comments}</h4>
                                    <span>1,832</span>
                                </div>
                                <div className="forum-stat-card">
                                    <h4>{t.activeMembers}</h4>
                                    <span>156</span>
                                </div>
                            </div>
                            <div className="section-controls">
                                <div className="search-filter-container">
                                    <input
                                        type="text"
                                        className="section-search"
                                        placeholder={t.searchPosts}
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
                                            <th>{t.author}</th>
                                            <th>{t.comments}</th>
                                            <th>{t.postDate}</th>
                                            <th>{t.status}</th>
                                            <th>{t.actions}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {forumPosts.map(post => (
                                            <tr key={post.id}>
                                                <td>{post.title}</td>
                                                <td>{post.author}</td>
                                                <td>{post.comments}</td>
                                                <td>{post.date}</td>
                                                <td>
                                                    <span className={`status ${
                                                        post.status === 'active' ? 'active' : 'pending'
                                                    }`}>
                                                        {post.status === 'active' ? t.active : t.pending}
                                                    </span>
                                                </td>
                                                <td>
                                                    <button className="btn-view">{t.view}</button>
                                                    {post.status === 'pending' ? (
                                                        <>
                                                            <button className="btn-edit" onClick={() => handleApprovePost(post.id)}>
                                                                {t.approve}
                                                            </button>
                                                            <button className="btn-delete" onClick={() => handleRejectPost(post.id)}>
                                                                {t.reject}
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <button className="btn-edit">{t.edit}</button>
                                                            <button className="btn-delete" onClick={() => handleDeletePost(post.id)}>
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
