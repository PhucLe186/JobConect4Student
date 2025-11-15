import React, { useState } from 'react';
import './stylee.scss';

const Contact = ({ onPageChange }) => {
  const [language, setLanguage] = useState('vi');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const translations = {
    vi: {
      company: 'Công ty',
      jobs: 'Việc làm',
      community: 'Cộng đồng',
      contact: 'Liên hệ',
      signIn: 'Đăng nhập',
      signUp: 'Đăng ký',
      supportCenter: 'Trung tâm Hỗ trợ',
      contactUs: 'Liên hệ với chúng tôi',
      contactDesc: 'Chúng tôi luôn sẵn sàng hỗ trợ bạn. Hãy gửi câu hỏi hoặc phản hồi của bạn.',
      name: 'Họ và tên',
      email: 'Email',
      subject: 'Chủ đề',
      message: 'Tin nhắn',
      send: 'Gửi tin nhắn',
      quickSupport: 'Hỗ trợ nhanh',
      faq: 'Câu hỏi thường gặp',
      howToApply: 'Làm thế nào để ứng tuyển?',
      howToApplyAnswer: 'Bạn có thể ứng tuyển bằng cách bấm nút "Ứng tuyển ngay" trên trang chi tiết công việc.',
      howToCreateAccount: 'Làm thế nào để tạo tài khoản?',
      howToCreateAccountAnswer: 'Bấm nút "Đăng ký" ở góc trên bên phải và điền thông tin cần thiết.',
      howToSearch: 'Làm thế nào để tìm kiếm việc làm?',
      howToSearchAnswer: 'Sử dụng thanh tìm kiếm và các bộ lọc để tìm công việc phù hợp với bạn.',
      contactInfo: 'Thông tin liên hệ',
      address: 'Địa chỉ',
      phone: 'Điện thoại',
      workingHours: 'Giờ làm việc',
      workingTime: 'Thứ 2 - Thứ 6: 8:00 - 17:30'
    },
    en: {
      company: 'Company',
      jobs: 'Jobs',
      community: 'Community',
      contact: 'Contact',
      signIn: 'Log In',
      signUp: 'Sign Up',
      supportCenter: 'Support Center',
      contactUs: 'Contact Us',
      contactDesc: 'We are always ready to help you. Send us your questions or feedback.',
      name: 'Full Name',
      email: 'Email',
      subject: 'Subject',
      message: 'Message',
      send: 'Send Message',
      quickSupport: 'Quick Support',
      faq: 'Frequently Asked Questions',
      howToApply: 'How to apply for jobs?',
      howToApplyAnswer: 'You can apply by clicking the "Apply Now" button on the job detail page.',
      howToCreateAccount: 'How to create an account?',
      howToCreateAccountAnswer: 'Click the "Sign Up" button in the top right corner and fill in the required information.',
      howToSearch: 'How to search for jobs?',
      howToSearchAnswer: 'Use the search bar and filters to find jobs that suit you.',
      contactInfo: 'Contact Information',
      address: 'Address',
      phone: 'Phone',
      workingHours: 'Working Hours',
      workingTime: 'Monday - Friday: 8:00 - 17:30'
    }
  };

  const t = translations[language];

  const handleLogin = () => {
    window.location.href = 'http://localhost:3002?mode=login';
  };

  const handleSignup = () => {
    window.location.href = 'http://localhost:3002?mode=signup';
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(language === 'vi' ? 'Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.' : 'Thank you for contacting us! We will respond as soon as possible.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-white shadow-sm">
        <div className="container">
          <span className="navbar-brand fw-bold" style={{fontSize: '24px'}}>
            <span style={{color: '#007bff'}}>JobConnect</span><span style={{color: '#28a745'}}>4Students</span>
          </span>
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <span className="nav-link" style={{cursor: 'pointer'}} onClick={() => onPageChange('company')}>
                {t.company}
              </span>
            </li>
            <li className="nav-item">
              <span className="nav-link" style={{cursor: 'pointer'}} onClick={() => onPageChange(1)}>
                {t.jobs}
              </span>
            </li>
            <li className="nav-item">
              <span className="nav-link" style={{cursor: 'pointer'}} onClick={() => onPageChange('community')}>
                {t.community}
              </span>
            </li>
            <li className="nav-item">
              <span className="nav-link active">{t.contact}</span>
            </li>
            <li className="nav-item">
              <button className="btn btn-primary me-2" onClick={handleLogin}>
                {t.signIn}
              </button>
            </li>
            <li className="nav-item">
              <button className="btn btn-primary" onClick={handleSignup}>
                {t.signUp}
              </button>
            </li>
          </ul>
          <button
            className="btn btn-outline-secondary ms-3"
            onClick={() => setLanguage(language === 'vi' ? 'en' : 'vi')}
            style={{ padding: "6px 12px" }}
          >
            <img
              src={language === 'vi' ? 'vietnam-flag.svg' : 'uk-flag.svg'}
              alt={language === 'vi' ? 'VI' : 'EN'}
              style={{ width: "20px", height: "14px" }}
            />
          </button>
        </div>
      </nav>

      <div className="container mt-4">
        <div className="text-center mb-5">
          <h2 style={{color: '#007bff', marginBottom: '15px'}}>{t.supportCenter}</h2>
          <p style={{color: '#666', fontSize: '18px'}}>{t.contactDesc}</p>
        </div>

        <div className="row">
          <div className="col-md-8">
            <div style={{background: '#fff', borderRadius: '8px', padding: '30px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'}}>
              <h3 style={{color: '#007bff', marginBottom: '20px'}}>{t.contactUs}</h3>
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">{t.name}</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">{t.email}</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">{t.subject}</label>
                  <input
                    type="text"
                    className="form-control"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">{t.message}</label>
                  <textarea
                    className="form-control"
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary btn-lg">
                  {t.send}
                </button>
              </form>
            </div>
          </div>

          <div className="col-md-4">
            <div style={{background: '#fff', borderRadius: '8px', padding: '25px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)', marginBottom: '20px'}}>
              <h4 style={{color: '#007bff', marginBottom: '20px'}}>{t.contactInfo}</h4>
              <div style={{marginBottom: '15px'}}>
                <i className="fas fa-map-marker-alt" style={{color: '#007bff', marginRight: '10px'}}></i>
                <strong>{t.address}:</strong><br/>
                <span style={{marginLeft: '25px'}}>497 Hoa Hao Street, Ward 7, District 10, Ho Chi Minh City</span>
              </div>
              <div style={{marginBottom: '15px'}}>
                <i className="fas fa-phone" style={{color: '#007bff', marginRight: '10px'}}></i>
                <strong>{t.phone}:</strong><br/>
                <span style={{marginLeft: '25px'}}>0943009243</span>
              </div>
              <div style={{marginBottom: '15px'}}>
                <i className="fas fa-envelope" style={{color: '#007bff', marginRight: '10px'}}></i>
                <strong>Email:</strong><br/>
                <span style={{marginLeft: '25px'}}>support@jobconnect4students.com</span>
              </div>
              <div>
                <i className="fas fa-clock" style={{color: '#007bff', marginRight: '10px'}}></i>
                <strong>{t.workingHours}:</strong><br/>
                <span style={{marginLeft: '25px'}}>{t.workingTime}</span>
              </div>
            </div>

            <div style={{background: '#fff', borderRadius: '8px', padding: '25px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'}}>
              <h4 style={{color: '#007bff', marginBottom: '20px'}}>{t.faq}</h4>
              <div style={{marginBottom: '15px'}}>
                <strong style={{color: '#333'}}>{t.howToApply}</strong>
                <p style={{margin: '5px 0 0', color: '#666', fontSize: '14px'}}>{t.howToApplyAnswer}</p>
              </div>
              <div style={{marginBottom: '15px'}}>
                <strong style={{color: '#333'}}>{t.howToCreateAccount}</strong>
                <p style={{margin: '5px 0 0', color: '#666', fontSize: '14px'}}>{t.howToCreateAccountAnswer}</p>
              </div>
              <div>
                <strong style={{color: '#333'}}>{t.howToSearch}</strong>
                <p style={{margin: '5px 0 0', color: '#666', fontSize: '14px'}}>{t.howToSearchAnswer}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer style={{marginTop: '50px'}}>
        <div className="container text-center">
          <h5 className="fw-bold text-primary">
            JobConnect <span className="text-success">4Students</span>
          </h5>
          <p>497 Hoa Hao Street, Ward 7, District 10, Ho Chi Minh City</p>
          <p>Hotline : 0943009243</p>
          <div className="mt-2">
            <a href="#">Facebook</a> · <a href="#">Instagram</a> ·
            <a href="#">YouTube</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Contact;