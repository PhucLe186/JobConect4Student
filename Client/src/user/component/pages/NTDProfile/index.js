import { useContext, useEffect, useState } from 'react';
import styles from './Home.module.scss';
import classNames from 'classnames/bind';
import translations from '~/component/Translation';
import { AuthContext } from '~/context/AuthContext';

import axios from 'axios';

const cx = classNames.bind(styles);

function NTDProfile() {
  const {language, api}= useContext(AuthContext)
  const t = translations[language];
  const [provinceOptions, setProvinceOptions]=useState([])
  const [districtOptions, setDistrictOptions]=useState([])
  const [district, setDistrict]= useState('')
  const [province, setProvince]=useState('')
  const [industry, setIndustry]= useState('')
  const [detail, setDetail]=useState('')
  const [loading, setLoading] = useState(true);
  const [companyData, setCompanyData] = useState({
    company_name: '',
    size: '',
    industry: '',
    description: '',
    address: '',
    website: ''
  });

  useEffect(() => {
    fetchCompanyProfile();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCompanyProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get('/employer/me');
      if (response.data) {
        setCompanyData({
          company_name: response.data.company_name || '',
          size: response.data.size || '',
          industry: response.data.industry || '',
          description: response.data.description || '',
          address: response.data.address || '',
          website: response.data.website || ''
        });
        setIndustry(response.data.industry || '');
      }
    } catch (error) {
      console.error('Error fetching company profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setCompanyData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      const fullAddress = `${detail}, ${district}, ${province}`.replace(/^,\s*|,\s*$/g, '');
      const dataToSave = {
        ...companyData,
        address: fullAddress,
        industry: industry
      };
      
      await api.post('/employer', dataToSave);
      alert('Cập nhật thông tin công ty thành công!');
    } catch (error) {
      console.error('Error saving company profile:', error);
      alert('Lỗi khi cập nhật thông tin công ty');
    }
  };

  const industryOptions = 
  [
    { id: 1, name: 'Công nghệ thông tin & Phần mềm' },
    { id: 2, name: 'Internet / Viễn thông / Digital Media' },
    { id: 3, name: 'Tài chính / Ngân hàng / Bảo hiểm' },
    { id: 4, name: 'Marketing – Truyền thông – Sáng tạo' },
    { id: 5, name: 'Bán hàng – Dịch vụ khách hàng' },
    { id: 6, name: 'Sản xuất – Công nghiệp' },
    { id: 7, name: 'Xây dựng – Kiến trúc' },
    { id: 8, name: 'Logistics – Kho vận / Vận tải' },
    { id: 9, name: 'Y tế – Sức khỏe' },
    { id: 10, name: 'Giáo dục / Đào tạo' },
    { id: 11, name: 'Nhà hàng – Khách sạn / Hospitality' },
    { id: 12, name: 'Luật – Hành chính – Nhân sự' },
    { id: 13, name: 'Bất động sản' },
    { id: 14, name: 'Nông nghiệp / Food Production' },
  ];

  useEffect(()=> {
    const fetchdata=async()=> {
      const res= await axios.get('https://provinces.open-api.vn/api/v1/?depth=2')
      if(res.data) {
        setProvinceOptions(res.data
          .map(item=> ({name:item.name, id:item.code}))
          .sort((a,b)=> a.name.localeCompare(b.name, 'vi'))
        )

        const districtMap= Object.fromEntries(res.data.map(item=>[item.name, item.districts]))
        setDistrictOptions(districtMap)
      }
    }
    fetchdata()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  if (loading) {
    return <div className={cx('loading')}>Đang tải...</div>;
  }

  return (
    <div className={cx('company')}>
      <h1 className={cx('company__title')}>{t.companyProfile}</h1>
      
      {/* --- Section 1: Thông tin công ty --- */}
      <section className={cx('company__section')}>
        <div className={cx('company__section-header')}>
          <span className={cx('company__section-icon')} aria-hidden>🏠</span>
          <h2 className={cx('company__section-title')}>{t.sectionInfo}</h2>
        </div>

        <div className={cx('company__body')}>
          <div className={cx('company__row', 'company__row--gap-lg')}>
            <div className={cx('company__avatar')}>
              <img
                className={cx('company__avatar-img')}
                src="https://placehold.co/120x120"
                alt={t.avatarAlt} 
              />
            </div>

            <div className={cx('company__col', 'company__col--grow')}>
              <div className={cx('company__field')}>
                <label className={cx('company__label')}>{t.companyName}</label>
                <input 
                    className={cx('company__input')} 
                    placeholder={t.ph_companyName} 
                    value={companyData.company_name}
                    onChange={(e) => handleInputChange('company_name', e.target.value)}
                />
              </div>

              <div className={cx('company__grid', 'company__grid--2')}>
                <div className={cx('company__field')}>
                  <label className={cx('company__label')}>{t.companySize}</label>
                  <input 
                    className={cx('company__input')} 
                    type="number"
                    placeholder={t.ph_companySize} 
                    value={companyData.size}
                    onChange={(e) => handleInputChange('size', e.target.value)}
                  />
                </div>
                <div className={cx('company__field')}>
                  <label className={cx('company__label')}>{t.companyIndustry || 'Lĩnh vực công ty'}</label>
                  <select
                    className={cx('company__input')}
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    aria-label={t.companyIndustry || 'Lĩnh vực công ty'}
                  >
                    <option value="">{t.ph_companyIndustry || 'Chọn lĩnh vực công ty'}</option>
                    {industryOptions.map((ind) => (
                      <option key={ind.id} value={ind.name}>{ind.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={cx('company__field')}>
                <label className={cx('company__label')}>{t.description}</label>
                <textarea
                  className={cx('company__textarea')}
                  placeholder={t.ph_description}
                  rows={6}
                  value={companyData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/*Thông tin liên hệ*/}
      <section className={cx('company__section')}>
        <div className={cx('company__section-header')}>
          <span className={cx('company__section-icon')} aria-hidden>📍</span>
          <h2 className={cx('company__section-title')}>{t.sectionContact}</h2>
        </div>

        <div className={cx('company__body')}>
          <div className={cx('company__field')}>
            <label className={cx('company__label')}>{t.address}</label>

            <div style={{ display: 'grid', gap: 8, gridTemplateColumns: '1fr 1fr 2fr' }}>
              {/* Select tỉnh/thành */}
              <select
                className={cx('company__input')}
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                aria-label={t.province || 'Tỉnh/Thành'}
              >
                <option value="">{t.ph_province || 'Chọn tỉnh/thành'}</option>
                {provinceOptions.map(p => (
                  <option key={p.id} value={p.name}>{p.name}</option>
                ))}
              </select>

              {/* Select quận/huyện */}
              <select
                className={cx('company__input')}
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                disabled={!province}
                aria-label={t.district || 'Quận/Huyện'}
              >
                <option value="">{t.ph_district || 'Chọn quận/huyện'}</option>
                {districtOptions[province]?.map(d => (
                  <option key={d.id} value={d.name}>{d.name}</option>
                ))}
              </select>

              {/* Địa chỉ chi tiết */}
              <input
                className={cx('company__input')}
                placeholder={t.ph_address_detail || 'Số nhà, đường, phường…'}
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
              />
            </div>

            <div className={cx('company__field')}>
              <label className={cx('company__label')}>Website</label>
              <input 
                  className={cx('company__input')} 
                  placeholder="https://company.com" 
                  value={companyData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
              />
            </div>
          </div>
        </div> 
      </section>

      <div className={cx('company__footer')}>
        <button 
          className={cx('company__btn', 'company__btn--primary')}
          onClick={handleSave}
        >
          {t.saveBtn || 'Lưu thông tin'}
        </button>
      </div>
    </div>
  );
}

export default NTDProfile;