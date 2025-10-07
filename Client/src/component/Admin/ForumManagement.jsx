import React from 'react';

const ForumManagement = ({
    t,
    showSection,
    forumPosts,
    searchTerm,
    setSearchTerm,
    filterType,
    setFilterType,
    handleApprovePost,
    handleRejectPost,
    handleDeletePost,
}) => {
    return (
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
                                    <span className={`status ${post.status === 'active' ? 'active' : 'pending'}`}>
                                        {post.status === 'active' ? t.active : t.pending}
                                    </span>
                                </td>
                                <td>
                                    {[
                                        { label: t.view, className: 'btn-view', onClick: null },
                                        ...(post.status === 'pending' ? [
                                            { label: t.approve, className: 'btn-edit', onClick: () => handleApprovePost(post.id) },
                                            { label: t.reject, className: 'btn-delete', onClick: () => handleRejectPost(post.id) }
                                        ] : [
                                            { label: t.edit, className: 'btn-edit', onClick: null },
                                            { label: t.delete, className: 'btn-delete', onClick: () => handleDeletePost(post.id) }
                                        ])
                                    ].map((btn, index) => (
                                        <button key={index} className={btn.className} onClick={btn.onClick}>
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
