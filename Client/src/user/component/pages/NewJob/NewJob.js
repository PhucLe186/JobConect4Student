import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './NewJob.module.scss';
import classNames from 'classnames/bind';

// 1. Import file dịch
import trans__newJob from "../../../../component/Translation/NewJob"

const cx = classNames.bind(styles);

// 2. Nhận prop language
function NewJob({ language = 'vi' }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    job_type: '', 
    salary_range: '',
    province: '',
    district: '',
    deadline: '',
  });

  const navigate = useNavigate();

  // 3. Lấy từ điển
  const t = trans__newJob[language];

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