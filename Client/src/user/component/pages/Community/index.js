import React, { useContext, useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import style from './Community.module.scss';
import { AuthContext } from '~/context/AuthContext';
import translations from '~/component/Translation';
const cx = classNames.bind(style);

const Community = () => {
    const {language, api}= useContext(AuthContext);
    const [posts, setPosts] = useState([])
    const [Content, setContent] = useState('');
    const [Comment, setComment] = useState('');
    const t = translations[language];

    function timeAgo(dateString) {
        const now = Date.now();
        const postTime = new Date(dateString).getTime();
        const diffMs = now - postTime;

        const seconds = Math.floor(diffMs / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days} ngày trước`;
        if (hours > 0) return `${hours} giờ trước`;
        if (minutes > 0) return `${minutes} phút trước`;
        return 'Vừa xong';
    }
    useEffect(()=> {
        const fetchData= async()=> {
            const res= await api.get('forum')
            if(res.data) {
                setPosts(res.data)
            }
        }
        fetchData()
    },[posts.likes||posts.comments])

    const handleLike = async(postId) => {
       try{
            const res= await api.post('likes', {post_id:postId})
            if( res.data) {
                setPosts(prevPosts =>
                prevPosts.map(post =>
                post.id === postId
                    ? { ...post, likes: post.likes + 1 }
                    : post
                )
            );
            }
       }catch(error) {
        if(error.response) {
            alert(error?.response?.data?.message)
        }
        else {
            alert('lỗi kết nối server')
        }
       }
    };

    const handleCreatePost = async() => {
        console.log('ok')
        if (Content.trim()!=='') {
            const res= await api.post('forum', {content:Content})
            console.log(res.data)
            const newPost=res.data
            setPosts(prev=> ([
                {
                    "id": newPost?._id,
                    "author": 'bạn',
                    "content": newPost?.content,
                    "image_path": null,
                    "time": timeAgo(newPost?.created_at),
                    "like": 0,
                    "comments": []
                },
                ...prev
            ]))
        setContent('');
        }
        else{
            alert('không được để trống vui lòng nhập content')
        }
    };

    const handleAddComment = async(postId) => {
        if (Comment[postId]?.trim()!=='') {
            const res= await api.post('comment', {post_id:postId, content:Comment[postId]})
            if(res.data) {
                setPosts(prev=> 
                    prev.map(post=> 
                        post?.id===postId? {
                            ...post,
                            comments:[...post.comments, res.data]
                        }:post
                    )
                )
            }
            setComment( prev => ({ ...prev, [postId]: "" }));
            
        }
        else {
            alert('looix')
            setComment( prev => ({ ...prev, [postId]: "" }));
        }
    };

       
    return (
        
        <div className={cx('community-page')}>
            <div className={cx('container mt-4')}>
                <h2 className={cx('forum-title')}>
                    {t.forum} <span style={{ color: '#007bff' }}>JobConnect</span><span style={{ color: '#28a745' }}>4Students</span>
                </h2>

                <div className={cx('create-post-section')}>
                    <h4>{t.createPost}</h4>
                    <div className={cx('post-input')}>
                        <textarea
                            value={Content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder={t.postPlaceholder}
                            rows="3"
                        />
                        <button onClick={handleCreatePost} className={cx('btn btn-primary')}>
                            {t.post}
                        </button>
                    </div>
                </div>

                <div className={cx('posts-section')}>
                    {posts?.map((post) => (
                        <div key={post.id} className={cx('post-card')}>
                            <div className={cx('post-header')}>
                                <img src={post.avatar} alt="avatar" className={cx('avatar')} />
                                <div className={cx('post-info')}>
                                    <h5>{post.author}</h5>
                                    <span className={cx('post-time')}>{timeAgo(post.time)}</span>
                                </div>
                            </div>

                            <div className={cx('post-content')}>
                                <p>{post.content}</p>
                            </div>

                            <div className={cx('post-actions')}>
                                <button 
                                onClick={() => handleLike(post.id)}
                                className={cx('action-btn')}>
                                    <i className={cx('fa-regular fa-heart')}></i> {t.like} ({post.likes})
                                </button>
                                <button className={cx('action-btn')}>
                                    <i className={cx('fa-regular fa-comment')}></i> {t.comment} ({post.comments.length})
                                </button>
                                <button className={cx('action-btn')}>
                                    <i className={cx('fa-regular fa-share-from-square')}></i> {t.share}
                                </button>
                            </div>

                            <div className={cx('comments-section')}>
                                {post.comments.map((comment) => (
                                    <div key={comment.id} className={cx('comment')}>
                                        <strong>{comment.author}</strong>
                                        <p>{comment.content}</p>
                                        <span className={cx('comment-time')}>{timeAgo(comment.time)}</span>
                                    </div>
                                ))}

                                <div className={cx('add-comment')}>
                                    <input
                                        type="text"
                                        value={Comment[post.id]||''}
                                        onChange={(e) => setComment(prev => ({
                                            ...prev,
                                            [post.id]: e.target.value
                                        }))}
                                        placeholder={t.writeComment}
                                    />
                                    <button
                                        onClick={() => handleAddComment(post.id)}
                                        className={cx('btn btn-sm btn-primary')}
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
