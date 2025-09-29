import React, { useState } from 'react';
import './Style.scss';

const Job = () => {
    const [language, setLanguage] = useState('vi');
    const [favorites, setFavorites] = useState({});

    const translations = {
        vi: {
            company: 'Công ty',
            jobs: 'Việc làm',
            community: 'Cộng đồng',
            contact: 'Liên hệ',
            signIn: 'Đăng nhập',
            signUp: 'Đăng xuất',
            companyName: 'Công Ty điện tử và phần mềm LG',
            experience: '1 - 2 năm kinh nghiệm',
            fulltime: 'Fulltime',
            posted: 'Ngày đăng tuyển : 27/09/2025 - Hết hạn : 05/10/2025',
            applyNow: 'Ứng tuyển ngay',
            save: 'Lưu',
            generalInfo: 'Thông tin chung',
            jobDescription: 'Mô tả công việc',
            benefits: 'Quyền lợi',
            experienceSkills: 'Kinh nghiệm/ Kỹ năng',
            contactInfo: 'Thông tin liên hệ',
            jobSuggestions: 'Gợi ý việc làm',
            jobType: 'Loại công việc',
            level: 'Cấp bậc',
            education: 'Học vấn',
            programmingLang: 'Ngôn ngữ lập trình',
            industry: 'Ngành nghề',
            employee: 'Nhân viên',
            graduated: 'Đã tốt nghiệp đại học',
            itSoftware: 'CNTT - Phần mềm',
            applicationContact: 'Liên hệ ứng tuyển',
            phone: 'Số điện thoại: (028) 3825 6789',
            address: 'Địa chỉ: 124/6 đường Lê Thị Riêng Phường 9 Quận 1 Thành Phố Hồ Chí Minh',
            workingHours: 'Thời gian làm việc: Thứ 2 - Thứ 6 (8:00 - 17:30)',
            alertMessage: 'Chức năng gợi ý việc làm sẽ được phát triển trong tương lai!',
        },
        en: {
            company: 'Companies',
            jobs: 'Jobs',
            community: 'Community',
            contact: 'Contact',
            signIn: 'Log In',
            signUp: 'Log out',
            companyName: 'LG Electronics and Software Company',
            experience: '1 - 2 years experience',
            fulltime: 'Fulltime',
            posted: 'Posted: 27/09/2025 - Expires: 05/10/2025',
            applyNow: 'Apply Now',
            save: 'Save',
            generalInfo: 'General information',
            jobDescription: 'Job Description',
            benefits: 'Benefits',
            experienceSkills: 'Experience/ Skills',
            contactInfo: 'Contact Information',
            jobSuggestions: 'Job Suggestions',
            jobType: 'Job Type',
            level: 'Level',
            education: 'Education',
            programmingLang: 'Programming Languages',
            industry: 'Industry',
            employee: 'Employee',
            graduated: 'University Graduate',
            itSoftware: 'IT - Software',
            applicationContact: 'Application Contact',
            phone: 'Phone: (028) 3825 6789',
            address: 'Address: 124/6 Le Thi Rieng Street, Ward 9, District 1, Ho Chi Minh City',
            workingHours: 'Working hours: Monday - Friday (8:00 - 17:30)',
            alertMessage: 'Job suggestion feature will be developed in the future!',
        },
    };

    const t = translations[language];

    const toggleHeart = (id) => {
        setFavorites((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const handleJobSuggestionClick = () => {
        alert(t.alertMessage);
    };

    return (
        <div>
            {/* Navbar */}
            <nav className="navbar navbar-expand-lg bg-white shadow-sm">
                <div className="container">
                    <a className="navbar-brand fw-bold text-primary" href="/">
                        JobConnect<span className="text-success">4Students</span>
                    </a>
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <a className="nav-link" href="/companies">
                                {t.company}
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/jobs">
                                {t.jobs}
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/community">
                                {t.community}
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/contact">
                                {t.contact}
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="btn btn-primary me-2" href="/login">
                                {t.signIn}
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="btn btn-primary" href="/logout">
                                {t.signUp}
                            </a>
                        </li>
                    </ul>
                    <button
                        className="btn btn-outline-secondary ms-4"
                        onClick={() => setLanguage(language === 'vi' ? 'en' : 'vi')}
                    >
                        <img
                            src={language === 'vi' ? 'vietnam-flag.svg' : 'uk-flag.svg'}
                            alt={language === 'vi' ? 'VI' : 'EN'}
                            style={{ width: '20px', height: '14px' }}
                        />
                    </button>
                </div>
            </nav>

            {/* Banner */}
            <section className="banner">
                <div className="banner-content">
                    <div className="logo-container">
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/2/20/LG_symbol.svg"
                            alt="LG Logo"
                            className="company-logo"
                        />
                    </div>
                    <div className="job-info">
                        <h1 className="job-title">Software Engineer - Electronics Development</h1>
                        <p className="company-name">{t.companyName}</p>
                        <p className="job-detail">
                            <i className="fas fa-map-marker-alt"></i>
                            {language === 'vi'
                                ? '124/6 đường Lê Thị Riêng Phường 9 Quận 1 Thành Phố Hồ Chí Minh'
                                : '124/6 Le Thi Rieng Street, Ward 9, District 1, Ho Chi Minh City'}
                        </p>
                        <p className="job-detail">
                            <i className="fas fa-briefcase"></i> {t.experience}
                        </p>
                        <p className="job-detail">
                            <i className="fas fa-clock"></i> {t.fulltime}
                        </p>
                        <p className="posted-date">
                            <i className="fas fa-calendar-alt"></i> {t.posted}
                        </p>
                        <div className="action-buttons">
                            <button className="btn-action">{t.applyNow}</button>
                            <button className="btn-action">{t.save}</button>
                        </div>
                    </div>
                </div>
            </section>

            <div className="main-layout">
                {/* Main Content */}
                <div className="content-main">
                    <div
                        className="general-info"
                        style={{
                            background: '#fff',
                            borderRadius: '8px',
                            padding: '20px',
                            marginBottom: '20px',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        <h2 style={{ fontSize: '24px', color: '#007bff', marginBottom: '15px' }}>{t.generalInfo}</h2>
                        <p>
                            <strong>LG Electronics Development Vietnam (LGEDV)</strong>
                        </p>
                        <p style={{ marginBottom: '15px' }}>
                            LGEDV was started in May 2016 as LG Vehicle Component Solutions Development Center Vietnam.
                        </p>
                        <p style={{ marginBottom: '15px' }}>
                            From 1st Jan 2023, the company embarked on a new journey to be an independent entity under
                            the name LGEDV (LG Electronics Development Vietnam Company Limited) - new R&D Subsidiary.
                        </p>
                        <p style={{ marginBottom: '20px' }}>
                            LGEDV conduct core R&D activities, and various product reliability tests in support of our
                            business in vehicle component, home appliances &air solution, webOS.
                        </p>
                        <p style={{ marginBottom: '20px' }}>
                            We offer an environment that enables colleagues to demonstrate their capabilities, focus on
                            their work and create value.
                        </p>
                        <p style={{ marginBottom: '20px' }}>
                            At LG, you're encouraged to take a creative and individual approach to challenges with
                            strong emphasis placed on performance and skill—and equal, merit-based opportunities across
                            the board.
                        </p>
                    </div>

                    <div
                        className="general-info"
                        style={{
                            background: '#fff',
                            borderRadius: '8px',
                            padding: '20px',
                            marginBottom: '20px',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        <h2 style={{ fontSize: '24px', color: '#007bff', marginBottom: '15px' }}>{t.jobDescription}</h2>
                        <p>
                            <strong>Software Engineer - Electronics Development</strong>
                        </p>
                        <p style={{ marginBottom: '15px' }}>
                            {language === 'vi'
                                ? 'Tham gia phát triển các sản phẩm điện tử tiêu dùng và giải pháp công nghệ thông minh cho gia đình và doanh nghiệp.'
                                : 'Participate in developing consumer electronics products and smart technology solutions for homes and businesses.'}
                        </p>
                        <p style={{ marginBottom: '15px' }}>
                            {language === 'vi'
                                ? 'Thiết kế và phát triển phần mềm nhúng cho các thiết bị điện tử, bao gồm TV thông minh, thiết bị gia dụng và hệ thống IoT.'
                                : 'Design and develop embedded software for electronic devices, including smart TVs, home appliances and IoT systems.'}
                        </p>
                        <p>
                            {language === 'vi'
                                ? 'Làm việc với các công nghệ tiên tiến như AI, Machine Learning và webOS để tạo ra những trải nghiệm người dùng tuyệt vời.'
                                : 'Work with advanced technologies like AI, Machine Learning and webOS to create excellent user experiences.'}
                        </p>
                    </div>

                    <div
                        className="general-info"
                        style={{
                            background: '#fff',
                            borderRadius: '8px',
                            padding: '20px',
                            marginBottom: '20px',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        <h2 style={{ fontSize: '24px', color: '#007bff', marginBottom: '15px' }}>{t.benefits}</h2>
                        <p>
                            <strong>
                                {language === 'vi' ? 'Chế độ đãi ngộ hấp dẫn' : 'Attractive Benefits Package'}
                            </strong>
                        </p>
                        <p style={{ marginBottom: '15px' }}>
                            {language === 'vi'
                                ? 'Mức lương cạnh tranh từ 15-25 triệu VNĐ tùy theo kinh nghiệm và năng lực.'
                                : 'Competitive salary from 15-25 million VND depending on experience and capability.'}
                        </p>
                        <p style={{ marginBottom: '15px' }}>
                            {language === 'vi'
                                ? 'Thưởng hiệu suất theo quý và thưởng cuối năm lên đến 3 tháng lương.'
                                : 'Quarterly performance bonus and year-end bonus up to 3 months salary.'}
                        </p>
                        <p>
                            {language === 'vi'
                                ? 'Bảo hiểm sức khỏe cao cấp cho nhân viên và gia đình, cơ hội đào tạo và phát triển nghề nghiệp tại Hàn Quốc.'
                                : 'Premium health insurance for employees and family, training and career development opportunities in Korea.'}
                        </p>
                    </div>

                    <div
                        className="general-info"
                        style={{
                            background: '#fff',
                            borderRadius: '8px',
                            padding: '20px',
                            marginBottom: '20px',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        <h2 style={{ fontSize: '24px', color: '#007bff', marginBottom: '15px' }}>
                            {t.experienceSkills}
                        </h2>
                        <div style={{ display: 'flex', gap: '20px', maxWidth: '700px' }}>
                            <div style={{ background: '#f0f7ff', padding: '20px', borderRadius: '8px', flex: 1 }}>
                                <div style={{ marginBottom: '15px' }}>
                                    <span style={{ display: 'block', fontWeight: 'bold', color: '#333' }}>
                                        {t.jobType}
                                    </span>
                                    <p style={{ margin: '2px 0 0', fontWeight: 'normal', color: '#111' }}>
                                        {t.fulltime}
                                    </p>
                                </div>
                                <div style={{ marginBottom: '15px' }}>
                                    <span style={{ display: 'block', fontWeight: 'bold', color: '#333' }}>
                                        {t.level}
                                    </span>
                                    <p style={{ margin: '2px 0 0', fontWeight: 'normal', color: '#111' }}>
                                        {t.employee}
                                    </p>
                                </div>
                                <div style={{ marginBottom: '15px' }}>
                                    <span style={{ display: 'block', fontWeight: 'bold', color: '#333' }}>
                                        {t.education}
                                    </span>
                                    <p style={{ margin: '2px 0 0', fontWeight: 'normal', color: '#111' }}>
                                        {t.graduated}
                                    </p>
                                </div>
                            </div>
                            <div style={{ background: '#f0f7ff', padding: '20px', borderRadius: '8px', flex: 1 }}>
                                <div style={{ marginBottom: '15px' }}>
                                    <span style={{ display: 'block', fontWeight: 'bold', color: '#333' }}>
                                        {language === 'vi' ? 'Kinh nghiệm' : 'Experience'}
                                    </span>
                                    <p style={{ margin: '2px 0 0', fontWeight: 'normal', color: '#111' }}>
                                        {t.experience}
                                    </p>
                                </div>
                                <div style={{ marginBottom: '15px' }}>
                                    <span style={{ display: 'block', fontWeight: 'bold', color: '#333' }}>
                                        {t.programmingLang}
                                    </span>
                                    <p style={{ margin: '2px 0 0', fontWeight: 'normal', color: '#111' }}>
                                        C/C++, Java, Python
                                    </p>
                                </div>
                                <div style={{ marginBottom: '15px' }}>
                                    <span style={{ display: 'block', fontWeight: 'bold', color: '#333' }}>
                                        {t.industry}
                                    </span>
                                    <p style={{ margin: '2px 0 0', fontWeight: 'normal', color: '#111' }}>
                                        {t.itSoftware}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div
                        className="general-info"
                        style={{
                            background: '#fff',
                            borderRadius: '8px',
                            padding: '20px',
                            marginBottom: '20px',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        <h2 style={{ fontSize: '24px', color: '#007bff', marginBottom: '15px' }}>{t.contactInfo}</h2>
                        <p>
                            <strong>{t.applicationContact}</strong>
                        </p>
                        <p style={{ marginBottom: '15px' }}>
                            Email: <a href="mailto:vanchisencm2022@gmail.com">vanchisencm2022@gmail.com</a>
                        </p>
                        <p style={{ marginBottom: '15px' }}>{t.phone}</p>
                        <p style={{ marginBottom: '15px' }}>{t.address}</p>
                        <p>{t.workingHours}</p>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="content-sidebar">
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            border: '1.5px solid #007bff',
                            color: '#007bff',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            background: '#fff',
                            cursor: 'pointer',
                            marginBottom: '20px',
                            fontWeight: 'bold',
                            fontSize: '14px',
                            minWidth: '150px',
                            maxWidth: '180px',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                        }}
                        onClick={handleJobSuggestionClick}
                    >
                        <i className="fa-solid fa-bell"></i>
                        {t.jobSuggestions}
                    </div>

                    <div
                        style={{
                            background: '#fff',
                            borderRadius: '8px',
                            padding: '15px',
                            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        {[
                            {
                                id: 1,
                                logo: 'Naver.png',
                                title: 'Dev',
                                company: language === 'vi' ? 'Công Ty công nghệ NAVER' : 'NAVER Technology Company',
                                location: language === 'vi' ? 'Hà Nội' : 'Hanoi',
                                salary: language === 'vi' ? '20 triệu - 40 triệu' : '20M - 40M VND',
                            },
                            {
                                id: 2,
                                logo: 'MB.png',
                                title: 'Software Engineer',
                                company: language === 'vi' ? 'Ngân Hàng Quân Đội MB Bank' : 'Military Bank MB Bank',
                                location: language === 'vi' ? 'Thành Phố Hồ Chí Minh' : 'Ho Chi Minh City',
                                salary: language === 'vi' ? '11 triệu - 15 triệu' : '11M - 15M VND',
                            },
                            {
                                id: 3,
                                logo: 'Microsoft.png',
                                title: 'Cloud Developer',
                                company:
                                    language === 'vi'
                                        ? 'Công Ty phần mềm và hỗ trợ Microsoft'
                                        : 'Microsoft Software and Support Company',
                                location: language === 'vi' ? 'Hồ Chí Minh' : 'Ho Chi Minh City',
                                salary: language === 'vi' ? '10 triệu - 15 triệu' : '10M - 15M VND',
                            },
                        ].map((job, index) => (
                            <div
                                key={job.id}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '15px 0',
                                    borderBottom: index < 2 ? '1px solid #eee' : 'none',
                                }}
                            >
                                <div
                                    style={{
                                        width: '45px',
                                        height: '45px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <img
                                        src={job.logo}
                                        alt="logo"
                                        style={{ width: '45px', height: '45px', objectFit: 'contain' }}
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 'bold', color: '#111', marginBottom: '4px' }}>
                                        {job.title}
                                    </div>
                                    <div style={{ color: '#666', fontSize: '14px', marginBottom: '6px' }}>
                                        {job.company}
                                    </div>
                                    <div style={{ fontSize: '14px', color: '#333', marginBottom: '4px' }}>
                                        <i
                                            className="fa-solid fa-location-dot"
                                            style={{ marginRight: '6px', color: '#666' }}
                                        ></i>
                                        {job.location}
                                    </div>
                                    <div style={{ fontSize: '14px', color: '#333', marginBottom: '4px' }}>
                                        <i
                                            className="fa-solid fa-dollar-sign"
                                            style={{ marginRight: '6px', color: '#666' }}
                                        ></i>
                                        {job.salary}
                                    </div>
                                </div>
                                <div
                                    style={{
                                        fontSize: '18px',
                                        color: favorites[job.id] ? '#ff4d4d' : '#aaa',
                                        cursor: 'pointer',
                                        fontWeight: favorites[job.id] ? 'bold' : 'normal',
                                    }}
                                    onClick={() => toggleHeart(job.id)}
                                >
                                    <i className={favorites[job.id] ? 'fa-solid fa-heart' : 'fa-regular fa-heart'}></i>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <hr style={{ margin: '40px 0', border: 'none', borderTop: '1px solid #999' }} />

            {/* Footer */}
            <footer style={{ marginTop: '50px', padding: '30px 0', backgroundColor: '#f8f9fa', textAlign: 'center' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <h5 style={{ fontWeight: 'bold', color: '#007bff', marginBottom: '15px' }}>
                        JobConnect <span style={{ color: '#28a745' }}>4Students</span>
                    </h5>
                    <p style={{ marginBottom: '10px' }}>497 Hoa Hao Street, Ward 7, District 10, Ho Chi Minh City</p>
                    <p style={{ marginBottom: '15px' }}>Hotline : 0912006432 | Zalo: Jobwithus233</p>
                    <div>
                        <a href="https://facebook.com" style={{ textDecoration: 'none', color: '#007bff' }}>
                            Facebook
                        </a>
                        ·
                        <a href="https://instagram.com" style={{ textDecoration: 'none', color: '#007bff' }}>
                            Instagram
                        </a>
                        ·
                        <a href="https://youtube.com" style={{ textDecoration: 'none', color: '#007bff' }}>
                            YouTube
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Job;
