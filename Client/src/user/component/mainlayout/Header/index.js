// import MenuItem from './menu/MenuList';
// import Menu from './menu/Menu';
// import routesConfig from '~/config/routes';

// import Onback from '~/component/BackButton';
import { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './Header.module.scss';

const cx = classNames.bind(styles);

function Header() {
    const [language, setLanguage] = useState('vi');
    const translations = {
        vi: {
            community: 'Cộng đồng',
            jobs: 'Việc làm',
            company: 'Công ty',
            contact: 'Liên hệ',
            signIn: 'Đăng nhập',
            signUp: 'Đăng ký',
            forum: 'Diễn đàn JobConnect4Students',
            createPost: 'Tạo bài viết mới',
            postPlaceholder: 'Chia sẻ suy nghĩ của bạn...',
            post: 'Đăng bài',
            like: 'Thích',
            comment: 'Bình luận',
            share: 'Chia sẻ',
            writeComment: 'Viết bình luận...',
            send: 'Gửi',
        },
        en: {
            community: 'Community',
            jobs: 'Jobs',
            company: 'Company',
            contact: 'Contact',
            signIn: 'Log In',
            signUp: 'Sign Up',
            forum: 'JobConnect4Students Forum',
            createPost: 'Create New Post',
            postPlaceholder: 'Share your thoughts...',
            post: 'Post',
            like: 'Like',
            comment: 'Comment',
            share: 'Share',
            writeComment: 'Write a comment...',
            send: 'Send',
        },
    };

    const t = translations[language];
    return (
        <nav className={cx(' newNavbar navbar navbar-expand-lg bg-white shadow-sm')}>
            <div className="container">
                <span className="navbar-brand fw-bold" style={{ fontSize: '24px' }}>
                    <span style={{ color: '#007bff' }}>JobConnect</span>
                    <span style={{ color: '#28a745' }}>4Students</span>
                </span>
                <ul className="navbar-nav ms-auto">
                    <li className="nav-item">
                        <span className="nav-link" style={{ cursor: 'pointer' }}>
                            {t.company}
                        </span>
                    </li>
                    <li className="nav-item">
                        <span className="nav-link" style={{ cursor: 'pointer' }}>
                            {t.jobs}
                        </span>
                    </li>
                    <li className="nav-item">
                        <span className="nav-link active">{t.community}</span>
                    </li>
                    <li className="nav-item">
                        <span className="nav-link" style={{ cursor: 'pointer' }}>
                            {t.contact}
                        </span>
                    </li>
                    <li className="nav-item">
                        <button className="btn btn-primary me-2">{t.signIn}</button>
                    </li>
                    <li className="nav-item">
                        <button className="btn btn-primary">{t.signUp}</button>
                    </li>
                </ul>
                <button
                    className="btn btn-outline-secondary ms-3"
                    onClick={() => setLanguage(language === 'vi' ? 'en' : 'vi')}
                    style={{ padding: '6px 12px' }}
                >
                    <img
                        src={language === 'vi' ? 'vietnam-flag.svg' : 'uk-flag.svg'}
                        alt={language === 'vi' ? 'VI' : 'EN'}
                        style={{ width: '20px', height: '14px' }}
                    />
                </button>
            </div>
        </nav>
    );
}

export default Header;
