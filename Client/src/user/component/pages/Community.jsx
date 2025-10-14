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

    return <div>this is '/Community'</div>;
};

export default Community;
