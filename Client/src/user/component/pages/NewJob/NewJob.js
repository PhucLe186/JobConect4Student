import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './NewJob.module.scss';
import { AuthContext } from '~/context/AuthContext';
import { JOB_LEVEL_OPTIONS } from '~/user/component/shared/jobMetadataUtils';

const cx = classNames.bind(styles);

const translations = {
  vi: {
    pageTitle: 'Đăng tin tuyển dụng mới',
    sectionBasic: 'Thông tin cơ bản',
    sectionDetail: 'Chi tiết công việc',
    sectionContact: 'Thông tin liên hệ',
    labelTitle: 'Tiêu đề công việc',
    labelDesc: 'Mô tả chi tiết',
    labelRequirements: 'Yêu cầu công việc',
    labelType: 'Loại công việc',
    labelMinSalary: 'Lương tối thiểu',
    labelMaxSalary: 'Lương tối đa',
    labelIndustry: 'Ngành nghề',
    labelDepartment: 'Phòng ban',
    labelProvince: 'Tỉnh thành',
    labelDistrict: 'Quận huyện',
    labelExperience: 'Kinh nghiệm',
    labelLevel: 'Cấp bậc',
    labelDeadline: 'Hạn ứng tuyển',
    labelPhone: 'Số điện thoại liên hệ',
    labelWorkingHours: 'Thời gian làm việc',
    placeholderTitle: 'Ví dụ: Frontend Developer',
    placeholderDesc: 'Mô tả công việc, quyền lợi, môi trường làm việc...',
    placeholderRequirements: 'Yêu cầu về kỹ năng, kinh nghiệm, công cụ...',
    placeholderSalary: 'Ví dụ: 15000000',
    placeholderIndustry: 'Ví dụ: Công nghệ thông tin',
    placeholderPhone: 'Ví dụ: 0901234567',
    placeholderWorkingHours: 'Ví dụ: Thứ 2 - Thứ 6, 18:00 - 22:00',
    selectJobType: 'Chọn loại công việc',
    selectDepartment: 'Chọn phòng ban',
    selectProvince: 'Chọn tỉnh thành',
    selectDistrict: 'Chọn quận huyện',
    selectExperience: 'Chọn kinh nghiệm',
    selectLevel: 'Chọn cấp bậc',
    selectProvinceFirst: 'Chọn tỉnh thành trước',
    btnBack: 'Quay lại',
    btnSubmit: 'Lưu vào database',
    loginRequired: 'Vui lòng đăng nhập bằng tài khoản nhà tuyển dụng để đăng tin.',
    successMessage: 'Đã lưu tin tuyển dụng vào MongoDB Atlas.',
    errorMessage: 'Không thể lưu tin tuyển dụng. Vui lòng kiểm tra đăng nhập và dữ liệu.',
  },
  en: {
    pageTitle: 'Post New Job',
    sectionBasic: 'Basic Information',
    sectionDetail: 'Job Details',
    sectionContact: 'Contact Information',
    labelTitle: 'Job title',
    labelDesc: 'Job description',
    labelRequirements: 'Requirements',
    labelType: 'Job type',
    labelMinSalary: 'Minimum salary',
    labelMaxSalary: 'Maximum salary',
    labelIndustry: 'Industry',
    labelDepartment: 'Department',
    labelProvince: 'Province',
    labelDistrict: 'District',
    labelExperience: 'Experience',
    labelLevel: 'Level',
    labelDeadline: 'Application deadline',
    labelPhone: 'Contact phone',
    labelWorkingHours: 'Working hours',
    placeholderTitle: 'Ex: Frontend Developer',
    placeholderDesc: 'Describe the role, benefits, responsibilities...',
    placeholderRequirements: 'List skills, tooling and requirements...',
    placeholderSalary: 'Ex: 15000000',
    placeholderIndustry: 'Ex: Information Technology',
    placeholderPhone: 'Ex: 0901234567',
    placeholderWorkingHours: 'Ex: Mon - Fri, 18:00 - 22:00',
    selectJobType: 'Select job type',
    selectDepartment: 'Select department',
    selectProvince: 'Select province',
    selectDistrict: 'Select district',
    selectExperience: 'Select experience',
    selectLevel: 'Select level',
    selectProvinceFirst: 'Select province first',
    btnBack: 'Back',
    btnSubmit: 'Save to database',
    loginRequired: 'Please sign in as an employer to post a job.',
    successMessage: 'Job was saved to MongoDB Atlas.',
    errorMessage: 'Unable to save this job. Please check login and input data.',
  },
};

const departmentOptions = [
  'Engineering',
  'Product',
  'Design',
  'Data',
  'Marketing',
  'Sales',
  'Human Resources',
  'Operations',
];

const districtsByProvince = {
  'TP.HCM': ['Quận 1', 'Quận 3', 'Quận 7', 'Quận Bình Thạnh', 'Quận Tân Bình', 'Quận Phú Nhuận'],
  'Hà Nội': ['Ba Đình', 'Hoàn Kiếm', 'Hai Bà Trưng', 'Đống Đa', 'Tây Hồ', 'Cầu Giấy'],
  'Đà Nẵng': ['Hải Châu', 'Thanh Khê', 'Sơn Trà', 'Ngũ Hành Sơn', 'Liên Chiểu', 'Cẩm Lệ'],
  'Cần Thơ': ['Ninh Kiều', 'Bình Thủy', 'Cái Răng', 'Ô Môn', 'Thốt Nốt'],
  'Hải Phòng': ['Hồng Bàng', 'Ngô Quyền', 'Lê Chân', 'Hải An', 'Kiến An'],
  'Biên Hòa': ['Trung Dũng', 'Quyết Thắng', 'Thống Nhất', 'Tân Hòa', 'Tân Hiệp'],
};

const experienceOptions = [
  'không yêu cầu',
  'dưới 1 năm',
  '1 năm',
  '2 năm',
  '3 năm',
  '4 năm',
  '4 năm trở lên',
];

const levelOptions = JOB_LEVEL_OPTIONS;

const createEmptyForm = () => ({
  title: '',
  description: '',
  requirements: '',
  job_type: '',
  min_salary: '',
  max_salary: '',
  industry: '',
  department: '',
  province: '',
  district: '',
  experience: '',
  level: '',
  deadline: '',
  phone: '',
  workingHours: '',
});

const sanitizeSalary = (value) => value.replace(/[^\d]/g, '');

function NewJob({ language = 'vi' }) {
  const [form, setForm] = useState(createEmptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState({ type: '', text: '' });
  const navigate = useNavigate();
  const { api, user } = useContext(AuthContext);

  const t = translations[language] || translations.vi;

  const onChange = (event) => {
    const { name, value } = event.target;

    if (name === 'province') {
      setForm((prev) => ({ ...prev, province: value, district: '' }));
      return;
    }

    if (name === 'min_salary' || name === 'max_salary') {
      setForm((prev) => ({ ...prev, [name]: sanitizeSalary(value) }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setNotice({ type: '', text: '' });

    if (!user || user.type !== 'employer') {
      setNotice({ type: 'error', text: t.loginRequired });
      setSubmitting(false);
      return;
    }

    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        requirements: form.requirements.trim(),
        job_type: form.job_type,
        min_salary: form.min_salary.trim(),
        max_salary: form.max_salary.trim(),
        industry: form.industry.trim(),
        department: form.department.trim(),
        location: [form.district, form.province].filter(Boolean).join(', '),
        experience: form.experience,
        level: form.level || undefined,
        deadline: form.deadline,
        phone: form.phone.trim() || undefined,
        workingHours: form.workingHours.trim() || undefined,
        status: 'draft',
      };

      await api.post('jobs', payload);
      setNotice({ type: 'success', text: t.successMessage });
      setForm(createEmptyForm());
      setTimeout(() => navigate('/NTDJobManagement'), 800);
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        t.errorMessage;

      setNotice({
        type: 'error',
        text: Array.isArray(message) ? message.join(', ') : String(message),
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={cx('newjob')}>
      <h1 className={cx('newjob__title')}>{t.pageTitle}</h1>

      <form className={cx('newjob__form')} onSubmit={onSubmit}>
        {notice.text ? (
          <div className={cx('newjob__notice', `newjob__notice--${notice.type}`)}>
            {notice.text}
          </div>
        ) : null}

        <section className={cx('newjob__card')}>
          <h2 className={cx('newjob__card-title')}>{t.sectionBasic}</h2>

          <div className={cx('newjob__field')}>
            <label className={cx('newjob__label')}>
              {t.labelTitle} <span className={cx('newjob__req')}>*</span>
            </label>
            <input
              className={cx('newjob__input')}
              name="title"
              placeholder={t.placeholderTitle}
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
              placeholder={t.placeholderDesc}
              value={form.description}
              onChange={onChange}
              required
            />
          </div>

          <div className={cx('newjob__field')}>
            <label className={cx('newjob__label')}>{t.labelRequirements}</label>
            <textarea
              className={cx('newjob__textarea')}
              rows={5}
              name="requirements"
              placeholder={t.placeholderRequirements}
              value={form.requirements}
              onChange={onChange}
            />
          </div>
        </section>

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
                  <option value="">{t.selectJobType}</option>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="internship">Internship</option>
                </select>
                <span className={cx('newjob__select-caret')}>▾</span>
              </div>
            </div>

            <div className={cx('newjob__field')}>
              <label className={cx('newjob__label')}>
                {t.labelIndustry} <span className={cx('newjob__req')}>*</span>
              </label>
              <input
                className={cx('newjob__input')}
                name="industry"
                placeholder={t.placeholderIndustry}
                value={form.industry}
                onChange={onChange}
                required
              />
            </div>

            <div className={cx('newjob__field')}>
              <label className={cx('newjob__label')}>
                {t.labelDepartment} <span className={cx('newjob__req')}>*</span>
              </label>
              <div className={cx('newjob__select')}>
                <select
                  className={cx('newjob__select-native')}
                  name="department"
                  value={form.department}
                  onChange={onChange}
                  required
                >
                  <option value="">{t.selectDepartment}</option>
                  {departmentOptions.map((department) => (
                    <option key={department} value={department}>
                      {department}
                    </option>
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
                  <option value="">{t.selectExperience}</option>
                  {experienceOptions.map((experience) => (
                    <option key={experience} value={experience}>
                      {experience}
                    </option>
                  ))}
                </select>
                <span className={cx('newjob__select-caret')}>▾</span>
              </div>
            </div>

            <div className={cx('newjob__field')}>
              <label className={cx('newjob__label')}>
                {t.labelMinSalary} <span className={cx('newjob__req')}>*</span>
              </label>
              <input
                className={cx('newjob__input')}
                name="min_salary"
                placeholder={t.placeholderSalary}
                value={form.min_salary}
                onChange={onChange}
                required
              />
            </div>

            <div className={cx('newjob__field')}>
              <label className={cx('newjob__label')}>
                {t.labelMaxSalary} <span className={cx('newjob__req')}>*</span>
              </label>
              <input
                className={cx('newjob__input')}
                name="max_salary"
                placeholder={t.placeholderSalary}
                value={form.max_salary}
                onChange={onChange}
                required
              />
            </div>

            <div className={cx('newjob__field')}>
              <label className={cx('newjob__label')}>
                {t.labelProvince} <span className={cx('newjob__req')}>*</span>
              </label>
              <div className={cx('newjob__select')}>
                <select
                  className={cx('newjob__select-native')}
                  name="province"
                  value={form.province}
                  onChange={onChange}
                  required
                >
                  <option value="">{t.selectProvince}</option>
                  {Object.keys(districtsByProvince).map((province) => (
                    <option key={province} value={province}>
                      {province}
                    </option>
                  ))}
                </select>
                <span className={cx('newjob__select-caret')}>▾</span>
              </div>
            </div>

            <div className={cx('newjob__field')}>
              <label className={cx('newjob__label')}>
                {t.labelDistrict} <span className={cx('newjob__req')}>*</span>
              </label>
              <div className={cx('newjob__select')}>
                <select
                  className={cx('newjob__select-native')}
                  name="district"
                  value={form.district}
                  onChange={onChange}
                  disabled={!form.province}
                  required
                >
                  <option value="">
                    {form.province ? t.selectDistrict : t.selectProvinceFirst}
                  </option>
                  {(districtsByProvince[form.province] || []).map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
                <span className={cx('newjob__select-caret')}>▾</span>
              </div>
            </div>

            <div className={cx('newjob__field')}>
              <label className={cx('newjob__label')}>{t.labelLevel}</label>
              <div className={cx('newjob__select')}>
                <select
                  className={cx('newjob__select-native')}
                  name="level"
                  value={form.level}
                  onChange={onChange}
                >
                  <option value="">{t.selectLevel}</option>
                  {levelOptions.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
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

        <section className={cx('newjob__card')}>
          <h2 className={cx('newjob__card-title')}>{t.sectionContact}</h2>

          <div className={cx('newjob__grid', 'newjob__grid--2')}>
            <div className={cx('newjob__field')}>
              <label className={cx('newjob__label')} htmlFor="phone">
                {t.labelPhone}
              </label>
              <input
                id="phone"
                className={cx('newjob__input')}
                name="phone"
                placeholder={t.placeholderPhone}
                value={form.phone}
                onChange={onChange}
              />
            </div>

            <div className={cx('newjob__field')}>
              <label className={cx('newjob__label')} htmlFor="workingHours">
                {t.labelWorkingHours}
              </label>
              <input
                id="workingHours"
                className={cx('newjob__input')}
                name="workingHours"
                placeholder={t.placeholderWorkingHours}
                value={form.workingHours}
                onChange={onChange}
              />
            </div>
          </div>
        </section>

        <div className={cx('newjob__actions')}>
          <button
            type="button"
            className={cx('newjob__btn', 'newjob__btn--back')}
            onClick={() => navigate(-1)}
          >
            {t.btnBack}
          </button>
          <button
            className={cx('newjob__btn', 'newjob__btn--save')}
            type="submit"
            disabled={submitting}
          >
            {submitting ? 'Saving...' : t.btnSubmit}
          </button>
        </div>
      </form>
    </div>
  );
}

export default NewJob;
