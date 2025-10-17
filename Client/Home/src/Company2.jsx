import React, { useState } from "react";
import "./stylee.scss";

const Company2 = ({ onPageChange }) => {
  const [language, setLanguage] = useState("vi");
  const [currentPage, setCurrentPage] = useState(2);
  const totalPages = 3;

  const translations = {
    vi: {
      company: "Công ty",
      jobs: "Việc làm",
      community: "Cộng đồng",
      contact: "Liên hệ",
      signIn: "Đăng nhập",
      signUp: "Đăng ký",
      findCompany: "Tìm công ty mơ ước của bạn",
      searchPlaceholder: "Tìm kiếm công ty, ngành nghề hoặc từ khóa...",
      seeMore: "Xem thêm",
      previous: "Trước",
      next: "Tiếp"
    },
    en: {
      company: "Company",
      jobs: "Jobs",
      community: "Community",
      contact: "Contact",
      signIn: "Log In",
      signUp: "Sign Up",
      findCompany: "Find Your Dream Company",
      searchPlaceholder: "Search companies, industries, or keywords...",
      seeMore: "See more",
      previous: "Previous",
      next: "Next"
    }
  };

  const t = translations[language];

  const handleLogin = () => {
    window.location.href = "http://localhost:3002?mode=login";
  };

  const handleSignup = () => {
    window.location.href = "http://localhost:3002?mode=signup";
  };

  const companyData = [
    {
      logo: "IBM.png",
      name: language === "vi" ? "Tập đoàn IBM" : "IBM Corporation",
      industry: language === "vi" ? "Công nghệ" : "Technology",
    },
    {
      logo: "AWS.png",
      name: language === "vi" ? "Dịch vụ Web Amazon" : "Amazon Web Services",
      industry: language === "vi" ? "Đám mây" : "Cloud",
    },
    {
      logo: "Shopee.png",
      name: language === "vi" ? "Shopee Việt Nam" : "Shopee Vietnam",
      industry: language === "vi" ? "Thương mại điện tử" : "E-commerce",
    },
    {
      logo: "Oracle.png",
      name: language === "vi" ? "Oracle Việt Nam" : "Oracle Vietnam",
      industry: language === "vi" ? "Cơ sở dữ liệu" : "Database",
    },
    {
      logo: "Grab.png",
      name: language === "vi" ? "Grab Việt Nam" : "Grab Vietnam",
      industry: language === "vi" ? "Giao thông" : "Transportation",
    },
    {
      logo: "Netflix.png",
      name: language === "vi" ? "Công nghệ Netflix" : "Netflix Technology",
      industry: language === "vi" ? "Giải trí" : "Entertainment",
    },
    {
      logo: "Adobe.png",
      name: language === "vi" ? "Hệ thống Adobe" : "Adobe Systems",
      industry: language === "vi" ? "Phần mềm" : "Software",
    },
    {
      logo: "TikTok.png",
      name: language === "vi" ? "Công nghệ TikTok" : "TikTok Technology",
      industry: language === "vi" ? "Mạng xã hội" : "Social Media",
    },
    {
      logo: "Visa.png",
      name: "Visa Inc.",
      industry: language === "vi" ? "Thanh toán" : "Payment",
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
              <a className="nav-link active" href="#">
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

      <div className="container my-4 text-center">
        <div className="banner-container">
          <img src="LookJobs.png" className="shadow-sm" alt="banner" />
        </div>
      </div>

      <div className="container">
        <div className="main-search text-center">
          <h4 className="mb-4">{t.findCompany}</h4>
          <div className="row">
            <div className="col-12">
              <input
                type="text"
                className="form-control"
                placeholder={t.searchPlaceholder}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mt-4">
        {[0, 3, 6].map((startIndex) => (
          <div className="row" key={startIndex}>
            {companyData
              .slice(startIndex, startIndex + 3)
              .map((company, index) => (
                <div className="col-md-4" key={index}>
                  <div className="job-card d-flex align-items-center">
                    <img
                      src={company.logo}
                      alt="logo"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/50x50?text=Logo";
                      }}
                    />
                    <div className="job-info">
                      <h6>{company.name}</h6>
                      <p>{company.industry}</p>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => {
                          if (company.name.includes("Samsung")) {
                            onPageChange("companyDetail");
                          }
                        }}
                      >
                        {t.seeMore}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ))}

        <nav aria-label="Page navigation" className="mt-4">
          <ul className="pagination justify-content-center">
            <li className="page-item">
              <button
                className="page-link"
                onClick={() => onPageChange('company')}
              >
                {t.previous}
              </button>
            </li>
            <li className="page-item">
              <button className="page-link" onClick={() => onPageChange('company')}>
                1
              </button>
            </li>
            <li className="page-item active">
              <span className="page-link">2</span>
            </li>
            <li className="page-item">
              <button className="page-link" onClick={() => onPageChange('company3')}>
                3
              </button>
            </li>
            <li className="page-item">
              <button
                className="page-link"
                onClick={() => onPageChange('company3')}
              >
                {t.next}
              </button>
            </li>
          </ul>
        </nav>
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

export default Company2;