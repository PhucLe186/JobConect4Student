import React, { useState } from 'react';

const Community = ({ onPageChange }) => {
    const [language, setLanguage] = useState('vi');
    const [posts, setPosts] = useState([
        {
            id: 1,
            author: 'Nguyễn Văn A',
            avatar: 'https://via.placeholder.com/40x40?text=A',
            time: '2 giờ trước',
            content:
                'Xin chào mọi người! Mình vừa tốt nghiệp và đang tìm việc làm trong lĩnh vực IT. Có ai có kinh nghiệm chia sẻ không ạ?',
            likes: 15,
            comments: [
                { id: 1, author: 'Trần Thị B', content: 'Chúc bạn tìm được việc phù hợp!', time: '1 giờ trước' },
                {
                    id: 2,
                    author: 'Lê Văn C',
                    content: 'Bạn có thể tham khảo các trang tuyển dụng như TopCV, VietnamWorks',
                    time: '30 phút trước',
                },
            ],
        },
        {
            id: 2,
            author: 'Phạm Thị D',
            avatar: 'https://via.placeholder.com/40x40?text=D',
            time: '5 giờ trước',
            content:
                'Chia sẻ kinh nghiệm phỏng vấn tại công ty Samsung. Các câu hỏi chủ yếu về technical và soft skills.',
            likes: 28,
            comments: [{ id: 1, author: 'Hoàng Văn E', content: 'Cảm ơn bạn đã chia sẻ!', time: '3 giờ trước' }],
        },
    ]);
    const [newPost, setNewPost] = useState('');
    const [newComment, setNewComment] = useState({});

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

    const handleLogin = () => {
        window.location.href = 'http://localhost:3002?mode=login';
    };

    const handleSignup = () => {
        window.location.href = 'http://localhost:3002?mode=signup';
    };

    const handleCreatePost = () => {
        if (newPost.trim()) {
            const post = {
                id: posts.length + 1,
                author: 'Bạn',
                avatar: 'https://via.placeholder.com/40x40?text=U',
                time: 'Vừa xong',
                content: newPost,
                likes: 0,
                comments: [],
            };
            setPosts([post, ...posts]);
            setNewPost('');
        }
    };

    const handleAddComment = (postId) => {
        if (newComment[postId]?.trim()) {
            setPosts(
                posts.map((post) => {
                    if (post.id === postId) {
                        return {
                            ...post,
                            comments: [
                                ...post.comments,
                                {
                                    id: post.comments.length + 1,
                                    author: 'Bạn',
                                    content: newComment[postId],
                                    time: 'Vừa xong',
                                },
                            ],
                        };
                    }
                    return post;
                }),
            );
            setNewComment({ ...newComment, [postId]: '' });
        }
    };

    const handleLike = (postId) => {
        setPosts(
            posts.map((post) => {
                if (post.id === postId) {
                    return { ...post, likes: post.likes + 1 };
                }
                return post;
            }),
        );
    };

    return (
        <div className="community-page">
            <div className="container mt-4">
                <h2 className="forum-title">{t.forum}</h2>

                <div className="create-post-section">
                    <h4>{t.createPost}</h4>
                    <div className="post-input">
                        <textarea
                            value={newPost}
                            onChange={(e) => setNewPost(e.target.value)}
                            placeholder={t.postPlaceholder}
                            rows="3"
                        />
                        <button onClick={handleCreatePost} className="btn btn-primary">
                            {t.post}
                        </button>
                    </div>
                </div>

                <div className="posts-section">
                    {posts.map((post) => (
                        <div key={post.id} className="post-card">
                            <div className="post-header">
                                <img src={post.avatar} alt="avatar" className="avatar" />
                                <div className="post-info">
                                    <h5>{post.author}</h5>
                                    <span className="post-time">{post.time}</span>
                                </div>
                            </div>

                            <div className="post-content">
                                <p>{post.content}</p>
                            </div>

                            <div className="post-actions">
                                <button onClick={() => handleLike(post.id)} className="action-btn">
                                    <i className="fa-regular fa-heart"></i> {t.like} ({post.likes})
                                </button>
                                <button className="action-btn">
                                    <i className="fa-regular fa-comment"></i> {t.comment} ({post.comments.length})
                                </button>
                                <button className="action-btn">
                                    <i className="fa-regular fa-share-from-square"></i> {t.share}
                                </button>
                            </div>

                            <div className="comments-section">
                                {post.comments.map((comment) => (
                                    <div key={comment.id} className="comment">
                                        <strong>{comment.author}</strong>
                                        <p>{comment.content}</p>
                                        <span className="comment-time">{comment.time}</span>
                                    </div>
                                ))}

                                <div className="add-comment">
                                    <input
                                        type="text"
                                        value={newComment[post.id] || ''}
                                        onChange={(e) => setNewComment({ ...newComment, [post.id]: e.target.value })}
                                        placeholder={t.writeComment}
                                    />
                                    <button
                                        onClick={() => handleAddComment(post.id)}
                                        className="btn btn-sm btn-primary"
                                    >
                                        {t.send}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
export default Community;
