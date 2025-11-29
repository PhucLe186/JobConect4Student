import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './NewJob.module.scss';
import classNames from 'classnames/bind';
<<<<<<< HEAD

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
    btnBack: 'Back',
    btnSubmit: 'Post Job',
    alertSuccess: 'Form submitted successfully!'
  }
};
=======
import translations from '~/component/Translation';
import { AuthContext } from '~/context/AuthContext';
>>>>>>> 4d5ff411 (new updat 29/11/2025)

const cx = classNames.bind(styles);


function NewJob() {
  const navigate = useNavigate();
  const{ language}=useContext(AuthContext)
  const t = translations[language];
  const [form, setForm] = useState({
    title: '',
    description: '',
    job_type: '', 
    salary_range: '',
    location: '',
    deadline: '',
  });
<<<<<<< HEAD

  const navigate = useNavigate();

  // 3. Lấy từ điển
  const t = trans__newJob[language] || trans__newJob.vi;

=======
>>>>>>> 4d5ff411 (new updat 29/11/2025)
  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
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
      <h1 className={cx('newjob__title')}>{t.postNewJob}</h1>

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
              <input
                className={cx('newjob__input')}
                name="job_type"
                placeholder={t.ph_Type}
                value={form.job_type}
                onChange={onChange}
                required
              />
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
                {t.labelLocation} <span className={cx('newjob__req')}>*</span>
              </label>
              <input
                className={cx('newjob__input')}
                name="location"
                placeholder={t.ph_Location}
                value={form.location}
                onChange={onChange}
                required
              />
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