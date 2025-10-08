import React, { useState } from 'react';
import './JobStyle.scss';

const CompanyDetail = ({ onBack, companyData }) => {
  const [language, setLanguage] = useState('vi');

  const translations = {
    vi: {
      company: 'Công ty',
      jobs: 'Việc làm',
      community: 'Cộng đồng',
      contact: 'Liên hệ',
      signIn: 'Đăng nhập',
      signUp: 'Đăng ký',
      back: 'Quay lại',
      generalInfo: 'Thông tin chung',
      companyDescription: 'Giới thiệu công ty',
      benefits: 'Quyền lợi nhân viên',
      workEnvironment: 'Môi trường làm việc',
      contactInfo: 'Thông tin liên hệ',
      companySuggestions: 'Gợi ý công ty',
      alertMessage: 'Chức năng gợi ý công ty sẽ được phát triển trong tương lai!',
      companySize: 'Quy mô công ty',
      industry: 'Ngành nghề',
      founded: 'Thành lập',
      headquarters: 'Trụ sở chính',
      website: 'Website',
      phone: 'Số điện thoại',
      address: 'Địa chỉ',
      workingHours: 'Thời gian làm việc',
      viewJobs: 'Xem việc làm'
    },
    en: {
      company: 'Companies',
      jobs: 'Jobs',
      community: 'Community',
      contact: 'Contact',
      signIn: 'Log In',
      signUp: 'Sign Up',
      back: 'Back',
      generalInfo: 'General Information',
      companyDescription: 'Company Description',
      benefits: 'Employee Benefits',
      workEnvironment: 'Work Environment',
      contactInfo: 'Contact Information',
      companySuggestions: 'Company Suggestions',
      alertMessage: 'Company suggestion feature will be developed in the future!',
      companySize: 'Company Size',
      industry: 'Industry',
      founded: 'Founded',
      headquarters: 'Headquarters',
      website: 'Website',
      phone: 'Phone',
      address: 'Address',
      workingHours: 'Working Hours',
      viewJobs: 'View Jobs'
    }
  };

  const t = translations[language];

  const handleLogin = () => {
    window.location.href = 'http://localhost:3002?mode=login';
  };

  const handleSignup = () => {
    window.location.href = 'http://localhost:3002?mode=signup';
  };

  const samsungData = {
    vi: {
      name: 'Samsung Việt Nam',
      industry: 'Công nghệ',
      size: '10,000+ nhân viên',
      founded: '1969',
      headquarters: 'Seoul, Hàn Quốc',
      website: 'www.samsung.com/vn',
      phone: '(028) 3911 0000',
      address: 'Tầng 15, Tòa nhà Bitexco Financial Tower, 2 Hải Triều, Quận 1, TP.HCM',
      workingHours: 'Thứ 2 - Thứ 6 (8:00 - 17:30)',
      description: 'Samsung là tập đoàn công nghệ hàng đầu thế giới, chuyên sản xuất điện tử tiêu dùng, thiết bị di động và các giải pháp công nghệ tiên tiến.',
      benefits: [
        'Lương thưởng cạnh tranh theo năng lực',
        'Bảo hiểm sức khỏe toàn diện',
        'Cơ hội đào tạo và phát triển nghề nghiệp',
        'Môi trường làm việc quốc tế',
        'Các chương trình phúc lợi đa dạng'
      ],
      environment: 'Môi trường làm việc năng động, sáng tạo với công nghệ hiện đại và cơ hội học hỏi từ các chuyên gia quốc tế.'
    },
    en: {
      name: 'Samsung Vietnam',
      industry: 'Technology',
      size: '10,000+ employees',
      founded: '1969',
      headquarters: 'Seoul, South Korea',
      website: 'www.samsung.com/vn',
      phone: '(028) 3911 0000',
      address: '15th Floor, Bitexco Financial Tower, 2 Hai Trieu, District 1, HCMC',
      workingHours: 'Monday - Friday (8:00 - 17:30)',
      description: 'Samsung is a leading global technology conglomerate, specializing in consumer electronics, mobile devices, and advanced technology solutions.',
      benefits: [
        'Competitive salary based on performance',
        'Comprehensive health insurance',
        'Training and career development opportunities',
        'International working environment',
        'Diverse welfare programs'
      ],
      environment: 'Dynamic and creative working environment with modern technology and opportunities to learn from international experts.'
    }
  };

  const data = samsungData[language];

  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-white shadow-sm">
        <div className="container">
          <button 
            className="btn btn-secondary btn-sm me-3"
            onClick={onBack}
          >
            ← {t.back}
          </button>
          <a className="navbar-brand fw-bold" href="#" style={{fontSize: '24px'}}>
            <span style={{color: '#007bff'}}>JobConnect</span><span style={{color: '#28a745'}}>4Students</span>
          </a>
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <a className="nav-link" href="#">
                {t.company}
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#" onClick={onBack}>
                {t.jobs}
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="https://www.facebook.com/doanhoikhoacnttvaa" target="_blank" rel="noopener noreferrer" style={{cursor: 'pointer'}}>
                {t.community}
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="https://www.facebook.com/nguyen.tan.loc.87930" target="_blank" rel="noopener noreferrer" style={{cursor: 'pointer'}}>
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

      <section className="banner">
        <div className="banner-content">
          <div className="logo-container">
            <img
              src="Samsung.png"
              alt="Samsung Logo"
              className="company-logo"
              onError={(e) => {e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg'}}
            />
          </div>
          <div className="job-info">
            <h1 className="job-title">{data.name}</h1>
            <p className="company-name">{data.industry}</p>
            <p className="job-detail">
              <i className="fas fa-map-marker-alt"></i> {data.address}
            </p>
            <p className="job-detail"><i className="fas fa-users"></i> {data.size}</p>
            <p className="job-detail"><i className="fas fa-calendar-alt"></i> {t.founded}: {data.founded}</p>
            <div className="action-buttons">
              <button className="btn-action">{t.viewJobs}</button>
            </div>
          </div>
        </div>
      </section>

      <div className="main-layout">
        <div className="content-main">
          <div style={{background: '#fff', borderRadius: '8px', padding: '20px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'}}>
            <h2 style={{fontSize: '24px', color: '#007bff', marginBottom: '15px'}}>{t.generalInfo}</h2>
            <div style={{display: 'flex', gap: '20px', maxWidth: '700px'}}>
              <div style={{background: '#f0f7ff', padding: '20px', borderRadius: '8px', flex: 1}}>
                <div style={{marginBottom: '15px'}}>
                  <span style={{display: 'block', fontWeight: 'bold', color: '#333'}}>{t.industry}</span>
                  <p style={{margin: '2px 0 0', fontWeight: 'normal', color: '#111'}}>{data.industry}</p>
                </div>
                <div style={{marginBottom: '15px'}}>
                  <span style={{display: 'block', fontWeight: 'bold', color: '#333'}}>{t.companySize}</span>
                  <p style={{margin: '2px 0 0', fontWeight: 'normal', color: '#111'}}>{data.size}</p>
                </div>
                <div style={{marginBottom: '15px'}}>
                  <span style={{display: 'block', fontWeight: 'bold', color: '#333'}}>{t.headquarters}</span>
                  <p style={{margin: '2px 0 0', fontWeight: 'normal', color: '#111'}}>{data.headquarters}</p>
                </div>
                <div>
                  <span style={{display: 'block', fontWeight: 'bold', color: '#333'}}>{t.website}</span>
                  <p style={{margin: '2px 0 0', fontWeight: 'normal', color: '#111'}}>
                    <a href="https://www.samsung.com/vn/?srsltid=AfmBOopP9aTp0CP3iVb0JIlw8Snz3-Q1y9Br6MY7Oav0eMY_XiHgSC_X" target="_blank" rel="noopener noreferrer" style={{color: '#007bff', textDecoration: 'none'}}>
                      {data.website}
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div style={{background: '#fff', borderRadius: '8px', padding: '20px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'}}>
            <h2 style={{fontSize: '24px', color: '#007bff', marginBottom: '15px'}}>{t.companyDescription}</h2>
            <p style={{marginBottom: '15px'}}>{data.description}</p>
          </div>

          <div style={{background: '#fff', borderRadius: '8px', padding: '20px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'}}>
            <h2 style={{fontSize: '24px', color: '#007bff', marginBottom: '15px'}}>{t.benefits}</h2>
            <ul>
              {data.benefits.map((benefit, index) => (
                <li key={index} style={{marginBottom: '8px'}}>{benefit}</li>
              ))}
            </ul>
          </div>

          <div style={{background: '#fff', borderRadius: '8px', padding: '20px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'}}>
            <h2 style={{fontSize: '24px', color: '#007bff', marginBottom: '15px'}}>{t.workEnvironment}</h2>
            <p>{data.environment}</p>
          </div>

          <div style={{background: '#fff', borderRadius: '8px', padding: '20px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'}}>
            <h2 style={{fontSize: '24px', color: '#007bff', marginBottom: '15px'}}>{t.contactInfo}</h2>
            <p><strong>{t.phone}:</strong> {data.phone}</p>
            <p><strong>{t.address}:</strong> {data.address}</p>
            <p><strong>{t.workingHours}:</strong> {data.workingHours}</p>
          </div>
        </div>

        <div className="content-sidebar">
          <div 
            style={{
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '6px', 
              border: '1.5px solid #007bff', 
              color: '#007bff', 
              padding: '8px 12px', 
              borderRadius: '6px', 
              background: '#fff', 
              cursor: 'pointer', 
              marginBottom: '20px', 
              fontWeight: 'bold', 
              fontSize: '14px',
              minWidth: '150px',
              maxWidth: '180px',
              marginLeft: 'auto',
              marginRight: 'auto'
            }}
            onClick={() => alert(t.alertMessage)}
          >
            <i className="fa-solid fa-building"></i>
            {t.companySuggestions}
          </div>

          <div style={{background: '#fff', borderRadius: '8px', padding: '15px', boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)'}}>
            {[
              { logo: "Google.png", name: language === 'vi' ? "Google Việt Nam" : "Google Vietnam" },
              { logo: "Microsoft.png", name: language === 'vi' ? "Microsoft Việt Nam" : "Microsoft Vietnam" },
              { logo: "Apple.png", name: language === 'vi' ? "Apple Việt Nam" : "Apple Vietnam" }
            ].map((company, index) => (
              <div key={index} style={{display: 'flex', alignItems: 'center', gap: '12px', padding: '15px 0', borderBottom: index < 2 ? '1px solid #eee' : 'none'}}>
                <div style={{width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <img src={company.logo} alt="logo" style={{width: '45px', height: '45px', objectFit: 'contain'}} onError={(e) => {e.target.src = 'https://via.placeholder.com/45x45?text=Logo'}} />
                </div>
                <div style={{flex: 1}}>
                  <div style={{fontWeight: 'bold', color: '#111', marginBottom: '4px'}}>{company.name}</div>
                </div>
                <div 
                  style={{fontSize: '18px', color: '#aaa', cursor: 'pointer'}} 
                  onClick={() => alert(t.alertMessage)}
                >
                  <i className="fa-regular fa-heart"></i>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer style={{marginTop: '50px', padding: '30px 0', backgroundColor: '#f8f9fa', textAlign: 'center'}}>
        <div className="container">
          <h5 style={{fontWeight: 'bold', color: '#007bff', marginBottom: '15px'}}>
            JobConnect <span style={{color: '#28a745'}}>4Students</span>
          </h5>
          <p>497 Hoa Hao Street, Ward 7, District 10, Ho Chi Minh City</p>
          <p>Hotline : 0943009243</p>
          <div style={{marginTop: '10px'}}>
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" style={{textDecoration: 'none', color: '#007bff'}}>Facebook</a> · 
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" style={{textDecoration: 'none', color: '#007bff'}}>Instagram</a> ·
            <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" style={{textDecoration: 'none', color: '#007bff'}}>YouTube</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CompanyDetail;