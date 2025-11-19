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
    location: '',
    deadline: '',
  });

  const navigate = useNavigate();

  // 3. Lấy từ điển
  const t = trans__newJob[language];

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