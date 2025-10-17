import React, { useState } from "react";
import "./stylee.scss";

const Home2 = ({ onPageChange }) => {
  const [language, setLanguage] = useState("vi");
  const [salaryValue, setSalaryValue] = useState(50);
  const [experience, setExperience] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");

  const translations = {
    vi: {
      company: "Công ty",
      jobs: "Việc làm",
      community: "Cộng đồng",
      contact: "Liên hệ",
      signIn: "Đăng nhập",
      signUp: "Đăng ký",
      findJob: "Tìm công việc mơ ước của bạn",
      searchPlaceholder: "Tìm kiếm công việc, công ty hoặc từ khóa...",
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
      findJob: "Find Your Dream Job",
      searchPlaceholder: "Search jobs, companies, or keywords...",
      seeMore: "See more",
      previous: "Previous",
      next: "Next"
    }
  };

  const t = translations[language];

  const jobData = [
    { logo: "IBM.png", title: "Backend Developer", company: "Tập đoàn IBM", companyKey: "ibm" },
    { logo: "AWS.png", title: "Cloud Engineer", company: "Amazon Web Services", companyKey: "aws" },
    { logo: "Shopee.png", title: "Frontend Developer", company: "Shopee Việt Nam", companyKey: "shopee" },
    { logo: "Oracle.png", title: "Database Admin", company: "Oracle Việt Nam", companyKey: "oracle" },
    { logo: "Grab.png", title: "Mobile Developer", company: "Grab Việt Nam", companyKey: "grab" },
    { logo: "Netflix.png", title: "DevOps Engineer", company: "Netflix Technology", companyKey: "netflix" },
    { logo: "Adobe.png", title: "UI/UX Designer", company: "Adobe Systems", companyKey: "adobe" },
    { logo: "TikTok.png", title: "Data Scientist", company: "TikTok Technology", companyKey: "tiktok" },
    { logo: "Visa.png", title: "Security Engineer", company: "Visa Inc.", companyKey: "visa" }
  ];

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
              <a className="nav-link active" href="#">
                {t.jobs}
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#" onClick={() => onPageChange('community')}>
                {t.community}
              </a>
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
          <h4 className="mb-4">{t.findJob}</h4>
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
            {jobData.slice(startIndex, startIndex + 3).map((job, index) => (
              <div className="col-md-4" key={index}>
                <div className="job-card d-flex align-items-center">
                  <img src={job.logo} alt="logo" />
                  <div className="job-info">
                    <h6>{job.title}</h6>
                    <p>{job.company}</p>
                    <button 
                      type="button"
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => onPageChange('job')}
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
              <button className="page-link" onClick={() => onPageChange(1)}>
                {t.previous}
              </button>
            </li>
            <li className="page-item">
              <button className="page-link" onClick={() => onPageChange(1)}>
                1
              </button>
            </li>
            <li className="page-item active">
              <span className="page-link">2</span>
            </li>
            <li className="page-item">
              <button className="page-link" onClick={() => onPageChange(3)}>
                3
              </button>
            </li>
            <li className="page-item">
              <button className="page-link" onClick={() => onPageChange(3)}>
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
            <a href="#">Facebook</a> · <a href="#">Instagram</a> ·
            <a href="#">YouTube</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home2;