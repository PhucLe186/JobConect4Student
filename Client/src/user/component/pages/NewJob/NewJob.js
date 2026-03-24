import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './NewJob.module.scss';
import classNames from 'classnames/bind';

// 1. Translation object
const trans__newJob = {
  vi: {
    pageTitle: 'Đăng tin tuyển dụng mới',
    sectionBasic: 'Thông tin cơ bản',
    labelTitle: 'Tiêu đề công việc',
    ph_Title: 'Ví dụ: Senior React Developer',
    labelDesc: 'Mô tả chi tiết',
    ph_Desc: 'Mô tả công việc, yêu cầu, quyền lợi...',
    sectionDetail: 'Chi tiết công việc',
    labelType: 'Loại công việc',
    ph_Type: 'Ví dụ: Full-time, Part-time, Remote...',
    labelSalary: 'Mức lương',
    ph_Salary: 'Ví dụ: 15 - 20 Triệu',
    labelLocation: 'Địa điểm',
    ph_Location: 'Ví dụ: Hà Nội, Hồ Chí Minh',
    labelDeadline: 'Hạn ứng tuyển',
    labelExperience: 'Kinh nghiệm',
    btnBack: 'Quay lại',
    btnSubmit: 'Đăng tin',
    alertSuccess: 'Đã gửi biểu mẫu thành công!'
  },
  en: {
    pageTitle: 'Post New Job',
    sectionBasic: 'Basic Information',
    labelTitle: 'Job Title',
    ph_Title: 'Ex: Senior React Developer',
    labelDesc: 'Job Description',
    ph_Desc: 'Job description, requirements, benefits...',
    sectionDetail: 'Job Details',
    labelType: 'Job Type',
    ph_Type: 'Ex: Full-time, Part-time, Remote...',
    labelSalary: 'Salary Range',
    ph_Salary: 'Ex: $1000 - $2000',
    labelLocation: 'Location',
    ph_Location: 'Ex: Hanoi, Ho Chi Minh City',
    labelDeadline: 'Application Deadline',
    labelExperience: 'Experience',
    btnBack: 'Back',
    btnSubmit: 'Post Job',
    alertSuccess: 'Form submitted successfully!'
  }
};

const cx = classNames.bind(styles);

// 2. Nhận prop language
function NewJob({ language = 'vi' }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    job_type: '',
    experience: '',
    salary_range: '',
    province: '',
    district: '',
    deadline: '',
  });

  const navigate = useNavigate();

  // 3. Lấy từ điển
  const t = trans__newJob[language] || trans__newJob.vi;

  // Dữ liệu quận/huyện theo tỉnh thành
  const districtsByProvince = {
    'TP.HCM': ['Quận 1', 'Quận 3', 'Quận 7', 'Quận Bình Thạnh', 'Quận Tân Bình', 'Quận Phú Nhuận'],
    'Hà Nội': ['Ba Đình', 'Hoàn Kiếm', 'Hai Bà Trưng', 'Đống Đa', 'Tây Hồ', 'Cầu Giấy'],
    'Đà Nẵng': ['Hải Châu', 'Thanh Khê', 'Sơn Trà', 'Ngũ Hành Sơn', 'Liên Chiểu', 'Cẩm Lệ'],
    'Cần Thơ': ['Ninh Kiều', 'Bình Thủy', 'Cái Răng', 'Ô Môn', 'Thốt Nốt'],
    'Hải Phòng': ['Hồng Bàng', 'Ngô Quyền', 'Lê Chân', 'Hải An', 'Kiến An'],
    'Biên Hòa': ['Trung Dũng', 'Quyết Thắng', 'Thống Nhất', 'Tân Hòa', 'Tân Hiệp']
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    if (name === 'province') {
      setForm((s) => ({ ...s, [name]: value, district: '' })); // Reset district khi đổi tỉnh
    } else {
      setForm((s) => ({ ...s, [name]: value }));
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    console.log('Payload to send to API:', form);
    // 4. Dịch cả thông báo alert
    alert(t.alertSuccess);
  };



  const onBack = () => {
    navigate(-1);
  };

  return (
    <div className={cx('newjob')}>
      <h1 className={cx('newjob__title')}>{t.pageTitle}</h1>

      <form className={cx('newjob__form')} onSubmit={onSubmit}>
        {/* SECTION 1: Thông tin chính */}
        <section className={cx('newjob__card')}>
          <h2 className={cx('newjob__card-title')}>{t.sectionBasic}</h2>

          <div className={cx('newjob__field')}>
            <label className={cx('newjob__label')}>
              {t.labelTitle} <span className={cx('newjob__req')}>*</span>
            </label>
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
            <label className={cx('newjob__label')}>
              {t.labelDesc} <span className={cx('newjob__req')}>*</span>
            </label>
            <textarea
              className={cx('newjob__textarea')}
              rows={8}
              name="description"
              placeholder={t.ph_Desc}
              value={form.description}
              onChange={onChange}
              required
            />
          </div>
        </section>

        {/* SECTION 2: Chi tiết và phân loại */}
        <section className={cx('newjob__card')}>
          <h2 className={cx('newjob__card-title')}>{t.sectionDetail}</h2>

          <div className={cx('newjob__grid', 'newjob__grid--2')}>
            
            <div className={cx('newjob__field')}>
              <label className={cx('newjob__label')}>
                {t.labelType} <span className={cx('newjob__req')}>*</span>
              </label>
              <div className={cx('newjob__select')}>
                <select
                  className={cx('newjob__select-native')}
                  name="job_type"
                  value={form.job_type}
                  onChange={onChange}
                  required
                >
                  <option value="">Chọn loại công việc</option>
                  <option value="fulltime">Full-time</option>
                  <option value="parttime">Part-time</option>
                  <option value="thuctap">Thực tập</option>
                </select>
                <span className={cx('newjob__select-caret')}>▾</span>
              </div>
            </div>

            <div className={cx('newjob__field')}>
              <label className={cx('newjob__label')}>
                {t.labelSalary}
              </label>
              <input
                className={cx('newjob__input')}
                name="salary_range"
                placeholder={t.ph_Salary}
                value={form.salary_range}
                onChange={onChange}
              />
            </div>

            <div className={cx('newjob__field')}>
              <label className={cx('newjob__label')}>
                Tỉnh thành <span className={cx('newjob__req')}>*</span>
              </label>
              <div className={cx('newjob__select')}>
                <select
                  className={cx('newjob__select-native')}
                  name="province"
                  value={form.province}
                  onChange={onChange}
                  required
                >
                  <option value="">Chọn tỉnh thành</option>
                  <option value="TP.HCM">TP. Hồ Chí Minh</option>
                  <option value="Hà Nội">Hà Nội</option>
                  <option value="Đà Nẵng">Đà Nẵng</option>
                  <option value="Cần Thơ">Cần Thơ</option>
                  <option value="Hải Phòng">Hải Phòng</option>
                  <option value="Biên Hòa">Biên Hòa</option>
                </select>
                <span className={cx('newjob__select-caret')}>▾</span>
              </div>
            </div>

            <div className={cx('newjob__field')}>
              <label className={cx('newjob__label')}>
                Quận huyện <span className={cx('newjob__req')}>*</span>
              </label>
              <div className={cx('newjob__select')}>
                <select
                  className={cx('newjob__select-native')}
                  name="district"
                  value={form.district}
                  onChange={onChange}
                  required
                  disabled={!form.province}
                >
                  <option value="">{!form.province ? 'Chọn tỉnh thành trước' : 'Chọn quận huyện'}</option>
                  {form.province && districtsByProvince[form.province]?.map(district => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
                <span className={cx('newjob__select-caret')}>▾</span>
              </div>
            </div>

            <div className={cx('newjob__field')}>
              <label className={cx('newjob__label')}>
                {t.labelExperience} <span className={cx('newjob__req')}>*</span>
              </label>
              <div className={cx('newjob__select')}>
                <select
                  className={cx('newjob__select-native')}
                  name="experience"
                  value={form.experience}
                  onChange={onChange}
                  required
                >
                  <option value="">{language === 'vi' ? 'Chọn kinh nghiệm' : 'Select experience'}</option>
                  <option value="không yêu cầu">{language === 'vi' ? 'Không yêu cầu' : 'No experience required'}</option>
                  <option value="dưới 1 năm">{language === 'vi' ? 'Dưới 1 năm' : 'Under 1 year'}</option>
                  <option value="1 năm">{language === 'vi' ? '1 năm' : '1 year'}</option>
                  <option value="2 năm">{language === 'vi' ? '2 năm' : '2 years'}</option>
                  <option value="3 năm">{language === 'vi' ? '3 năm' : '3 years'}</option>
                  <option value="4 năm">{language === 'vi' ? '4 năm' : '4 years'}</option>
                  <option value="4 năm trở lên">{language === 'vi' ? '4 năm trở lên' : '4+ years'}</option>
                </select>
                <span className={cx('newjob__select-caret')}>▾</span>
              </div>
            </div>

            <div className={cx('newjob__field')}>
              <label className={cx('newjob__label')}>
                {t.labelDeadline} <span className={cx('newjob__req')}>*</span>
              </label>
              <input
                className={cx('newjob__input')}
                type="date"
                name="deadline"
                value={form.deadline}
                onChange={onChange}
                required
              />
            </div>

          </div>
        </section>

        <div className={cx('newjob__actions')}>
          <button
            type="button"
            className={cx('newjob__btn', 'newjob__btn--back')}
            onClick={onBack}
          >
            {t.btnBack}
          </button>
          <button
            className={cx('newjob__btn', 'newjob__btn--save')}
            type="submit"
          >
            {t.btnSubmit}
          </button>
        </div>
      </form>


    </div>
  );
}

export default NewJob;