import React, { useState } from 'react';
import styles from './CompanyDetail.module.scss';
import SamsungLogo from '~/asset/img/Samsung.png';

const CompanyDetail = ({ onBack, onPageChange, companyData }) => {
    const [language, setLanguage] = useState('vi');

    const translations = {
        vi: {
            company: 'Công ty',
            jobs: 'Việc làm',
            community: 'Cộng đồng',
            contact: 'Liên hệ',
            signIn: 'Đăng nhập',
            signUp: 'Đăng ký',
            back: 'Quay lại',
            generalInfo: 'Thông tin chung',
            companyDescription: 'Giới thiệu công ty',
            benefits: 'Quyền lợi nhân viên',
            workEnvironment: 'Môi trường làm việc',
            contactInfo: 'Thông tin liên hệ',
            companySuggestions: 'Gợi ý công ty',
            alertMessage: 'Chức năng gợi ý công ty sẽ được phát triển trong tương lai!',
            companySize: 'Quy mô công ty',
            industry: 'Ngành nghề',
            founded: 'Thành lập',
            headquarters: 'Trụ sở chính',
            website: 'Website',
            phone: 'Số điện thoại',
            address: 'Địa chỉ',
            workingHours: 'Thời gian làm việc',
            viewJobs: 'Xem việc làm',
        },
        en: {
            company: 'Companies',
            jobs: 'Jobs',
            community: 'Community',
            contact: 'Contact',
            signIn: 'Log In',
            signUp: 'Sign Up',
            back: 'Back',
            generalInfo: 'General Information',
            companyDescription: 'Company Description',
            benefits: 'Employee Benefits',
            workEnvironment: 'Work Environment',
            contactInfo: 'Contact Information',
            companySuggestions: 'Company Suggestions',
            alertMessage: 'Company suggestion feature will be developed in the future!',
            companySize: 'Company Size',
            industry: 'Industry',
            founded: 'Founded',
            headquarters: 'Headquarters',
            website: 'Website',
            phone: 'Phone',
            address: 'Address',
            workingHours: 'Working Hours',
            viewJobs: 'View Jobs',
        },
    };

    const t = translations[language];

    const samsungData = {
        vi: {
            name: 'Samsung Việt Nam',
            industry: 'Công nghệ',
            size: '10,000+ nhân viên',
            founded: '1969',
            headquarters: 'Seoul, Hàn Quốc',
            website: 'www.samsung.com/vn',
            phone: '(028) 3911 0000',
            address: 'Tầng 15, Tòa nhà Bitexco Financial Tower, 2 Hải Triều, Quận 1, TP.HCM',
            workingHours: 'Thứ 2 - Thứ 6 (8:00 - 17:30)',
            description:
                'Samsung là tập đoàn công nghệ hàng đầu thế giới, chuyên sản xuất điện tử tiêu dùng, thiết bị di động và các giải pháp công nghệ tiên tiến.',
            environment:
                'Môi trường làm việc năng động, sáng tạo với công nghệ hiện đại và cơ hội học hỏi từ các chuyên gia quốc tế.',
        },
        en: {
            name: 'Samsung Vietnam',
            industry: 'Technology',
            size: '10,000+ employees',
            founded: '1969',
            headquarters: 'Seoul, South Korea',
            website: 'www.samsung.com/vn',
            phone: '(028) 3911 0000',
            address: '15th Floor, Bitexco Financial Tower, 2 Hai Trieu, District 1, HCMC',
            workingHours: 'Monday - Friday (8:00 - 17:30)',
            description:
                'Samsung is a leading global technology conglomerate, specializing in consumer electronics, mobile devices, and advanced technology solutions.',
            environment:
                'Dynamic and creative working environment with modern technology and opportunities to learn from international experts.',
        },
    };

    const data = samsungData[language];

    return (
        <div>
            <div className={styles.banner}>
                <div className={styles.bannerContent}>
                    <div className={styles.logoContainer}>
                        <img src={SamsungLogo} alt="Samsung Logo" />
                    </div>
                    <div className={styles.companyInfo}>
                        <h1>{data.name}</h1>
                        <p className={styles.industry}>{data.industry}</p>
                        <div className={styles.details}>
                            <p>
                                <i className="fas fa-map-marker-alt"></i>
                                {data.address}
                            </p>
                            <p>
                                <i className="fas fa-users"></i>
                                {data.size}
                            </p>
                            <p>
                                <i className="fas fa-calendar-alt"></i>
                                {t.founded}: {data.founded}
                            </p>
                        </div>
                        <button className={styles.viewJobsBtn} onClick={() => onPageChange(1, 'samsung')}>
                            {t.viewJobs}
                        </button>
                    </div>
                </div>
            </div>

            <div className={styles.mainLayout}>
                <div className={styles.contentMain}>
                    <div className={styles.contentSection}>
                        <h2>{t.generalInfo}</h2>
                        <div className={styles.generalInfoContent}>
                            <div className={styles.infoItem}>
                                <span>{t.industry}</span>
                                <p>{data.industry}</p>
                            </div>
                            <div className={styles.infoItem}>
                                <span>{t.companySize}</span>
                                <p>{data.size}</p>
                            </div>
                            <div className={styles.infoItem}>
                                <span>{t.headquarters}</span>
                                <p>{data.headquarters}</p>
                            </div>
                            <div className={styles.infoItem}>
                                <span>{t.website}</span>
                                <p>
                                    <a href="https://www.samsung.com/vn" target="_blank" rel="noopener noreferrer">
                                        {data.website}
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className={styles.contentSection}>
                        <h2>{t.companyDescription}</h2>
                        <p>{data.description}</p>
                    </div>

                    <div className={styles.contentSection}>
                        <h2>{t.workEnvironment}</h2>
                        <p>{data.environment}</p>
                    </div>

                    <div className={styles.contentSection}>
                        <h2>{t.contactInfo}</h2>
                        <p><strong>{t.phone}:</strong> {data.phone}</p>
                        <p><strong>{t.address}:</strong> {data.address}</p>
                        <p><strong>{t.workingHours}:</strong> {data.workingHours}</p>
                    </div>
                </div>

                <div className={styles.sidebar}>
                    <div className={styles.suggestionButton}>
                        <div className={styles.btn} onClick={() => alert(t.alertMessage)}>
                            <i className="fa-solid fa-building"></i>
                            {t.companySuggestions}
                        </div>
                    </div>

                    <div className={styles.companiesList}>
                        {[
                            { logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg', name: language === 'vi' ? 'Google Việt Nam' : 'Google Vietnam' },
                            { logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg', name: language === 'vi' ? 'Microsoft Việt Nam' : 'Microsoft Vietnam' },
                            { logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg', name: language === 'vi' ? 'Apple Việt Nam' : 'Apple Vietnam' }
                        ].map((company, index) => (
                            <div key={index} className={styles.companyItem}>
                                <div className={styles.companyLogo}>
                                    <img src={company.logo} alt="logo" onError={(e) => { e.target.src = 'https://via.placeholder.com/24x24?text=Logo'; }} />
                                </div>
                                <div className={styles.companyName}>{company.name}</div>
                                <div className={styles.heartIcon} onClick={() => alert(t.alertMessage)}>
                                    <i className="fa-regular fa-heart"></i>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyDetail;