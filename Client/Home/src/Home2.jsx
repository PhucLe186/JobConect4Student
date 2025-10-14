import React, { useState } from "react";
import "./stylee.scss";

const Home2 = (props) => {
  const [salaryValue, setSalaryValue] = useState(50);
  const [experience, setExperience] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [language, setLanguage] = useState("vi");
  const currentPage = 2;
  const totalPages = 3;

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
      salaryRange: "Mức lương",
      experienceLevel: "Kinh nghiệm",
      workLocation: "Địa điểm làm việc",
      jobType: "Loại hình",
      chooseExp: "Chọn kinh nghiệm",
      chooseLocation: "Chọn địa điểm",
      chooseJobType: "Chọn loại hình",
      noExp: "Không cần kinh nghiệm",
      seeMore: "Xem thêm",
      previous: "Trước",
      next: "Tiếp",
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
      salaryRange: "Salary Range",
      experienceLevel: "Experience Level",
      workLocation: "Work Location",
      jobType: "Job Type",
      chooseExp: "Choose experience",
      chooseLocation: "Choose location",
      chooseJobType: "Choose job type",
      noExp: "No experience required",
      seeMore: "See more",
      previous: "Previous",
      next: "Next",
    },
  };

  const jobData = [
    { 
      logo: "IBM.png", 
      title: language === 'vi' ? "Chuyên viên Khoa học Dữ liệu" : "Data Scientist", 
      company: language === 'vi' ? "Tập đoàn IBM" : "IBM Corporation" 
    },
    { 
      logo: "AWS.png", 
      title: language === 'vi' ? "Kỹ sư Đám mây" : "Cloud Engineer", 
      company: language === 'vi' ? "Dịch vụ Web Amazon" : "Amazon Web Services" 
    },
    { 
      logo: "Shopee.png", 
      title: language === 'vi' ? "Lập trình viên Backend" : "Backend Developer", 
      company: language === 'vi' ? "Shopee Việt Nam" : "Shopee Vietnam" 
    },
    { 
      logo: "Oracle.png", 
      title: language === 'vi' ? "Quản trị Cơ sở Dữ liệu" : "Database Administrator", 
      company: language === 'vi' ? "Oracle Việt Nam" : "Oracle Vietnam" 
    },
    { 
      logo: "Grab.png", 
      title: language === 'vi' ? "Lập trình viên Di động" : "Mobile Developer", 
      company: language === 'vi' ? "Grab Việt Nam" : "Grab Vietnam" 
    },
    { 
      logo: "Netflix.png", 
      title: language === 'vi' ? "Lập trình viên Frontend" : "Frontend Developer", 
      company: language === 'vi' ? "Công nghệ Netflix" : "Netflix Technology" 
    },
    { 
      logo: "Adobe.png", 
      title: language === 'vi' ? "Thiết kế UX/UI" : "UX/UI Designer", 
      company: language === 'vi' ? "Hệ thống Adobe" : "Adobe Systems" 
    },
    { 
      logo: "TikTok.png", 
      title: language === 'vi' ? "Kỹ sư AI" : "AI Engineer", 
      company: language === 'vi' ? "Công nghệ TikTok" : "TikTok Technology" 
    },
    { 
      logo: "Visa.png", 
      title: language === 'vi' ? "Chuyên viên Bảo mật" : "Security Analyst", 
      company: language === 'vi' ? "Visa Inc." : "Visa Inc." 
    },
  ];

  const t = translations[language];

  const handleSeeMore = (e, jobData) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Bấm nút Xem thêm:', jobData);
    props.onPageChange('job');
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
          <span className="navbar-brand fw-bold" style={{fontSize: '24px'}}>
            <span style={{color: '#007bff'}}>JobConnect</span><span style={{color: '#28a745'}}>4Students</span>
          </span>
          <ul className="navbar-nav ms-auto">
            <li className="nav-item"><span className="nav-link" style={{cursor: 'pointer'}} onClick={() => props.onPageChange('company')}>{t.company}</span></li>
            <li className="nav-item"><span className="nav-link">{t.jobs}</span></li>
            <li className="nav-item"><span className="nav-link" style={{cursor: 'pointer'}} onClick={() => props.onPageChange('community')}>{t.community}</span></li>
            <li className="nav-item"><span className="nav-link" style={{cursor: 'pointer'}} onClick={() => props.onPageChange('contact')}>{t.contact}</span></li>
            <li className="nav-item"><button className="btn btn-primary me-2" onClick={handleLogin}>{t.signIn}</button></li>
            <li className="nav-item"><button className="btn btn-primary" onClick={handleSignup}>{t.signUp}</button></li>
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



      <div className="container">
        <div className="main-search text-center">
          <h4 className="mb-4">{t.findJob}</h4>
          <div className="row">
            <div className="col-12">
              <input type="text" className="form-control" placeholder={t.searchPlaceholder} />
            </div>
          </div>
        </div>
      </div>

      <div className="container search-bar">
        <div className="row">
          <div className="col-md-3">
            <div className="salary-range">
              <label className="form-label">{t.salaryRange}</label>
              <input
                type="range"
                className="salary-slider"
                min="0"
                max="100"
                value={salaryValue}
                onChange={(e) => setSalaryValue(e.target.value)}
              />
              <div className="salary-display">
                0 - {salaryValue} {language === "vi" ? "triệu VNĐ" : "million VND"}
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <label className="form-label">{t.experienceLevel}</label>
            <select className="form-select" value={experience} onChange={(e) => setExperience(e.target.value)}>
              <option value="">{t.chooseExp}</option>
              <option>{t.noExp}</option>
              <option>1 - 2 {language === "vi" ? "năm" : "years"}</option>
              <option>3 - 4 {language === "vi" ? "năm" : "years"}</option>
              <option>4 - 5 {language === "vi" ? "năm" : "years"}</option>
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label">{t.workLocation}</label>
            <select className="form-select" value={location} onChange={(e) => setLocation(e.target.value)}>
              <option value="">{t.chooseLocation}</option>
              <option>{language === "vi" ? "Hà Nội" : "Hanoi"}</option>
              <option>{language === "vi" ? "Hồ Chí Minh" : "Ho Chi Minh City"}</option>
              <option>{language === "vi" ? "Đà Nẵng" : "Da Nang"}</option>
              <option>{language === "vi" ? "Cần Thơ" : "Can Tho"}</option>
              <option>{language === "vi" ? "Hải Phòng" : "Hai Phong"}</option>
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label">{t.jobType}</label>
            <select className="form-select" value={jobType} onChange={(e) => setJobType(e.target.value)}>
              <option value="">{t.chooseJobType}</option>
              <option>Full-time</option>
              <option>Part-time</option>
              <option>{language === "vi" ? "Thực tập" : "Internship"}</option>
            </select>
          </div>
        </div>
      </div>

      <div className="container mt-4">
        {[0, 3, 6].map((startIndex) => (
          <div className="row" key={startIndex}>
            {jobData.slice(startIndex, startIndex + 3).map((job, index) => (
              <div className="col-md-4" key={index}>
                <div className="job-card d-flex align-items-center">
                  <img src={job.logo} alt="logo" onError={(e) => {e.target.src = 'https://via.placeholder.com/50x50?text=Logo'}} />
                  <div className="job-info">
                    <h6>{job.title}</h6>
                    <p>{job.company}</p>
                    <button 
                      type="button"
                      className="btn btn-sm btn-outline-primary"
                      onClick={(e) => handleSeeMore(e, job)}
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
              <button className="page-link" onClick={() => props.onPageChange(currentPage - 1)} disabled={currentPage === 1}>
                {t.previous}
              </button>
            </li>
            <li className="page-item">
              <button className="page-link" onClick={() => props.onPageChange(1)}>
                1
              </button>
            </li>
            <li className="page-item active">
              <span className="page-link">2</span>
            </li>
            <li className="page-item">
              <button className="page-link" onClick={() => props.onPageChange(3)}>
                3
              </button>
            </li>
            <li className="page-item">
              <button className="page-link" onClick={() => props.onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
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
            <span>Facebook</span> · <span>Instagram</span> · <span>YouTube</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home2;