import React, { useContext, useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './NewJob.module.scss';
import translations from '~/component/Translation';
import { AuthContext } from '~/context/AuthContext';
import skillsList from './Skilllist';
import axios from 'axios';
import Swal from "sweetalert2";
const cx = classNames.bind(styles);

function NewJob({ onBack, onSubmitForm }) {
  const {language, api}= useContext(AuthContext)
  const [open, setOpen] = useState(false);
  const [provinceOptions, setProvinceOptions]=useState([])
  const [districtOptions, setDistrictOptions]=useState([])
  const t = translations[language||'vi'];
  const [form, setForm] = useState({
    title: '',
    description: '',
    job_type: '',
    min_salary: '',
    max_salary: '',
    province: '',
    district: '',
    deadline: '',
    level: '',
    industry: '',
    experience: '',
    requirements: '',
    skills: [],
  });
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

  const exp=[
      {name: 'không yêu cầu'},
      {name: 'dưới 1 năm'},
      { name: '1 năm'},
      {name: '2 năm'},
      {name: '3 năm'},
      {name: '4 năm'},
      {name: '4 năm trở lên'},
  ];
  const level=[
        { name: 'Giám đốc' },
        { name: 'Phó giám đốc' },
        { name: 'Trưởng chi nhánh' },
        { name: 'Trưởng/Phó phòng' },
        { name: 'Trưởng nhóm' },
        { name: 'Quản lý / Giám sát' },
        { name: 'Nhân viên' },
        { name: 'Thực tập sinh' }
  ]


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

  const onAddSkill = (skillId, skill_name) => {
    setForm(prev => {
      if (prev.skills.some(s => s.skill_id === skillId)) return prev;
      return {
        ...prev,
        skills: [...prev.skills, { skill_id: skillId, skill_name: skill_name}]
      };
    });

    setOpen(false);
  };

  const onRemoveSkill = (skillId) => {
    setForm(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s.skill_id !== skillId)
    }));
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const onSubmit = async(e) => {
    e.preventDefault();
    const location = `${form.province}, ${form.district}, ${form.detailAddress}`;
    const newForm= { ...form, location: location }
    delete newForm.district;
    delete newForm.province;
    delete newForm.detailAddress;
    console.log(newForm)
    const res= await api.post('jobs',newForm);
    if(res.data) {
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
  };

  return (
    <div className={cx('newjob')}>
      <h1 className={cx('newjob__title')}>{t.pageTitle}</h1>
      <form className={cx('newjob__form')} onSubmit={onSubmit}>

        {/* SESSION 1: Thông tin chính */}
        <section className={cx('newjob__card')}>
          <h2 className={cx('newjob__card-title')}>{t.sectionBasic}</h2>

          <div className={cx('newjob__field')}>
            <label className={cx('newjob__label')}>{t.labelTitle} <span className={cx('newjob__req')}>*</span></label>
            <input
              className={cx('newjob__input')}
              name="title"
              placeholder={t.ph_Title}
              value={form.title}
              onChange={onChange}
              required
            />
          </div>

          <div className={cx('newjob__field')}>
            <label className={cx('newjob__label')}>{t.labelDesc} <span className={cx('newjob__req')}>*</span></label>
            <textarea
              className={cx('newjob__textarea')}
              rows={6}
              name="description"
              placeholder={t.ph_Desc}
              value={form.description}
              onChange={onChange}
              required
            />
          </div>
        </section>

        {/* SESSION 2: Chi tiết & phân loại */}
        <section className={cx('newjob__card')}>
          <h2 className={cx('newjob__card-title')}>{t.sectionDetail}</h2>
          <div className={cx('newjob__grid', 'newjob__grid--3')}>
            <div className={cx('newjob__field')}>
              <label className={cx('newjob__label')}>{t.labelSalary} (Từ)</label>
              <input
                className={cx('newjob__input')}
                name="min_salary"
                placeholder="Từ"
                value={form.salaryMin}
                onChange={onChange}
              />
            </div>
            <div className={cx('newjob__field')}>
              <label className={cx('newjob__label')}>{t.labelSalary} (Đến)</label>
              <input
                className={cx('newjob__input')}
                name="max_salary"
                placeholder="Đến"
                value={form.salaryMax}
                onChange={onChange}
              />
            </div>
            <div className={cx('newjob__field')}>
              <label className={cx('newjob__label')}>{t.labelType}</label>
              <select
                className={cx('newjob__select-native')}
                name="job_type"
                value={form.job_type}
                onChange={onChange}
              >
                <option value="">Chọn loại công việc</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="InternShip">Thực tập</option>
              </select>
              <span className={cx('newjob__select-caret')}>▾</span>
            </div>
          </div>

          {/* Địa chỉ: 1 hàng */}
          <div className={cx('newjob__grid', 'newjob__grid--3')}>
            <div className={cx('newjob__field')}>
              <label className={cx('newjob__label')}>Tỉnh thành <span className={cx('newjob__req')}>*</span></label>
              <select className={cx('newjob__select-native')} name="province" value={form.province} onChange={onChange} required>
                <option value="">Chọn tỉnh thành</option>
                {provinceOptions?.map((province, idx) => <option key={idx} value={province.name}>{province.name}</option>)}
              </select>
              <span className={cx('newjob__select-caret')}>▾</span>
            </div>

            <div className={cx('newjob__field')}>
              <label className={cx('newjob__label')}>Quận huyện <span className={cx('newjob__req')}>*</span></label>
              <select
                className={cx('newjob__select-native')}
                name="district"
                value={form?.district}
                onChange={onChange}
                disabled={!form.province}
                required
              >
                <option value="">{!form.province ? 'Chọn tỉnh trước' : 'Chọn quận'}</option>
                {districtOptions[form.province]?.map((district, idx) => <option key={idx} value={district.name}>{district.name}</option>)}
              </select>
              <span className={cx('newjob__select-caret')}>▾</span>
            </div>

            <div className={cx('newjob__field')}>
              <label className={cx('newjob__label')}>Địa chỉ chi tiết</label>
              <input
                className={cx('newjob__input')}
                name="addressDetail"
                placeholder="VD: Khu Công Nghệ Cao"
                value={form.addressDetail}
                onChange={onChange}
              />
            </div>
          </div>

          {/* Các trường khác */}
          <div className={cx('newjob__grid', 'newjob__grid--2')}>
            <div className={cx('newjob__field')}>
              <label className={cx('newjob__label')}>{t.labelDeadline}</label>
              <input type="date" className={cx('newjob__input')} name="deadline" value={form.deadline} onChange={onChange} />
            </div>

            <div className={cx('newjob__field')}>
              <label className={cx('newjob__label')}>Cấp bậc</label>
              <select className={cx('newjob__select-native')} name="level" value={form.level} onChange={onChange}>
                {level?.map((province, idx) => <option key={idx} value={province.name}>{province.name}</option>)}
              </select>
              <span className={cx('newjob__select-caret')}>▾</span>
            </div>

            <div className={cx('newjob__field')}>
              <label className={cx('newjob__label')}>Ngành nghề</label>
              <select className={cx('newjob__select-native')} name="industry" value={form.industry} onChange={onChange}>
                {industryOptions.map((item, idx)=> (
                  <option key={idx} value={item.name}>{item.name}</option>
                ))}
              </select>
              <span className={cx('newjob__select-caret')}>▾</span>
            </div>

            <div className={cx('newjob__field')}>
              <label className={cx('newjob__label')}>Kinh nghiệm</label>
              <select className={cx('newjob__select-native')} name="experience" value={form.experience} onChange={onChange}>
                {exp.map((item, idx)=> (
                  <option key={idx} value={item.name}>{item.name}</option>
                ))}
              </select>
            </div>

            <div className={cx('newjob__field')}>
              <label className={cx('newjob__label')}>Yêu cầu</label>
              <textarea className={cx('newjob__textarea')} rows={4} name="requirements" value={form.requirements} onChange={onChange} />
            </div>
          </div>
        </section>

        {/* SESSION 3: Kỹ năng */}
        <section className={cx('newjob__card')}>
          <h2 className={cx('newjob__card-title')}>Kỹ năng yêu cầu</h2>
          <div className={cx('skill-select')}>
            <div 
              className={cx('skill-select__input')}
              onClick={() => setOpen(!open)}
            >
              {form.skills.length === 0 ? (
                <span className={cx('skill-select__placeholder')}>Chọn kỹ năng...</span>
              ) : (
                form.skills.map(s => {
                  return (
                    <div key={s.skill_id} className={cx('skill-tag')}>
                      {s?.skill_name}
                      <button 
                        className={cx('skill-tag__remove')} 
                        onClick={(e) => { e.stopPropagation(); onRemoveSkill(s.skill_id); }}
                      >
                        ×
                      </button>
                    </div>
                  );
                })
              )}
              <span className={cx('skill-select__arrow')}>▼</span>
            </div>
            {open && (
              <div className={cx('skill-dropdown')}>
                {skillsList.map(skill => (
                  <div 
                    key={skill.id}
                    className={cx('skill-dropdown__item')}
                    onClick={() => onAddSkill(skill.id, skill.name)}
                  >
                    {skill.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
        {/* Actions */}
        <div className={cx('newjob__actions')}>
          <button type="button" className={cx('newjob__btn', 'newjob__btn--back')} onClick={onBack}>{t.btnBack}</button>
          <button type="submit" className={cx('newjob__btn', 'newjob__btn--save')}>{t.btnSubmit}</button>
        </div>
      </form>
    </div>

  );
}

export default NewJob;
