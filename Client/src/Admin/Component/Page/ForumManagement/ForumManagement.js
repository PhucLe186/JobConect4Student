import React, { useState } from 'react';
import classNames from 'classnames/bind';
import { useNavigate } from 'react-router-dom';
import { useAdminLanguage } from '../../../Context/AdminLanguageContext';
import adminTranslations from '../../../Translation/AdminTranslations';
import styles from './ForumManagement.module.scss';
const cx = classNames.bind(styles);

const ForumManagement = () => {
    const Navigate = useNavigate();
    const { language } = useAdminLanguage();
    const t = adminTranslations[language];
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
    const handleBack = () => {
        Navigate('/dashboard')
    }
    
    const handleView = (post) => {
        alert(`Xem bài viết: ${post.title}\nTác giả: ${post.author}\nBình luận: ${post.comments}\nNgày: ${post.date}`);
    }
    
    const handleEdit = (post) => {
        alert(`Chỉnh sửa bài viết: ${post.title}`);
    }
    
    const handleDelete = (post) => {
        if (window.confirm(`Bạn có chắc muốn xóa bài viết "${post.title}"?`)) {
            setForumPosts(forumPosts.filter(p => p.id !== post.id));
            alert(`Đã xóa bài viết: ${post.title}`);
        }
    }
    
    const handleApprove = (post) => {
        setForumPosts(forumPosts.map(p => p.id === post.id ? {...p, status: 'active'} : p));
        alert(`Đã duyệt bài viết: ${post.title}`);
    }
    
    const handleReject = (post) => {
        if (window.confirm(`Bạn có chắc muốn từ chối bài viết "${post.title}"?`)) {
            setForumPosts(forumPosts.filter(p => p.id !== post.id));
            alert(`Đã từ chối bài viết: ${post.title}`);
        }
    }
    return (
        <div className={cx('content-section')}>
            <button className={cx('back-btn')} onClick={handleBack}>{t.backToDashboard}</button>
            <h2>{t.forumManagement}</h2>
            <div className={cx('forum-stats')}>
                <div className={cx('forum-stat-card')}>
                    <h4>{t.totalPosts}</h4>
                    <span>245</span>
                </div>
                <div className={cx('forum-stat-card')}>
                    <h4>{t.comments}</h4>
                    <span>1,832</span>
                </div>
                <div className={cx('forum-stat-card')}>
                    <h4>{t.activeMembers}</h4>
                    <span>156</span>
                </div>
            </div>
            <div className={cx('section-controls')}>
                <div className={cx('search-filter-container')}>
                    <input
                        type="text"
                        className={cx('section-search')}
                        // placeholder={t.searchPosts}
                        // value={searchTerm}
                        // onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select
                        className={cx('filter-dropdown')}
                        // value={filterType}
                        // onChange={(e) => setFilterType(e.target.value)}
                    >
                        <option value="all">{t.all}</option>
                        <option value="recent">{t.recent}</option>
                    </select>
                </div>
            </div>
            <div className={cx('table-container')}>
                <table className={cx('data-table')}>
                    <thead>
                        <tr>
                            {[
                                { key: 'title', label: t.title },
                                { key: 'author', label: t.author },
                                { key: 'comments', label: t.comments },
                                { key: 'postDate', label: t.postDate },
                                { key: 'status', label: t.status },
                                { key: 'actions', label: t.actions },
                            ].map((column) => (
                                <th key={column.key}>{column.label}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {forumPosts.map((post) => (
                            <tr key={post.id}>
                                <td>{post.title}</td>
                                <td>{post.author}</td>
                                <td>{post.comments}</td>
                                <td>{post.date}</td>
                                <td>
                                    <span className={cx('status', post.status === 'active' ? 'active' : 'pending')}>
                                        {post.status === 'active' ? t.active : t.pending}
                                    </span>
                                </td>
                                <td>
                                    {[
                                        { label: t.view, className: 'btn-view', onClick: () => handleView(post) },
                                        ...(post.status === 'pending'
                                            ? [
                                                  {
                                                      label: t.approve,
                                                      className: 'btn-edit',
                                                      onClick: () => handleApprove(post),
                                                  },
                                                  {
                                                      label: t.reject,
                                                      className: 'btn-delete',
                                                      onClick: () => handleReject(post),
                                                  },
                                              ]
                                            : [
                                                  { label: t.edit, className: 'btn-edit', onClick: () => handleEdit(post) },
                                                  {
                                                      label: t.delete,
                                                      className: 'btn-delete',
                                                      onClick: () => handleDelete(post),
                                                  },
                                              ]),
                                    ].map((btn, index) => (
                                        <button key={index} className={cx(btn.className)} onClick={btn.onClick}>
                                            {btn.label}
                                        </button>
                                    ))}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ForumManagement;
