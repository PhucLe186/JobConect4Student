import React, { useCallback, useContext, useEffect, useState } from 'react';
import styles from './Home.module.scss';
import classNames from 'classnames/bind';
import trans__home from '../../../../component/Translation/NTDProfile';
import { AuthContext } from '~/context/AuthContext';

const cx = classNames.bind(styles);

const EMPTY_PROFILE = {
  company_name: '',
  size: '',
  description: '',
  address: '',
  email: '',
  website: '',
  logo: '',
};

const mapProfileToForm = (profile) => ({
  ...EMPTY_PROFILE,
  ...(profile || {}),
  size:
    profile?.size === null || profile?.size === undefined
      ? ''
      : String(profile.size),
});

const getFormValue = (formData, field) => String(formData.get(field) || '').trim();

function NTDProfile({ language = 'vi' }) {
  const { api, user, language: contextLanguage } = useContext(AuthContext);
  const currentLanguage = contextLanguage || language;
  const t = trans__home[currentLanguage] || trans__home.vi;
  const [profileData, setProfileData] = useState(EMPTY_PROFILE);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchProfile = useCallback(async () => {
    if (!user || user.type !== 'employer') {
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const response = await api.get('employer/profile');
      setProfileData(mapProfileToForm(response.data));
      setMessage({ type: '', text: '' });
    } catch (error) {
      console.error('Failed to load employer profile:', error);
      setMessage({
        type: 'error',
        text: error.response?.data?.message || t.loadError,
      });
    } finally {
      setLoading(false);
    }
  }, [api, t.loadError, user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleFieldChange = (field) => (event) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));

    if (message.text) {
      setMessage({ type: '', text: '' });
    }
  };

  const handleLogoChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: t.logoTooLarge });
      event.target.value = '';
      return;
    }

    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
    ];

    if (!allowedTypes.includes(file.type)) {
      setMessage({ type: 'error', text: t.invalidLogoFile });
      event.target.value = '';
      return;
    }

    const previousLogo = profileData.logo;
    setUploadingLogo(true);

    try {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        setProfileData((prev) => ({
          ...prev,
          logo: loadEvent.target?.result || prev.logo,
        }));
      };
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append('logo', file);

      const response = await api.post('employer/upload-logo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setProfileData((prev) => ({
        ...prev,
        logo: response.data?.logoUrl || prev.logo,
      }));
      setMessage({
        type: 'success',
        text: response.data?.message || t.uploadLogoSuccess,
      });
    } catch (error) {
      console.error('Failed to upload employer logo:', error);
      setProfileData((prev) => ({
        ...prev,
        logo: previousLogo,
      }));
      setMessage({
        type: 'error',
        text: error.response?.data?.message || t.uploadLogoError,
      });
    } finally {
      setUploadingLogo(false);
      event.target.value = '';
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = {
      company_name: getFormValue(formData, 'company_name'),
      size: getFormValue(formData, 'size'),
      description: getFormValue(formData, 'description'),
      address: getFormValue(formData, 'address'),
      email: getFormValue(formData, 'email'),
      website: getFormValue(formData, 'website'),
      logo: profileData.logo.trim(),
    };

    setProfileData((prev) => ({
      ...prev,
      ...payload,
    }));

    if (!payload.company_name) {
      setMessage({ type: 'error', text: t.requiredCompanyName });
      return;
    }

    setSaving(true);

    try {
      const response = await api.post('employer', payload);
      setProfileData(mapProfileToForm(response.data?.employer));
      setMessage({
        type: 'success',
        text: response.data?.message || t.saveSuccess,
      });
    } catch (error) {
      console.error('Failed to save employer profile:', error);
      setMessage({
        type: 'error',
        text: error.response?.data?.message || t.saveError,
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={cx('company')}>
        <h1 className={cx('company__title')}>{t.pageTitle}</h1>
        <p className={cx('company__status')}>{t.loadingText}</p>
      </div>
    );
  }

  if (!user || user.type !== 'employer') {
    return (
      <div className={cx('company')}>
        <h1 className={cx('company__title')}>{t.pageTitle}</h1>
        <p className={cx('company__status', 'company__status--error')}>
          {t.loginRequired}
        </p>
      </div>
    );
  }

  return (
    <form className={cx('company')} onSubmit={handleSubmit}>
      <h1 className={cx('company__title')}>{t.pageTitle}</h1>

      {message.text && (
        <p
          className={cx('company__status', {
            'company__status--error': message.type === 'error',
            'company__status--success': message.type === 'success',
          })}
        >
          {message.text}
        </p>
      )}

      <section className={cx('company__section')}>
        <div className={cx('company__section-header')}>
          <span className={cx('company__section-icon')} aria-hidden>
            🏠
          </span>
          <h2 className={cx('company__section-title')}>{t.sectionInfo}</h2>
        </div>

        <div className={cx('company__body')}>
          <div className={cx('company__row', 'company__row--gap-lg')}>
            <div className={cx('company__avatar')}>
              <div className={cx('company__avatar-stack')}>
                <img
                  className={cx('company__avatar-img')}
                  src={profileData.logo || 'https://placehold.co/120x120'}
                  alt={t.avatarAlt}
                />
                <label
                  htmlFor="company-logo"
                  className={cx('company__avatar-upload')}
                >
                  {uploadingLogo
                    ? t.uploadingLogo
                    : profileData.logo
                      ? t.changeLogo
                      : t.uploadLogo}
                </label>
                <input
                  id="company-logo"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  className={cx('company__avatar-input')}
                  onChange={handleLogoChange}
                  disabled={uploadingLogo}
                />
              </div>
            </div>

            <div className={cx('company__col', 'company__col--grow')}>
              <div className={cx('company__field')}>
                <label className={cx('company__label')} htmlFor="company_name">
                  {t.companyName}
                </label>
                <input
                  id="company_name"
                  name="company_name"
                  className={cx('company__input')}
                  placeholder={t.ph_companyName}
                  value={profileData.company_name}
                  onChange={handleFieldChange('company_name')}
                />
              </div>

              <div className={cx('company__grid', 'company__grid--2')}>
                <div className={cx('company__field')}>
                  <label className={cx('company__label')} htmlFor="size">
                    {t.companySize}
                  </label>
                  <input
                    id="size"
                    name="size"
                    type="number"
                    min="0"
                    className={cx('company__input')}
                    placeholder={t.ph_companySize}
                    value={profileData.size}
                    onChange={handleFieldChange('size')}
                  />
                </div>
              </div>

              <div className={cx('company__field')}>
                <label className={cx('company__label')} htmlFor="description">
                  {t.description}
                </label>
                <textarea
                  id="description"
                  name="description"
                  className={cx('company__textarea')}
                  placeholder={t.ph_description}
                  rows={6}
                  value={profileData.description}
                  onChange={handleFieldChange('description')}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={cx('company__section')}>
        <div className={cx('company__section-header')}>
          <span className={cx('company__section-icon')} aria-hidden>
            📍
          </span>
          <h2 className={cx('company__section-title')}>{t.sectionContact}</h2>
        </div>

        <div className={cx('company__body')}>
          <div className={cx('company__field')}>
            <label className={cx('company__label')} htmlFor="address">
              {t.address}
            </label>
            <input
              id="address"
              name="address"
              className={cx('company__input')}
              placeholder={t.ph_address}
              value={profileData.address}
              onChange={handleFieldChange('address')}
            />
          </div>
          <div className={cx('company__field')}>
            <label className={cx('company__label')} htmlFor="email">
              {t.email}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className={cx('company__input')}
              placeholder={t.ph_email}
              value={profileData.email}
              onChange={handleFieldChange('email')}
            />
          </div>
          <div className={cx('company__field')}>
            <label className={cx('company__label')} htmlFor="website">
              {t.website}
            </label>
            <input
              id="website"
              name="website"
              className={cx('company__input')}
              placeholder={t.ph_website}
              value={profileData.website}
              onChange={handleFieldChange('website')}
            />
          </div>
        </div>
      </section>

      <div className={cx('company__footer')}>
        <button
          className={cx('company__btn', 'company__btn--primary')}
          type="submit"
          disabled={saving}
        >
          {saving ? t.savingText : t.saveBtn}
        </button>
      </div>
    </form>
  );
}

export default NTDProfile;
