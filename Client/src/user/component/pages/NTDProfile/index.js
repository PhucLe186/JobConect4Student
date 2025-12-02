import { useContext, useEffect, useRef, useState } from 'react';
import styles from './Home.module.scss';
import classNames from 'classnames/bind';
import translations from '~/component/Translation';
import { AuthContext } from '~/context/AuthContext';
import axios from 'axios';
import Swal from "sweetalert2";


const cx = classNames.bind(styles);

function NTDProfile() {
  const fileInputRef = useRef(null);
  const {language, api}= useContext(AuthContext)
  const t = translations[language||'vi'];
  const [provinceOptions, setProvinceOptions]=useState([])
  const [districtOptions, setDistrictOptions]=useState([])
  const [isEditing, setIsEditing] = useState(false);
  const [logoFile, setLogoFile]= useState('')
  const [FormInital, setFormInital] = useState({});
  const [Form, setForm] = useState({});

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
    const FetchAdress=async()=> {
      const res= await axios.get('https://provinces.open-api.vn/api/v1/?depth=2')
      if(res.data) {
        setProvinceOptions(res.data
          .map(item=> ({name:item.name, id:item.code}))
        )

        const districtMap= Object.fromEntries(res.data.map(item=>[item.name, item.districts]))
        setDistrictOptions(districtMap)
      }
    }
    FetchAdress()
  },[])

  useEffect(()=> {
    const FetchInformation= async()=> {
      try{
        const res= await api.get('employer/information')
        const data = res.data;
        const { address, ...rest } = data; 
        const parts = address.split(',').map(p => p.trim());;
         setForm(prev=> ({
          ...prev,
          ...rest,
          detail: parts[0] ?? '',
          district: parts[1] ?? '',
          province: parts[2] ?? '',
          logo: logoFile? prev.logo: rest.logo
        }))
        setFormInital(prev=> ({
          ...prev,
          ...rest,
          detail: parts[0] ?? '',
          district: parts[1] ?? '',
          province: parts[2] ?? '',
          logo: logoFile? prev.logo: rest.logo
        }))
      }catch(error){
         console.error('Fetch information error:', error.response?.data || error.message);
      }
    }
    FetchInformation()
  },[])

  const UpdateFinalForm= (initForm ,form)=> {
    const finalForm={}
    for( var key in form) {
      if(form[key]!==initForm[key]) {
        finalForm[key] = form[key]
      }
    }
    return finalForm
  } 

  const handleSelectImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm(prev=> ({
        ...prev,
        logo: URL.createObjectURL(file),
      }))
      setLogoFile(file);
    }
  };

  console.log(provinceOptions)
  const handleInputChange=(e)=> {
    const {name, value}= e.target
    setForm(pre=> ({
      ...pre,
      [name]: value
    }))
  }
  const handlesaveinfor= async()=> {
    const upload=new FormData()
    const finalForm=UpdateFinalForm(FormInital, Form)
    let address=null
    if(Object.keys(finalForm).length===0) {
      setIsEditing(false)
      return
    } 
    if('detail' in finalForm|| 'district' in finalForm || 'province' in finalForm) {
      const detail= finalForm.detail ?? FormInital.detail
      const district= finalForm.district ?? FormInital.district
      const province= finalForm.province ?? FormInital.province

      address = `${detail}, ${district}, ${province}`;
      finalForm.address = address;

      delete finalForm.detail;
      delete finalForm.district;
      delete finalForm.province;
    }
    if(logoFile) upload.append('file', logoFile)
    Object.entries(finalForm).forEach(([key, value])=>{
        upload.append(key, value)
    })
    console.log(finalForm)
    console.log(upload)
    const res= await api.post('employer', upload)
    if(res.data) {
      setIsEditing(false)
      Swal.fire({
        icon: 'success',
        title: 'Mission Complete!',
        text: `${res.data.message}`,
        background: '#ffffff',
        color: '#212529',
        confirmButtonText: 'OK',
        confirmButtonColor: '#0D6EFD', 
        customClass: {
            popup: 'rounded-2xl shadow-[0_0_25px_#7C3AED55]',
            title: 'text-purple-400 font-bold',
            confirmButton: 'text-white font-medium px-6 py-2 rounded-lg bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-600 hover:to-indigo-500',
        },
      });  
    }
  }
  return (
    <div className={cx('company')}>
      <h1 className={cx('company__title')}>{t.companyProfile}</h1>
      
      {/* --- Section 1: Thông tin công ty --- */}
      <section className={cx('company__section')}>
        <div className={cx('company__section-header')}>
          <h2 className={cx('company__section-title')}>{t.sectionInfo}</h2>        
          {!isEditing && (
              <button 
                className={cx('company__edit-btn')}
                onClick={() => setIsEditing(true)}
              >
                {t.editBtn}
              </button>
          )}

        </div>
        <div className={cx('company__body')}>
          <div className={cx('company__row', 'company__row--gap-lg')}>
            <div 
            onClick={() => fileInputRef.current.click()}
            className={cx('company__avatar')}>
              <img
                className={cx('company__avatar-img')}
                src={Form.logo}
                alt={t.avatarAlt} 
              />
                <input
                  disabled={!isEditing}
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleSelectImage}
                  hidden
                />
            </div>

            <div className={cx('company__col', 'company__col--grow')}>
              <div className={cx('company__field')}>
                <label className={cx('company__label')}>{t.companyName}</label>
                <input 
                    name='company_name'
                    onChange={handleInputChange}
                    value={Form.company_name||''}
                    className={cx('company__input')} 
                    placeholder={t.ph_companyName} 
                    disabled={!isEditing}
                />
              </div>

              <div className={cx('company__grid', 'company__grid--2')}>
                <div className={cx('company__field')}>
                  <label className={cx('company__label')}>{t.companySize}</label>
                  <input 
                    name='size'
                    onChange={handleInputChange}
                    value={Form.size||''}
                    className={cx('company__input')} 
                    placeholder={t.ph_companySize} 
                    disabled={!isEditing}
                  />
                </div>
                <div className={cx('company__field')}>
                  <label className={cx('company__label')}>{t.companyIndustry}</label>
                  <select
                    name='industry'
                    onChange={handleInputChange}
                    className={cx('company__input')}
                    value={Form.industry||''}
                    disabled={!isEditing}
                    aria-label={t.companyIndustry}
                  >
                    <option value={""} >{t.ph_companyIndustry}</option>
                    {industryOptions.map((ind) => (
                      <option key={ind.id} value={ind.name}>{ind.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={cx('company__field')}>
                <label className={cx('company__label')}>{t.description}</label>
                <textarea
                  name='description'
                  onChange={handleInputChange}
                  value={Form.description||''}
                  className={cx('company__textarea')}
                  placeholder={t.ph_description}
                  rows={6}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/*Thông tin liên hệ*/}
      <section className={cx('company__section')}>
        <div className={cx('company__section-header')}>
          <h2 className={cx('company__section-title')}>{t.sectionContact}</h2>
        </div>

        <div className={cx('company__body')}>
          <div className={cx('company__field')}>
            <label className={cx('company__label')}>{t.address}</label>

            <div style={{ display: 'grid', gap: 8, gridTemplateColumns: '1fr 1fr 2fr' }}>
              {/* Select tỉnh/thành */}
              <select
                name='province'
                className={cx('company__input')}
                value={Form.province||''}
                disabled={!isEditing}
                onChange={handleInputChange}
                aria-label={t.province}
              >
                <option value="">{t.ph_province}</option>
                {provinceOptions.map((p, idx) => (
                  <option key={idx} value={p.name}>{p.name}</option>
                ))}
              </select>

              {/* Select quận/huyện */}
              <select
                name='district'
                className={cx('company__input')}
                value={Form.district||''}
                onChange={handleInputChange}
                disabled={!isEditing }
                aria-label={t.district}
              >
                <option value="">{t.ph_district}</option>
                {districtOptions[Form.province]?.map(d => (
                  <option key={d.id} value={d.name}>{d.name}</option>
                ))}
              </select>

              {/* Địa chỉ chi tiết */}
              <input
                name='detail'
                className={cx('company__input')}
                placeholder={t.ph_address_detail}
                value={Form.detail||''}
                disabled={!isEditing}
                onChange={handleInputChange}
              />
            </div>

            <div className={cx('company__field')}>
              <label className={cx('company__label')}>{t.phone}</label>
              <input 
                  name='phone'
                  value={Form.phone||''}
                  className={cx('company__input')} 
                  placeholder={t.ph_phone} 
                  disabled={!isEditing}
                  onChange={handleInputChange}
              />
            </div>

            <div className={cx('company__field')}>
              <label className={cx('company__label')}>{t.website}</label>
              <input 
                  name='website'
                  onChange={handleInputChange}
                  value={Form.website||''}
                  className={cx('company__input')} 
                  placeholder={t.ph_website} 
                  disabled={!isEditing}
              />
            </div>
          </div>
        </div> 
      </section>

      {isEditing &&
      <div className={cx('company__footer')}>
        <button 
        className={cx('company__btn', 'company__btn--primary')}
        onClick={handlesaveinfor}
        >
          {t.saveBtn}
        </button>
      </div>}
    </div>
  );
}

export default NTDProfile;