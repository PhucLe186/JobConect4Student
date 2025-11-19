import React, { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './ForumManagement.module.scss';
import { useNavigate } from 'react-router-dom';
const cx = classNames.bind(styles);

const ForumManagement = () => {
    const Navigate=useNavigate()
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
    const handleBack=()=> {
        Navigate('/dashboard')
    }
    return (
        <div className={cx('content-section')}>
            <button className={cx('back-btn')} onClick={handleBack}>backToDashboard</button>
            <h2>forumManagement</h2>
            <div className={cx('forum-stats')}>
                <div className={cx('forum-stat-card')}>
                    <h4>totalPostsCount</h4>
                    <span>245</span>
                </div>
                <div className={cx('forum-stat-card')}>
                    <h4>comments</h4>
                    <span>1,832</span>
                </div>
                <div className={cx('forum-stat-card')}>
                    <h4>activeMembers</h4>
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
                        <option value="all">all</option>
                        <option value="recent">recent</option>
                    </select>
                </div>
            </div>
            <div className={cx('table-container')}>
                <table className={cx('data-table')}>
                    <thead>
                        <tr>
                            {[
                                { key: 'title', label: 'title' },
                                { key: 'author', label: 'author' },
                                { key: 'comments', label: 'comments' },
                                { key: 'postDate', label: 'postDate' },
                                { key: 'status', label: 'status' },
                                { key: 'actions', label: 'actions' },
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
                                        {post.status === 'active' ? 'active' : 'pending'}
                                    </span>
                                </td>
                                <td>
                                    {[
                                        { label: 'view', className: 'btn-view', onClick: null },
                                        ...(post.status === 'pending'
                                            ? [
                                                  {
                                                      label: 'approve',
                                                      className: 'btn-edit',
                                                      //   onClick: () => handleApprovePost(post.id),
                                                  },
                                                  {
                                                      label: 'reject',
                                                      className: 'btn-delete',
                                                      //   onClick: () => handleRejectPost(post.id),
                                                  },
                                              ]
                                            : [
                                                  { label: 'edit', className: 'btn-edit', onClick: null },
                                                  {
                                                      label: 'delete',
                                                      className: 'btn-delete',
                                                      //   onClick: () => handleDeletePost(post.id),
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
