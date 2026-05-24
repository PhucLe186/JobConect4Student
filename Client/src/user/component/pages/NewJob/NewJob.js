import React, { useContext, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './NewJob.module.scss';
import { AuthContext } from '~/context/AuthContext';

const cx = classNames.bind(styles);

const translations = {
  vi: {
    pageTitle: 'Đăng tin tuyển dụng mới',
    editPageTitle: 'Chỉnh sửa tin tuyển dụng',
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
    btnSubmit: 'Đăng bài',
    btnEditSubmit: 'Lưu thay đổi',
    loginRequired: 'Vui lòng đăng nhập bằng tài khoản nhà tuyển dụng để đăng tin.',
    successMessage: 'Đã lưu tin tuyển dụng vào MongoDB Atlas.',
    errorMessage: 'Không thể lưu tin tuyển dụng. Vui lòng kiểm tra đăng nhập và dữ liệu.',
  },
  en: {
    pageTitle: 'Post New Job',
    editPageTitle: 'Edit Job Posting',
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
    btnEditSubmit: 'Update job',
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
  'Hồ Chí Minh': ['Quận 1', 'Quận 3', 'Quận 7', 'Quận Bình Thạnh', 'Quận Tân Bình', 'Quận Phú Nhuận'],
  'Hà Nội': ['Quận Ba Đình', 'Quận Hoàn Kiếm', 'Quận Hai Bà Trưng', 'Quận Đống Đa', 'Quận Tây Hồ', 'Quận Cầu Giấy'],
  'Đà Nẵng': ['Quận Hải Châu', 'Quận Thanh Khê', 'Quận Sơn Trà', 'Quận Ngũ Hành Sơn', 'Quận Liên Chiểu', 'Quận Cẩm Lệ'],
  'Cần Thơ': ['Quận Ninh Kiều', 'Quận Bình Thủy', 'Quận Cái Răng', 'Quận Ô Môn', 'Quận Thốt Nốt'],
  'Hải Phòng': ['Quận Hồng Bàng', 'Quận Ngô Quyền', 'Quận Lê Chân', 'Quận Hải An', 'Quận Kiến An'],
  'Biên Hòa': ['Phường Trung Dũng', 'Phường Quyết Thắng', 'Phường Thống Nhất', 'Phường Tân Hòa', 'Phường Tân Hiệp'],
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

const levelOptions = [
  'Intern',
  'Fresher',
  'Junior',
  'Middle',
  'Senior',
];

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
  status: 'draft',
  min_gpa: '',
});

const sanitizeSalary = (value) => value.replace(/[^\d]/g, '');

function NewJob({ language = 'vi' }) {
  const { id } = useParams();
  const isEditMode = !!id;

  const [form, setForm] = useState(createEmptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState({ type: '', text: '' });
  const [allSkills, setAllSkills] = useState([]);
  const [selectedSkillIds, setSelectedSkillIds] = useState([]);
  const navigate = useNavigate();
  const { api, user } = useContext(AuthContext);

  const t = translations[language] || translations.vi;

  // Load danh sách skills khi mount
  React.useEffect(() => {
    api.get('skills').then((res) => setAllSkills(res.data || [])).catch(() => { });
  }, [api]);

  // Load chi tiết tin tuyển dụng nếu là chế độ edit
  React.useEffect(() => {
    if (isEditMode) {
      api.get(`jobs/${id}`)
        .then((res) => {
          const jobData = res.data;
          if (jobData) {
            // Phân tách location thành quận huyện và tỉnh thành
            const parts = (jobData.location || '').split(', ');
            let district = '';
            let province = '';
            if (parts.length >= 2) {
              district = parts[0].trim();
              province = parts[1].trim();
            } else if (parts.length === 1) {
              province = parts[0].trim();
            }

            // Định dạng deadline thành YYYY-MM-DD
            const dateObj = new Date(jobData.deadline);
            const formattedDeadline = !isNaN(dateObj.getTime())
              ? dateObj.toISOString().split('T')[0]
              : '';

            setForm({
              title: jobData.title || '',
              description: jobData.description || '',
              requirements: jobData.requirements || '',
              job_type: jobData.job_type || '',
              min_salary: String(jobData.min_salary || ''),
              max_salary: String(jobData.max_salary || ''),
              industry: jobData.industry || '',
              department: jobData.department || '',
              province: province,
              district: district,
              experience: jobData.experience || '',
              level: jobData.level || '',
              deadline: formattedDeadline,
              phone: jobData.phone || '',
              workingHours: jobData.workingHours || '',
              status: jobData.status || 'draft',
              min_gpa: jobData.min_gpa !== undefined ? String(jobData.min_gpa) : '',
            });

            if (jobData.skillIds) {
              setSelectedSkillIds(jobData.skillIds);
            }
          }
        })
        .catch((err) => {
          console.error(err);
          setNotice({
            type: 'error',
            text: language === 'vi' ? 'Không thể tải chi tiết tin đăng.' : 'Failed to load job details.',
          });
        });
    }
  }, [api, id, isEditMode, language]);

  const toggleSkill = (id) => {
    setSelectedSkillIds((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

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
        status: form.status || 'draft',
        skillIds: selectedSkillIds,
        min_gpa: form.min_gpa ? Number(form.min_gpa) : 0,
      };

      if (isEditMode) {
        await api.put(`jobs/${id}`, payload);
        setNotice({
          type: 'success',
          text: language === 'vi' ? 'Đã cập nhật tin tuyển dụng thành công.' : 'Job posting updated successfully.',
        });
      } else {
        await api.post('jobs', payload);
        setNotice({ type: 'success', text: t.successMessage });
      }
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
      <h1 className={cx('newjob__title')}>{isEditMode ? t.editPageTitle : t.pageTitle}</h1>

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

          <div className={cx('newjob__field')}>
            <label className={cx('newjob__label')}>
              {language === 'vi' ? 'Kỹ năng yêu cầu' : 'Required Skills'}
              <span style={{ color: '#888', fontWeight: 400, marginLeft: 6, fontSize: '0.85em' }}>
                ({language === 'vi' ? 'Dùng để AI chấm điểm CV' : 'Used for AI CV scoring'})
              </span>
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: 8 }}>
              {allSkills.map((skill) => (
                <label
                  key={skill._id}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '6px 14px', borderRadius: 999, cursor: 'pointer',
                    border: selectedSkillIds.includes(skill._id)
                      ? '2px solid #1259c3' : '1px solid #d9e3f0',
                    background: selectedSkillIds.includes(skill._id)
                      ? '#eaf2ff' : '#f7faff',
                    color: selectedSkillIds.includes(skill._id) ? '#1259c3' : '#5f6f85',
                    fontWeight: selectedSkillIds.includes(skill._id) ? 700 : 400,
                    fontSize: '0.9rem',
                    transition: 'all 0.15s',
                  }}
                >
                  <input
                    type="checkbox"
                    style={{ display: 'none' }}
                    checked={selectedSkillIds.includes(skill._id)}
                    onChange={() => toggleSkill(skill._id)}
                  />
                  {skill.name}
                </label>
              ))}
              {allSkills.length === 0 && (
                <span style={{ color: '#888', fontSize: '0.9rem' }}>
                  {language === 'vi' ? 'Đang tải danh sách kỹ năng...' : 'Loading skills...'}
                </span>
              )}
            </div>
            {selectedSkillIds.length > 0 && (
              <div style={{ marginTop: 8, fontSize: '0.85rem', color: '#1259c3' }}>
                {language === 'vi' ? 'Đã chọn' : 'Selected'}: {selectedSkillIds.length} {language === 'vi' ? 'kỹ năng' : 'skills'}
              </div>
            )}
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
                value={form.min_salary ? Number(form.min_salary).toLocaleString('vi-VN') : ''}
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
                value={form.max_salary ? Number(form.max_salary).toLocaleString('vi-VN') : ''}
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
                {language === 'vi' ? 'GPA tối thiểu' : 'Minimum GPA'}
              </label>
              <input
                className={cx('newjob__input')}
                type="number"
                step="0.01"
                min="0"
                max="4"
                name="min_gpa"
                placeholder={language === 'vi' ? 'Ví dụ: 2.5' : 'Ex: 2.5'}
                value={form.min_gpa}
                onChange={onChange}
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
            {submitting ? (isEditMode ? 'Updating...' : 'Saving...') : (isEditMode ? t.btnEditSubmit : t.btnSubmit)}
          </button>
        </div>
      </form>
    </div>
  );
}

export default NewJob;
