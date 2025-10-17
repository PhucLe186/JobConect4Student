import React, { useState } from "react";
import "./stylee.scss";

const Contact = ({ onPageChange }) => {
  const [language, setLanguage] = useState("vi");

  const translations = {
    vi: {
      company: "Công ty",
      jobs: "Việc làm",
      community: "Cộng đồng",
      contact: "Liên hệ",
      signIn: "Đăng nhập",
      signUp: "Đăng ký",
      contactUs: "Liên hệ với chúng tôi",
      name: "Họ và tên",
      email: "Email",
      message: "Tin nhắn",
      send: "Gửi"
    },
    en: {
      company: "Company",
      jobs: "Jobs",
      community: "Community",
      contact: "Contact",
      signIn: "Log In",
      signUp: "Sign Up",
      contactUs: "Contact Us",
      name: "Full Name",
      email: "Email",
      message: "Message",
      send: "Send"
    }
  };

  const t = translations[language];

  const handleLogin = () => {
    window.location.href = 'http://localhost:3002?mode=login';
  };

  const handleSignup = () => {
    window.location.href = 'http://localhost:3002?mode=signup';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(language === 'vi' ? 'Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm.' : 'Thank you for contacting us! We will respond soon.');
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-white shadow-sm">
        <div className="container">
          <a className="navbar-brand fw-bold" href="#" style={{fontSize: '24px'}}>
            <span style={{color: '#007bff'}}>JobConnect</span><span style={{color: '#28a745'}}>4Students</span>
          </a>
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <a className="nav-link" href="#" onClick={() => onPageChange('company')}>
                {t.company}
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#" onClick={() => onPageChange(1)}>
                {t.jobs}
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#" onClick={() => onPageChange('community')}>
                {t.community}
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link active" href="#">
                {t.contact}
              </a>
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
            onClick={() => setLanguage(language === "vi" ? "en" : "vi")}
            style={{ padding: "6px 12px" }}
          >
            <img
              src={language === "vi" ? "vietnam-flag.svg" : "uk-flag.svg"}
              alt={language === "vi" ? "VI" : "EN"}
              style={{ width: "20px", height: "14px" }}
            />
          </button>
        </div>
      </nav>

      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="contact-card">
              <h2 className="text-center mb-4">{t.contactUs}</h2>
              
              <div className="row">
                <div className="col-md-8">
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label">{t.name}</label>
                      <input type="text" className="form-control" required />
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label">{t.email}</label>
                      <input type="email" className="form-control" required />
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label">{t.message}</label>
                      <textarea className="form-control" rows="5" required></textarea>
                    </div>
                    
                    <div className="text-center">
                      <button type="submit" className="btn btn-primary btn-lg">
                        {t.send}
                      </button>
                    </div>
                  </form>
                </div>
                
                <div className="col-md-4">
                  <div className="contact-info">
                    <h5>Thông tin liên hệ</h5>
                    <div className="info-item">
                      <i className="fa-solid fa-location-dot"></i>
                      <div>
                        <strong>Địa chỉ:</strong>
                        <p>497 Hoa Hao Street, Ward 7, District 10, Ho Chi Minh City</p>
                      </div>
                    </div>
                    <div className="info-item">
                      <i className="fa-solid fa-phone"></i>
                      <div>
                        <strong>Hotline:</strong>
                        <p>0943009243</p>
                      </div>
                    </div>
                    <div className="info-item">
                      <i className="fa-solid fa-envelope"></i>
                      <div>
                        <strong>Email:</strong>
                        <p>contact@jobconnect4students.com</p>
                      </div>
                    </div>
                    <div className="info-item">
                      <i className="fa-solid fa-clock"></i>
                      <div>
                        <strong>Giờ làm việc:</strong>
                        <p>Thứ 2 - Thứ 6: 8:00 - 17:00<br/>Thứ 7: 8:00 - 12:00</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="social-links">
                    <h6>Theo dõi chúng tôi</h6>
                    <div className="social-icons">
                      <a href="#" className="social-icon facebook">
                        <i className="fa-brands fa-facebook-f"></i>
                      </a>
                      <a href="#" className="social-icon instagram">
                        <i className="fa-brands fa-instagram"></i>
                      </a>
                      <a href="#" className="social-icon youtube">
                        <i className="fa-brands fa-youtube"></i>
                      </a>
                      <a href="#" className="social-icon linkedin">
                        <i className="fa-brands fa-linkedin-in"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="map-section mt-4">
                <h5>Vị trí của chúng tôi</h5>
                <div className="map-container">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.6306852350596!2d106.69385731533414!3d10.762622192330687!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f1c06f4e1dd%3A0x43900f1d4539a3d!2s497%20Hoa%20Hao%2C%20Ph%C6%B0%E1%BB%9Dng%207%2C%20Qu%E1%BA%ADn%2010%2C%20Th%C3%A0nh%20ph%E1%BB%91%20H%E1%BB%93%20Ch%C3%AD%20Minh!5e0!3m2!1svi!2s!4v1234567890123!5m2!1svi!2s"
                    width="100%" 
                    height="300" 
                    style={{border: 0, borderRadius: '10px'}} 
                    allowFullScreen="" 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer>
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