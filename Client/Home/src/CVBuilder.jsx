import React, { useState } from "react";
import "./stylee.scss";

const CVBuilder = ({ onPageChange }) => {
  const [language, setLanguage] = useState("vi");
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    objective: '',
    education: '',
    experience: '',
    skills: ''
  });

  const translations = {
    vi: {
      company: "Công ty",
      jobs: "Việc làm", 
      community: "Cộng đồng",
      contact: "Liên hệ",
      signIn: "Đăng nhập",
      signUp: "Đăng ký",
      cvBuilder: "Tạo CV Online",
      personalInfo: "Thông tin cá nhân",
      fullName: "Họ và tên",
      email: "Email",
      phone: "Số điện thoại",
      address: "Địa chỉ",
      objective: "Mục tiêu nghề nghiệp",
      education: "Học vấn",
      experience: "Kinh nghiệm",
      skills: "Kỹ năng",
      preview: "Xem trước CV",
      download: "Tải xuống",
      back: "Quay lại"
    },
    en: {
      company: "Company",
      jobs: "Jobs",
      community: "Community", 
      contact: "Contact",
      signIn: "Log In",
      signUp: "Sign Up",
      cvBuilder: "CV Builder",
      personalInfo: "Personal Information",
      fullName: "Full Name",
      email: "Email",
      phone: "Phone Number",
      address: "Address",
      objective: "Career Objective",
      education: "Education",
      experience: "Experience",
      skills: "Skills",
      preview: "CV Preview",
      download: "Download",
      back: "Back"
    }
  };

  const t = translations[language];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLogin = () => {
    window.location.href = 'http://localhost:3002?mode=login';
  };

  const handleSignup = () => {
    window.location.href = 'http://localhost:3002?mode=signup';
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
              <span className="nav-link" style={{cursor: 'pointer'}} onClick={() => onPageChange('community')}>
                {t.community}
              </span>
            </li>
            <li className="nav-item">
              <span className="nav-link" style={{cursor: 'pointer'}} onClick={() => onPageChange('contact')}>
                {t.contact}
              </span>
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
        <button className="btn btn-secondary mb-3" onClick={() => onPageChange(1)}>
          <i className="fa-solid fa-arrow-left me-2"></i>{t.back}
        </button>
        
        <div className="cv-builder-container">
          <h2 className="text-center mb-4">{t.cvBuilder}</h2>
          
          <div className="row">
            <div className="col-md-6">
              <div className="cv-form">
                <h4>{t.personalInfo}</h4>
                
                <div className="mb-3">
                  <label className="form-label">{t.fullName}</label>
                  <input 
                    type="text" 
                    className="form-control"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                  />
                </div>
                
                <div className="mb-3">
                  <label className="form-label">{t.email}</label>
                  <input 
                    type="email" 
                    className="form-control"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </div>
                
                <div className="mb-3">
                  <label className="form-label">{t.phone}</label>
                  <input 
                    type="tel" 
                    className="form-control"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                </div>
                
                <div className="mb-3">
                  <label className="form-label">{t.address}</label>
                  <input 
                    type="text" 
                    className="form-control"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                  />
                </div>
                
                <div className="mb-3">
                  <label className="form-label">{t.objective}</label>
                  <textarea 
                    className="form-control" 
                    rows="3"
                    value={formData.objective}
                    onChange={(e) => handleInputChange('objective', e.target.value)}
                  ></textarea>
                </div>
                
                <div className="mb-3">
                  <label className="form-label">{t.education}</label>
                  <textarea 
                    className="form-control" 
                    rows="3"
                    value={formData.education}
                    onChange={(e) => handleInputChange('education', e.target.value)}
                  ></textarea>
                </div>
                
                <div className="mb-3">
                  <label className="form-label">{t.experience}</label>
                  <textarea 
                    className="form-control" 
                    rows="4"
                    value={formData.experience}
                    onChange={(e) => handleInputChange('experience', e.target.value)}
                  ></textarea>
                </div>
                
                <div className="mb-3">
                  <label className="form-label">{t.skills}</label>
                  <textarea 
                    className="form-control" 
                    rows="3"
                    value={formData.skills}
                    onChange={(e) => handleInputChange('skills', e.target.value)}
                  ></textarea>
                </div>
              </div>
            </div>
            
            <div className="col-md-6">
              <div className="cv-preview">
                <h4>{t.preview}</h4>
                <div className="cv-template">
                  <div className="cv-header">
                    <h3>{formData.fullName || 'Your Name'}</h3>
                    <div className="contact-info">
                      <p><i className="fa-solid fa-envelope"></i> {formData.email || 'your.email@example.com'}</p>
                      <p><i className="fa-solid fa-phone"></i> {formData.phone || '+84 xxx xxx xxx'}</p>
                      <p><i className="fa-solid fa-location-dot"></i> {formData.address || 'Your Address'}</p>
                    </div>
                  </div>
                  
                  {formData.objective && (
                    <div className="cv-section">
                      <h5>Career Objective</h5>
                      <p>{formData.objective}</p>
                    </div>
                  )}
                  
                  {formData.education && (
                    <div className="cv-section">
                      <h5>Education</h5>
                      <p>{formData.education}</p>
                    </div>
                  )}
                  
                  {formData.experience && (
                    <div className="cv-section">
                      <h5>Experience</h5>
                      <p>{formData.experience}</p>
                    </div>
                  )}
                  
                  {formData.skills && (
                    <div className="cv-section">
                      <h5>Skills</h5>
                      <p>{formData.skills}</p>
                    </div>
                  )}
                </div>
                
                <div className="cv-actions mt-3">
                  <button className="btn btn-success btn-lg w-100">
                    <i className="fa-solid fa-download me-2"></i>{t.download}
                  </button>
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

export default CVBuilder;