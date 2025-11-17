import React, { useState, useEffect } from 'react';
import styles from './Job.module.scss';
import NaverLogo from '~/asset/img/Naver.png';
import MBLogo from '~/asset/img/MB.png';
import MicrosoftLogo from '~/asset/img/Microsoft.png';

// Thêm FontAwesome
if (!document.querySelector('link[href*="fontawesome"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
    document.head.appendChild(link);
}

const Job = ({ onBack, onPageChange }) => {
    const [language, setLanguage] = useState('vi');
    const [favorites, setFavorites] = useState({});

    const translations = {
        vi: {
            company: 'Công ty',
            jobs: 'Việc làm',
            community: 'Cộng đồng',
            contact: 'Liên hệ',
            signIn: 'Đăng nhập',
            signUp: 'Đăng ký',
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
            back: 'Quay lại',
        },
        en: {
            company: 'Companies',
            jobs: 'Jobs',
            community: 'Community',
            contact: 'Contact',
            signIn: 'Log In',
            signUp: 'Sign Up',
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
            back: 'Back',
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

    const handleLogin = () => {
        window.location.href = 'http://localhost:3002?mode=login';
    };

    const handleSignup = () => {
        window.location.href = 'http://localhost:3002?mode=signup';
    };

    return (
        <div className={styles.container}>
            <div className={styles.jobHeader}>
                <div className={styles.headerContent}>
                    <div className={styles.logoContainer}>
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/2/20/LG_symbol.svg"
                            alt="LG Logo"
                        />
                    </div>
                    <div className={styles.jobInfo}>
                        <h1>Software Engineer - Electronics Development</h1>
                        <p className={styles.companyName}>{t.companyName}</p>
                        <div className={styles.jobDetail}>
                            <i className="fas fa-map-marker-alt"></i>
                            <span>
                                {language === 'vi'
                                    ? '124/6 đường Lê Thị Riêng Phường 9 Quận 1 Thành Phố Hồ Chí Minh'
                                    : '124/6 Le Thi Rieng Street, Ward 9, District 1, Ho Chi Minh City'}
                            </span>
                        </div>
                        <div className={styles.jobDetail}>
                            <i className="fas fa-briefcase"></i>
                            <span>{t.experience}</span>
                        </div>
                        <div className={styles.jobDetail}>
                            <i className="fas fa-clock"></i>
                            <span>{t.fulltime}</span>
                        </div>
                        <div className={styles.jobDetail}>
                            <i className="fas fa-calendar-alt"></i>
                            <span>{t.posted}</span>
                        </div>
                        <div className={styles.buttons}>
                            <button 
                                className={styles.applyBtn}
                                onClick={() => onPageChange && onPageChange('cvbuilder')}
                            >
                                {t.applyNow}
                            </button>
                            <button className={styles.saveBtn}>
                                {t.save}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.mainContent}>
                <div className={styles.contentMain}>
                    <div className={styles.contentSection}>
                        <h2>{t.generalInfo}</h2>
                        <p>
                            <strong>LG Electronics Development Vietnam (LGEDV)</strong>
                        </p>
                        <p>
                            LGEDV was started in May 2016 as LG Vehicle Component Solutions Development Center Vietnam.
                        </p>
                        <p>
                            From 1st Jan 2023, the company embarked on a new journey to be an independent entity under
                            the name LGEDV (LG Electronics Development Vietnam Company Limited) - new R&D Subsidiary.
                        </p>
                        <p>
                            LGEDV conduct core R&D activities, and various product reliability tests in support of our
                            business in vehicle component, home appliances &air solution, webOS.
                        </p>
                    </div>

                    <div className={styles.contentSection}>
                        <h2>{t.jobDescription}</h2>
                        <p>
                            <strong>Software Engineer - Electronics Development</strong>
                        </p>
                        <p>
                            {language === 'vi'
                                ? 'Tham gia phát triển các sản phẩm điện tử tiêu dùng và giải pháp công nghệ thông minh cho gia đình và doanh nghiệp.'
                                : 'Participate in developing consumer electronics products and smart technology solutions for homes and businesses.'}
                        </p>
                    </div>

                    <div className={styles.contentSection}>
                        <h2>{t.experienceSkills}</h2>
                        <div className={styles.skillsContent}>
                            <div className={styles.skillColumn}>
                                <div className={styles.skillItem}>
                                    <span>{t.jobType}</span>
                                    <p>{t.fulltime}</p>
                                </div>
                                <div className={styles.skillItem}>
                                    <span>{t.level}</span>
                                    <p>{t.employee}</p>
                                </div>
                                <div className={styles.skillItem}>
                                    <span>{t.education}</span>
                                    <p>{t.graduated}</p>
                                </div>
                            </div>
                            <div className={styles.skillColumn}>
                                <div className={styles.skillItem}>
                                    <span>{language === 'vi' ? 'Kinh nghiệm' : 'Experience'}</span>
                                    <p>{t.experience}</p>
                                </div>
                                <div className={styles.skillItem}>
                                    <span>{t.programmingLang}</span>
                                    <p>C/C++, Java, Python</p>
                                </div>
                                <div className={styles.skillItem}>
                                    <span>{t.industry}</span>
                                    <p>{t.itSoftware}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.contentSection}>
                        <h2>{t.contactInfo}</h2>
                        <p>
                            <strong>{t.applicationContact}</strong>
                        </p>
                        <p>
                            Email: <a href="mailto:vanchisencm2022@gmail.com">vanchisencm2022@gmail.com</a>
                        </p>
                        <p>{t.phone}</p>
                        <p>{t.address}</p>
                        <p>{t.workingHours}</p>
                    </div>
                </div>

                <div className={styles.sidebar}>
                    <div className={styles.suggestionCard}>
                        <div className={styles.suggestionButton}>
                            <div className={styles.btn} onClick={handleJobSuggestionClick}>
                                <i className="fa-solid fa-bell"></i>
                                {t.jobSuggestions}
                            </div>
                        </div>

                        <div className={styles.jobsList}>
                        {[
                            {
                                id: 1,
                                logo: NaverLogo,
                                title: 'Dev',
                                company: language === 'vi' ? 'Công Ty công nghệ NAVER' : 'NAVER Technology Company',
                                location: language === 'vi' ? 'Hà Nội' : 'Hanoi',
                                salary: language === 'vi' ? '20 triệu - 40 triệu' : '20M - 40M VND',
                            },
                            {
                                id: 2,
                                logo: MBLogo,
                                title: 'Software Engineer',
                                company: language === 'vi' ? 'Ngân Hàng Quân Đội MB Bank' : 'Military Bank MB Bank',
                                location: language === 'vi' ? 'Thành Phố Hồ Chí Minh' : 'Ho Chi Minh City',
                                salary: language === 'vi' ? '11 triệu - 15 triệu' : '11M - 15M VND',
                            },
                            {
                                id: 3,
                                logo: MicrosoftLogo,
                                title: 'Cloud Developer',
                                company:
                                    language === 'vi'
                                        ? 'Công Ty phần mềm và hỗ trợ Microsoft'
                                        : 'Microsoft Software and Support Company',
                                location: language === 'vi' ? 'Hồ Chí Minh' : 'Ho Chi Minh City',
                                salary: language === 'vi' ? '10 triệu - 15 triệu' : '10M - 15M VND',
                            },
                        ].map((job, index) => (
                            <div key={job.id} className={styles.jobItem}>
                                <div className={styles.jobLogo}>
                                    <img src={job.logo} alt="logo" />
                                </div>
                                <div className={styles.jobDetails}>
                                    <div className={styles.jobTitle}>{job.title}</div>
                                    <div className={styles.jobCompany}>{job.company}</div>
                                    <div className={styles.jobLocation}>
                                        <i className="fa-solid fa-location-dot"></i>
                                        {job.location}
                                    </div>
                                    <div className={styles.jobSalary}>
                                        <i className="fa-solid fa-dollar-sign"></i>
                                        {job.salary}
                                    </div>
                                </div>
                                <div
                                    className={`${styles.heartIcon} ${favorites[job.id] ? styles.active : styles.inactive}`}
                                    onClick={() => toggleHeart(job.id)}
                                >
                                    <i className={favorites[job.id] ? 'fa-solid fa-heart' : 'fa-regular fa-heart'}></i>
                                </div>
                            </div>
                        ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Job;
