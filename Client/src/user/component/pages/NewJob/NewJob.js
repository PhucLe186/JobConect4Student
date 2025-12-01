import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './NewJob.module.scss';
import classNames from 'classnames/bind';
import translations from '~/component/Translation';
import { AuthContext } from '~/context/AuthContext';

const cx = classNames.bind(styles);


function NewJob() {
  const navigate = useNavigate();
  const{ language, api}=useContext(AuthContext)
  const t = translations[language];
  const [form, setForm] = useState({
    title: '',
    description: '',
    job_type: 'full-time', 
    min_salary: '',
    max_salary: '',
    location: '',
    deadline: '',
    industry: '',
    experience: 'không yêu cầu',
    level: 'Nhân viên',
    requirements: ''
  });
  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/jobs', form);
      if (response.data) {
        alert('Tạo việc làm thành công! Chờ admin duyệt.');
        navigate(-1);
      }
    } catch (error) {
      console.error('Error creating job:', error);
      alert('Lỗi khi tạo việc làm');
    }
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
                Loại hình <span className={cx('newjob__req')}>*</span>
              </label>
              <select
                className={cx('newjob__input')}
                name="job_type"
                value={form.job_type}
                onChange={onChange}
                required
              >
                <option value="full-time">Toàn thời gian</option>
                <option value="part-time">Bán thời gian</option>
                <option value="internship">Thực tập</option>
              </select>
            </div>

            <div className={cx('newjob__field')}>
              <label className={cx('newjob__label')}>
                Lương tối thiểu
              </label>
              <input
                className={cx('newjob__input')}
                name="min_salary"
                type="number"
                placeholder="10000000"
                value={form.min_salary}
                onChange={onChange}
              />
            </div>

            <div className={cx('newjob__field')}>
              <label className={cx('newjob__label')}>
                Lương tối đa
              </label>
              <input
                className={cx('newjob__input')}
                name="max_salary"
                type="number"
                placeholder="20000000"
                value={form.max_salary}
                onChange={onChange}
              />
            </div>

            <div className={cx('newjob__field')}>
              <label className={cx('newjob__label')}>
                Ngành nghề
              </label>
              <input
                className={cx('newjob__input')}
                name="industry"
                placeholder="Công nghệ thông tin"
                value={form.industry}
                onChange={onChange}
              />
            </div>

            <div className={cx('newjob__field')}>
              <label className={cx('newjob__label')}>
                Kinh nghiệm
              </label>
              <select
                className={cx('newjob__input')}
                name="experience"
                value={form.experience}
                onChange={onChange}
              >
                <option value="không yêu cầu">Không yêu cầu</option>
                <option value="dưới 1 năm">Dưới 1 năm</option>
                <option value="1 năm">1 năm</option>
                <option value="2 năm">2 năm</option>
                <option value="3 năm">3 năm</option>
                <option value="4 năm">4 năm</option>
                <option value="4 năm trở lên">4 năm trở lên</option>
              </select>
            </div>

            <div className={cx('newjob__field')}>
              <label className={cx('newjob__label')}>
                Cấp bậc
              </label>
              <select
                className={cx('newjob__input')}
                name="level"
                value={form.level}
                onChange={onChange}
              >
                <option value="Nhân viên">Nhân viên</option>
                <option value="Trưởng nhóm">Trưởng nhóm</option>
                <option value="Trưởng/Phó phòng">Trưởng/Phó phòng</option>
                <option value="Quản lý / Giám sát">Quản lý / Giám sát</option>
                <option value="Trưởng chi nhánh">Trưởng chi nhánh</option>
                <option value="Phó giám đốc">Phó giám đốc</option>
                <option value="Giám đốc">Giám đốc</option>
                <option value="Thực tập sinh">Thực tập sinh</option>
              </select>
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

        {/* SECTION 3: Yêu cầu */}
        <section className={cx('newjob__card')}>
          <h2 className={cx('newjob__card-title')}>Yêu cầu công việc</h2>
          
          <div className={cx('newjob__field')}>
            <label className={cx('newjob__label')}>
              Yêu cầu chi tiết
            </label>
            <textarea
              className={cx('newjob__textarea')}
              rows={6}
              name="requirements"
              placeholder="Mô tả các yêu cầu về kỹ năng, kinh nghiệm, bằng cấp..."
              value={form.requirements}
              onChange={onChange}
            />
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