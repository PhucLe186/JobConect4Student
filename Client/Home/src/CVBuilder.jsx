import React, { useState } from 'react';
import './stylee.scss';

const CVBuilder = ({ onPageChange }) => {
  const [language, setLanguage] = useState('vi');
  const [cvData, setCvData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    objective: '',
    education: '',
    experience: '',
    skills: '',
    languages: '',
    hobbies: ''
  });

  const translations = {
    vi: {
      company: 'Công ty',
      jobs: 'Việc làm',
      community: 'Cộng đồng',
      contact: 'Liên hệ',
      signIn: 'Đăng nhập',
      signUp: 'Đăng ký',
      cvBuilder: 'Tạo CV',
      createCV: 'Tạo CV của bạn',
      personalInfo: 'Thông tin cá nhân',
      fullName: 'Họ và tên',
      email: 'Email',
      phone: 'Số điện thoại',
      address: 'Địa chỉ',
      dateOfBirth: 'Ngày sinh',
      objective: 'Mục tiêu nghề nghiệp',
      education: 'Học vấn',
      experience: 'Kinh nghiệm làm việc',
      skills: 'Kỹ năng',
      languages: 'Ngôn ngữ',
      hobbies: 'Sở thích',
      generateCV: 'Tạo CV',
      preview: 'Xem trước CV',
      back: 'Quay lại'
    },
    en: {
      company: 'Company',
      jobs: 'Jobs',
      community: 'Community',
      contact: 'Contact',
      signIn: 'Log In',
      signUp: 'Sign Up',
      cvBuilder: 'CV Builder',
      createCV: 'Create Your CV',
      personalInfo: 'Personal Information',
      fullName: 'Full Name',
      email: 'Email',
      phone: 'Phone Number',
      address: 'Address',
      dateOfBirth: 'Date of Birth',
      objective: 'Career Objective',
      education: 'Education',
      experience: 'Work Experience',
      skills: 'Skills',
      languages: 'Languages',
      hobbies: 'Hobbies',
      generateCV: 'Generate CV',
      preview: 'CV Preview',
      back: 'Back'
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
    setCvData({
      ...cvData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(language === 'vi' ? 'CV đã được tạo thành công!' : 'CV has been created successfully!');
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-white shadow-sm">
        <div className="container">
          <button 
            className="btn btn-secondary btn-sm me-3"
            onClick={() => onPageChange('job')}
          >
            ←
          </button>
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
        <div className="text-center mb-4">
          <h2 style={{color: '#007bff'}}>{t.createCV}</h2>
        </div>

        <div className="row">
          <div className="col-md-8">
            <div style={{background: '#fff', borderRadius: '8px', padding: '30px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'}}>
              <form onSubmit={handleSubmit}>
                <h4 style={{color: '#007bff', marginBottom: '20px'}}>{t.personalInfo}</h4>
                
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">{t.fullName}</label>
                    <input
                      type="text"
                      className="form-control"
                      name="fullName"
                      value={cvData.fullName}
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
                      value={cvData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">{t.phone}</label>
                    <input
                      type="tel"
                      className="form-control"
                      name="phone"
                      value={cvData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">{t.dateOfBirth}</label>
                    <input
                      type="date"
                      className="form-control"
                      name="dateOfBirth"
                      value={cvData.dateOfBirth}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">{t.address}</label>
                  <input
                    type="text"
                    className="form-control"
                    name="address"
                    value={cvData.address}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">{t.objective}</label>
                  <textarea
                    className="form-control"
                    name="objective"
                    rows="3"
                    value={cvData.objective}
                    onChange={handleInputChange}
                    placeholder={language === 'vi' ? 'Mô tả mục tiêu nghề nghiệp của bạn...' : 'Describe your career objective...'}
                  ></textarea>
                </div>

                <div className="mb-3">
                  <label className="form-label">{t.education}</label>
                  <textarea
                    className="form-control"
                    name="education"
                    rows="3"
                    value={cvData.education}
                    onChange={handleInputChange}
                    placeholder={language === 'vi' ? 'Trường học, bằng cấp, năm tốt nghiệp...' : 'School, degree, graduation year...'}
                  ></textarea>
                </div>

                <div className="mb-3">
                  <label className="form-label">{t.experience}</label>
                  <textarea
                    className="form-control"
                    name="experience"
                    rows="4"
                    value={cvData.experience}
                    onChange={handleInputChange}
                    placeholder={language === 'vi' ? 'Kinh nghiệm làm việc, dự án đã tham gia...' : 'Work experience, projects participated...'}
                  ></textarea>
                </div>

                <div className="mb-3">
                  <label className="form-label">{t.skills}</label>
                  <textarea
                    className="form-control"
                    name="skills"
                    rows="3"
                    value={cvData.skills}
                    onChange={handleInputChange}
                    placeholder={language === 'vi' ? 'Kỹ năng chuyên môn, kỹ năng mềm...' : 'Technical skills, soft skills...'}
                  ></textarea>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">{t.languages}</label>
                    <input
                      type="text"
                      className="form-control"
                      name="languages"
                      value={cvData.languages}
                      onChange={handleInputChange}
                      placeholder={language === 'vi' ? 'Tiếng Việt, Tiếng Anh...' : 'Vietnamese, English...'}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">{t.hobbies}</label>
                    <input
                      type="text"
                      className="form-control"
                      name="hobbies"
                      value={cvData.hobbies}
                      onChange={handleInputChange}
                      placeholder={language === 'vi' ? 'Đọc sách, thể thao...' : 'Reading, sports...'}
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary btn-lg">
                  {t.generateCV}
                </button>
              </form>
            </div>
          </div>

          <div className="col-md-4">
            <div style={{background: '#fff', borderRadius: '8px', padding: '25px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)', position: 'sticky', top: '20px'}}>
              <h4 style={{color: '#007bff', marginBottom: '20px'}}>{t.preview}</h4>
              
              <div style={{border: '1px solid #ddd', padding: '20px', borderRadius: '8px', minHeight: '400px', backgroundColor: '#f9f9f9'}}>
                <div style={{textAlign: 'center', marginBottom: '20px'}}>
                  <h5 style={{color: '#333', marginBottom: '5px'}}>{cvData.fullName || (language === 'vi' ? 'Họ và tên' : 'Full Name')}</h5>
                  <p style={{color: '#666', fontSize: '14px', margin: '0'}}>{cvData.email}</p>
                  <p style={{color: '#666', fontSize: '14px', margin: '0'}}>{cvData.phone}</p>
                </div>

                {cvData.objective && (
                  <div style={{marginBottom: '15px'}}>
                    <h6 style={{color: '#007bff', borderBottom: '1px solid #ddd', paddingBottom: '5px'}}>{t.objective}</h6>
                    <p style={{fontSize: '14px', color: '#333'}}>{cvData.objective}</p>
                  </div>
                )}

                {cvData.education && (
                  <div style={{marginBottom: '15px'}}>
                    <h6 style={{color: '#007bff', borderBottom: '1px solid #ddd', paddingBottom: '5px'}}>{t.education}</h6>
                    <p style={{fontSize: '14px', color: '#333'}}>{cvData.education}</p>
                  </div>
                )}

                {cvData.skills && (
                  <div style={{marginBottom: '15px'}}>
                    <h6 style={{color: '#007bff', borderBottom: '1px solid #ddd', paddingBottom: '5px'}}>{t.skills}</h6>
                    <p style={{fontSize: '14px', color: '#333'}}>{cvData.skills}</p>
                  </div>
                )}
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

export default CVBuilder;