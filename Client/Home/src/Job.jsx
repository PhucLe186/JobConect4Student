import React, { useState } from "react";
import "./JobStyle.scss";

const Job = ({ onPageChange }) => {
  const [language, setLanguage] = useState("vi");
  const [isApplied, setIsApplied] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationData, setApplicationData] = useState({
    fullName: '',
    email: '',
    phone: '',
    coverLetter: '',
    resume: null
  });

  const translations = {
    vi: {
      company: "Công ty",
      jobs: "Việc làm",
      community: "Cộng đồng",
      contact: "Liên hệ",
      signIn: "Đăng nhập",
      signUp: "Đăng ký",
      jobDetails: "Chi tiết công việc",
      apply: "Ứng tuyển",
      applied: "Đã ứng tuyển",
      back: "Quay lại",
      salary: "Mức lương",
      experience: "Kinh nghiệm",
      location: "Địa điểm",
      jobType: "Loại hình",
      description: "Mô tả công việc",
      requirements: "Yêu cầu",
      benefits: "Quyền lợi",
      applicationForm: "Form ứng tuyển",
      fullName: "Họ và tên",
      email: "Email",
      phone: "Số điện thoại",
      coverLetter: "Thư xin việc",
      resume: "CV/Resume",
      submit: "Gửi đơn",
      cancel: "Hủy",
      companyOverview: "Tổng quan công ty",
      similarJobs: "Việc làm tương tự",
      viewMore: "Xem thêm"
    },
    en: {
      company: "Company",
      jobs: "Jobs",
      community: "Community",
      contact: "Contact",
      signIn: "Log In",
      signUp: "Sign Up",
      jobDetails: "Job Details",
      apply: "Apply",
      applied: "Applied",
      back: "Back",
      salary: "Salary",
      experience: "Experience",
      location: "Location",
      jobType: "Job Type",
      description: "Job Description",
      requirements: "Requirements",
      benefits: "Benefits",
      applicationForm: "Application Form",
      fullName: "Full Name",
      email: "Email",
      phone: "Phone Number",
      coverLetter: "Cover Letter",
      resume: "CV/Resume",
      submit: "Submit Application",
      cancel: "Cancel",
      companyOverview: "Company Overview",
      similarJobs: "Similar Jobs",
      viewMore: "View More"
    }
  };

  const t = translations[language];

  const handleLogin = () => {
    window.location.href = 'http://localhost:3002?mode=login';
  };

  const handleSignup = () => {
    window.location.href = 'http://localhost:3002?mode=signup';
  };

  const handleApply = () => {
    setShowApplicationForm(true);
  };

  const handleSubmitApplication = (e) => {
    e.preventDefault();
    setIsApplied(true);
    setShowApplicationForm(false);
    alert(language === 'vi' ? 'Đơn ứng tuyển đã được gửi thành công!' : 'Application submitted successfully!');
  };

  const handleInputChange = (field, value) => {
    setApplicationData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const jobData = {
    title: "Senior Software Engineer",
    company: "Samsung Vietnam",
    companyLogo: "Samsung.png",
    location: "Hồ Chí Minh",
    salary: "25-40 triệu VNĐ",
    experience: "3-5 năm",
    jobType: "Full-time",
    postedDate: "2 ngày trước",
    deadline: "30/12/2024",
    description: [
      "Phát triển và duy trì các ứng dụng web và mobile sử dụng React, Node.js",
      "Thiết kế và triển khai các API RESTful và microservices",
      "Làm việc với cơ sở dữ liệu MongoDB, PostgreSQL",
      "Tham gia vào quá trình code review và testing",
      "Hợp tác với team UI/UX để triển khai các tính năng mới"
    ],
    requirements: [
      "Tốt nghiệp Đại học chuyên ngành CNTT hoặc tương đương",
      "3+ năm kinh nghiệm làm việc với JavaScript, React, Node.js",
      "Kinh nghiệm với các cơ sở dữ liệu SQL và NoSQL",
      "Hiểu biết về Git, Docker, CI/CD",
      "Khả năng giao tiếp tiếng Anh tốt",
      "Tư duy logic, khả năng giải quyết vấn đề"
    ],
    benefits: [
      "Mức lương cạnh tranh, thưởng theo hiệu suất",
      "Bảo hiểm sức khỏe toàn diện cho nhân viên và gia đình",
      "Chế độ nghỉ phép 15 ngày/năm + các ngày lễ tết",
      "Cơ hội đào tạo và phát triển nghề nghiệp",
      "Môi trường làm việc hiện đại, thân thiện",
      "Hỗ trợ ăn trưa, giữ xe, team building"
    ]
  };

  const similarJobs = [
    { title: "Frontend Developer", company: "Google Vietnam", salary: "20-30 triệu" },
    { title: "Backend Developer", company: "Microsoft Vietnam", salary: "22-35 triệu" },
    { title: "Full Stack Developer", company: "Shopee Vietnam", salary: "18-28 triệu" }
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
              <a className="nav-link" href="#" onClick={() => onPageChange('contact')}>
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
        <button className="btn btn-secondary mb-3" onClick={() => onPageChange(1)}>
          <i className="fa-solid fa-arrow-left me-2"></i>{t.back}
        </button>
        
        <div className="row">
          <div className="col-md-8">
            <div className="job-detail-card">
              <div className="job-header">
                <div className="d-flex align-items-center mb-3">
                  <img src={jobData.companyLogo} alt={jobData.company} className="company-logo me-3" />
                  <div>
                    <h2 className="job-title">{jobData.title}</h2>
                    <h5 className="company-name">{jobData.company}</h5>
                  </div>
                </div>
                
                <div className="job-meta">
                  <div className="meta-item">
                    <i className="fa-solid fa-location-dot"></i>
                    <span>{jobData.location}</span>
                  </div>
                  <div className="meta-item">
                    <i className="fa-solid fa-money-bill"></i>
                    <span>{jobData.salary}</span>
                  </div>
                  <div className="meta-item">
                    <i className="fa-solid fa-briefcase"></i>
                    <span>{jobData.experience}</span>
                  </div>
                  <div className="meta-item">
                    <i className="fa-solid fa-clock"></i>
                    <span>{jobData.jobType}</span>
                  </div>
                </div>
                
                <div className="job-actions">
                  {!isApplied ? (
                    <button className="btn btn-primary btn-lg me-3" onClick={handleApply}>
                      <i className="fa-solid fa-paper-plane me-2"></i>{t.apply}
                    </button>
                  ) : (
                    <button className="btn btn-success btn-lg me-3" disabled>
                      <i className="fa-solid fa-check me-2"></i>{t.applied}
                    </button>
                  )}
                  <button className="btn btn-outline-primary">
                    <i className="fa-solid fa-heart me-2"></i>Lưu việc
                  </button>
                </div>
              </div>
              
              <div className="job-content">
                <div className="job-section">
                  <h4><i className="fa-solid fa-file-text me-2"></i>{t.description}</h4>
                  <ul>
                    {jobData.description.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="job-section">
                  <h4><i className="fa-solid fa-list-check me-2"></i>{t.requirements}</h4>
                  <ul>
                    {jobData.requirements.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="job-section">
                  <h4><i className="fa-solid fa-gift me-2"></i>{t.benefits}</h4>
                  <ul>
                    {jobData.benefits.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="job-sidebar">
              <div className="company-info-card">
                <h5><i className="fa-solid fa-building me-2"></i>{t.companyOverview}</h5>
                <div className="company-details">
                  <p><strong>Quy mô:</strong> 10,000+ nhân viên</p>
                  <p><strong>Lĩnh vực:</strong> Công nghệ - Điện tử</p>
                  <p><strong>Website:</strong> <a href="#">www.samsung.com</a></p>
                  <button className="btn btn-outline-primary btn-sm w-100 mt-2" onClick={() => onPageChange('companyDetail')}>
                    Xem thêm về công ty
                  </button>
                </div>
              </div>
              
              <div className="similar-jobs-card">
                <h5><i className="fa-solid fa-briefcase me-2"></i>{t.similarJobs}</h5>
                {similarJobs.map((job, index) => (
                  <div key={index} className="similar-job-item">
                    <h6>{job.title}</h6>
                    <p>{job.company}</p>
                    <span className="salary">{job.salary}</span>
                  </div>
                ))}
                <button className="btn btn-link p-0 mt-2">{t.viewMore}</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showApplicationForm && (
        <div className="modal-overlay">
          <div className="application-modal">
            <div className="modal-header">
              <h4>{t.applicationForm}</h4>
              <button className="btn-close" onClick={() => setShowApplicationForm(false)}>
                <i className="fa-solid fa-times"></i>
              </button>
            </div>
            
            <form onSubmit={handleSubmitApplication}>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">{t.fullName}</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    required
                    value={applicationData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                  />
                </div>
                
                <div className="mb-3">
                  <label className="form-label">{t.email}</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    required
                    value={applicationData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </div>
                
                <div className="mb-3">
                  <label className="form-label">{t.phone}</label>
                  <input 
                    type="tel" 
                    className="form-control" 
                    required
                    value={applicationData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                </div>
                
                <div className="mb-3">
                  <label className="form-label">{t.resume}</label>
                  <input 
                    type="file" 
                    className="form-control" 
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => handleInputChange('resume', e.target.files[0])}
                  />
                </div>
                
                <div className="mb-3">
                  <label className="form-label">{t.coverLetter}</label>
                  <textarea 
                    className="form-control" 
                    rows="4"
                    value={applicationData.coverLetter}
                    onChange={(e) => handleInputChange('coverLetter', e.target.value)}
                  ></textarea>
                </div>
              </div>
              
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowApplicationForm(false)}>
                  {t.cancel}
                </button>
                <button type="submit" className="btn btn-primary">
                  {t.submit}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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

export default Job;