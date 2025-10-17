import React, { useState } from 'react';

const Community = ({ onPageChange }) => {
  const [language, setLanguage] = useState('vi');
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: 'Nguyễn Văn A',
      avatar: 'https://via.placeholder.com/40x40?text=A',
      time: '2 giờ trước',
      content: 'Xin chào mọi người! Mình vừa tốt nghiệp và đang tìm việc làm trong lĩnh vực IT. Có ai có kinh nghiệm chia sẻ không ạ?',
      likes: 15,
      comments: [
        { id: 1, author: 'Trần Thị B', content: 'Chúc bạn tìm được việc phù hợp!', time: '1 giờ trước' },
        { id: 2, author: 'Lê Văn C', content: 'Bạn có thể tham khảo các trang tuyển dụng như TopCV, VietnamWorks', time: '30 phút trước' }
      ]
    },
    {
      id: 2,
      author: 'Phạm Thị D',
      avatar: 'https://via.placeholder.com/40x40?text=D',
      time: '5 giờ trước',
      content: 'Chia sẻ kinh nghiệm phỏng vấn tại công ty Samsung. Các câu hỏi chủ yếu về technical và soft skills.',
      likes: 28,
      comments: [
        { id: 1, author: 'Hoàng Văn E', content: 'Cảm ơn bạn đã chia sẻ!', time: '3 giờ trước' }
      ]
    }
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
      send: 'Gửi'
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
      send: 'Send'
    }
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
        comments: []
      };
      setPosts([post, ...posts]);
      setNewPost('');
    }
  };

  const handleAddComment = (postId) => {
    if (newComment[postId]?.trim()) {
      setPosts(posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...post.comments, {
              id: post.comments.length + 1,
              author: 'Bạn',
              content: newComment[postId],
              time: 'Vừa xong'
            }]
          };
        }
        return post;
      }));
      setNewComment({ ...newComment, [postId]: '' });
    }
  };

  const handleLike = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return { ...post, likes: post.likes + 1 };
      }
      return post;
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <span className="text-2xl font-bold">
              <span className="text-blue-600">JobConnect</span><span className="text-green-600">4Students</span>
            </span>
            <div className="flex items-center space-x-6">
              <span className="cursor-pointer hover:text-blue-600" onClick={() => onPageChange('company')}>
                {t.company}
              </span>
              <span className="cursor-pointer hover:text-blue-600" onClick={() => onPageChange(1)}>
                {t.jobs}
              </span>
              <span className="text-blue-600 font-medium">{t.community}</span>
              <span className="cursor-pointer hover:text-blue-600" onClick={() => onPageChange('contact')}>
                {t.contact}
              </span>
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={handleLogin}>
                {t.signIn}
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={handleSignup}>
                {t.signUp}
              </button>
              <button
                className="border border-gray-300 px-3 py-1.5 rounded hover:bg-gray-50"
                onClick={() => setLanguage(language === "vi" ? "en" : "vi")}
              >
                <img
                  src={language === "vi" ? "vietnam-flag.svg" : "uk-flag.svg"}
                  alt={language === "vi" ? "VI" : "EN"}
                  className="w-5 h-3.5"
                />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-blue-600 text-center mb-8">{t.forum}</h2>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">{t.createPost}</h4>
          <div className="space-y-4">
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder={t.postPlaceholder}
              rows="3"
              className="w-full p-4 border-2 border-gray-200 rounded-lg resize-y focus:outline-none focus:border-blue-600"
            />
            <button onClick={handleCreatePost} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
              {t.post}
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {posts.map(post => (
            <div key={post.id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <img src={post.avatar} alt="avatar" className="w-10 h-10 rounded-full mr-4" />
                <div>
                  <h5 className="font-medium text-gray-800">{post.author}</h5>
                  <span className="text-sm text-gray-500">{post.time}</span>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-gray-800 leading-relaxed">{post.content}</p>
              </div>
              
              <div className="flex gap-4 mb-4 pt-4 border-t border-gray-200">
                <button onClick={() => handleLike(post.id)} className="flex items-center text-gray-600 hover:bg-gray-50 hover:text-blue-600 px-2 py-1 rounded transition-colors">
                  <i className="fa-regular fa-heart mr-2"></i> {t.like} ({post.likes})
                </button>
                <button className="flex items-center text-gray-600 hover:bg-gray-50 hover:text-blue-600 px-2 py-1 rounded transition-colors">
                  <i className="fa-regular fa-comment mr-2"></i> {t.comment} ({post.comments.length})
                </button>
                <button className="flex items-center text-gray-600 hover:bg-gray-50 hover:text-blue-600 px-2 py-1 rounded transition-colors">
                  <i className="fa-regular fa-share-from-square mr-2"></i> {t.share}
                </button>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                {post.comments.map(comment => (
                  <div key={comment.id} className="bg-gray-50 p-3 rounded-lg mb-3">
                    <strong className="text-gray-800 text-sm">{comment.author}</strong>
                    <p className="text-gray-700 text-sm mt-1">{comment.content}</p>
                    <span className="text-gray-500 text-xs">{comment.time}</span>
                  </div>
                ))}
                
                <div className="flex gap-3 mt-4">
                  <input
                    type="text"
                    value={newComment[post.id] || ''}
                    onChange={(e) => setNewComment({...newComment, [post.id]: e.target.value})}
                    placeholder={t.writeComment}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-600"
                  />
                  <button onClick={() => handleAddComment(post.id)} className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">
                    {t.send}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <h5 className="text-lg font-bold">
            <span className="text-blue-600">JobConnect</span> <span className="text-green-600">4Students</span>
          </h5>
          <p className="text-gray-600 mt-2">497 Hoa Hao Street, Ward 7, District 10, Ho Chi Minh City</p>
          <p className="text-gray-600">Hotline : 0943009243</p>
          <div className="mt-4 space-x-2">
            <a href="#" className="text-blue-600 hover:underline">Facebook</a> ·
            <a href="#" className="text-blue-600 hover:underline">Instagram</a> ·
            <a href="#" className="text-blue-600 hover:underline">YouTube</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Community;