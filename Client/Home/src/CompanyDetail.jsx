import React, { useState } from "react";
import "./stylee.scss";

const CompanyDetail = ({ onPageChange }) => {
  const [language, setLanguage] = useState("vi");

  const translations = {
    vi: {
      company: "Công ty",
      jobs: "Việc làm",
      community: "Cộng đồng",
      contact: "Liên hệ",
      signIn: "Đăng nhập",
      signUp: "Đăng ký",
      back: "Quay lại",
      companyInfo: "Thông tin công ty",
      address: "Địa chỉ",
      size: "Quy mô",
      website: "Website",
      jobOpenings: "Vị trí đang tuyển",
      salary: "Mức lương",
      viewDetails: "Xem chi tiết",
      apply: "Ứng tuyển"
    },
    en: {
      company: "Company",
      jobs: "Jobs",
      community: "Community",
      contact: "Contact",
      signIn: "Log In",
      signUp: "Sign Up",
      back: "Back",
      companyInfo: "Company Information",
      address: "Address",
      size: "Size",
      website: "Website",
      jobOpenings: "Job Openings",
      salary: "Salary",
      viewDetails: "View Details",
      apply: "Apply"
    }
  };

  const t = translations[language];

  const handleLogin = () => {
    window.location.href = "http://localhost:3002?mode=login";
  };

  const handleSignup = () => {
    window.location.href = "http://localhost:3002?mode=signup";
  };

  const jobOpenings = [
    {
      title: "Software Engineer",
      salary: "15-25 triệu VNĐ",
      description: "Phát triển ứng dụng mobile và web",
      requirements: "React, Node.js, 2+ năm kinh nghiệm"
    },
    {
      title: "Product Manager",
      salary: "20-35 triệu VNĐ",
      description: "Quản lý sản phẩm và chiến lược",
      requirements: "MBA, 3+ năm kinh nghiệm PM"
    },
    {
      title: "UI/UX Designer",
      salary: "12-20 triệu VNĐ",
      description: "Thiết kế giao diện người dùng",
      requirements: "Figma, Adobe XD, portfolio mạnh"
    },
    {
      title: "Data Analyst",
      salary: "18-28 triệu VNĐ",
      description: "Phân tích dữ liệu và báo cáo",
      requirements: "SQL, Python, Excel nâng cao"
    }
  ];

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
        <button className="btn btn-secondary mb-3" onClick={() => onPageChange('company')}>
          <i className="fa-solid fa-arrow-left me-2"></i>{t.back}
        </button>
        
        <div className="company-detail-card">
          <div className="company-header">
            <div className="d-flex align-items-center mb-4">
              <img src="Samsung.png" alt="Samsung" className="company-logo" />
              <div className="company-basic-info">
                <h1>Samsung Vietnam</h1>
                <p className="company-industry">Technology - Electronics</p>
                <div className="company-rating">
                  <span className="rating-stars">
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-regular fa-star"></i>
                  </span>
                  <span className="rating-text">4.2/5 (1,234 reviews)</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="row">
            <div className="col-md-8">
              <div className="company-description">
                <h4>About Samsung Vietnam</h4>
                <p>
                  Samsung Vietnam is a leading technology company specializing in consumer electronics, 
                  semiconductors, and digital media technologies. We are committed to creating innovative 
                  products that enhance people's lives and contribute to a better world.
                </p>
                <p>
                  With over 10,000 employees across Vietnam, we offer exciting career opportunities 
                  in various fields including engineering, design, marketing, and business development.
                </p>
              </div>
              
              <div className="job-openings">
                <h4>{t.jobOpenings}</h4>
                <div className="job-list">
                  {jobOpenings.map((job, index) => (
                    <div key={index} className="job-item">
                      <div className="job-header">
                        <h5>{job.title}</h5>
                        <span className="job-salary">{job.salary}</span>
                      </div>
                      <p className="job-description">{job.description}</p>
                      <p className="job-requirements"><strong>Requirements:</strong> {job.requirements}</p>
                      <div className="job-actions">
                        <button 
                          className="btn btn-outline-primary btn-sm me-2"
                          onClick={() => onPageChange('job')}
                        >
                          {t.viewDetails}
                        </button>
                        <button className="btn btn-primary btn-sm">
                          {t.apply}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="company-sidebar">
                <div className="company-info">
                  <h4>{t.companyInfo}</h4>
                  <div className="info-item">
                    <i className="fa-solid fa-location-dot"></i>
                    <div>
                      <strong>{t.address}:</strong>
                      <p>Samsung Tower, 28 Nguyen Hue Blvd, District 1, Ho Chi Minh City</p>
                    </div>
                  </div>
                  <div className="info-item">
                    <i className="fa-solid fa-users"></i>
                    <div>
                      <strong>{t.size}:</strong>
                      <p>10,000+ employees</p>
                    </div>
                  </div>
                  <div className="info-item">
                    <i className="fa-solid fa-globe"></i>
                    <div>
                      <strong>{t.website}:</strong>
                      <p><a href="https://www.samsung.com" target="_blank" rel="noopener noreferrer">www.samsung.com</a></p>
                    </div>
                  </div>
                  <div className="info-item">
                    <i className="fa-solid fa-calendar"></i>
                    <div>
                      <strong>Founded:</strong>
                      <p>1969</p>
                    </div>
                  </div>
                </div>
                
                <div className="company-benefits">
                  <h5>Benefits & Perks</h5>
                  <ul>
                    <li><i className="fa-solid fa-check"></i> Competitive salary</li>
                    <li><i className="fa-solid fa-check"></i> Health insurance</li>
                    <li><i className="fa-solid fa-check"></i> Annual bonus</li>
                    <li><i className="fa-solid fa-check"></i> Training programs</li>
                    <li><i className="fa-solid fa-check"></i> Flexible working hours</li>
                    <li><i className="fa-solid fa-check"></i> Career development</li>
                  </ul>
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
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a> · 
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a> ·
            <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer">YouTube</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CompanyDetail;