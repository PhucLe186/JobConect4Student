import React from 'react';
import styles from './Home.module.scss';
import classNames from 'classnames/bind';

//Import file dịch
import trans__home from "../../../../component/Translation/NTDProfile";

const cx = classNames.bind(styles);

function NTDProfile({ language = 'vi' }) {
  
  // 2. Lấy ngôn ngữ
  const t = trans__home[language];

  return (
    <div className={cx('company')}>
      <h1 className={cx('company__title')}>{t.pageTitle}</h1>
      
      {/* --- Section 1: Thông tin công ty --- */}
      <section className={cx('company__section')}>
        <div className={cx('company__section-header')}>
          <span className={cx('company__section-icon')} aria-hidden>🏠</span>
          <h2 className={cx('company__section-title')}>{t.sectionInfo}</h2>
        </div>

        <div className={cx('company__body')}>
          <div className={cx('company__row', 'company__row--gap-lg')}>
            <div className={cx('company__avatar')}>
              <img
                className={cx('company__avatar-img')}
                src="https://placehold.co/120x120"
                alt={t.avatarAlt} 
              />
            </div>

            <div className={cx('company__col', 'company__col--grow')}>
              <div className={cx('company__field')}>
                <label className={cx('company__label')}>{t.companyName}</label>
                <input 
                    className={cx('company__input')} 
                    placeholder={t.ph_companyName} 
                />
              </div>

              <div className={cx('company__grid', 'company__grid--2')}>
                <div className={cx('company__field')}>
                  <label className={cx('company__label')}>{t.companySize}</label>
                  <input 
                    className={cx('company__input')} 
                    placeholder={t.ph_companySize} 
                  />
                </div>
              </div>

              <div className={cx('company__field')}>
                <label className={cx('company__label')}>{t.description}</label>
                <textarea
                  className={cx('company__textarea')}
                  placeholder={t.ph_description}
                  rows={6}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/*Thông tin liên hệ*/}
      <section className={cx('company__section')}>
        <div className={cx('company__section-header')}>
          <span className={cx('company__section-icon')} aria-hidden>📍</span>
          <h2 className={cx('company__section-title')}>{t.sectionContact}</h2>
        </div>

        <div className={cx('company__body')}>
          <div className={cx('company__field')}>
            <label className={cx('company__label')}>{t.address}</label>
            <input 
                className={cx('company__input')} 
                placeholder={t.ph_address} 
            />
          </div>
          <div className={cx('company__field')}>
            <label className={cx('company__label')}>{t.email}</label>
            <input 
                className={cx('company__input')} 
                placeholder={t.ph_email} 
            />
          </div>
          <div className={cx('company__field')}>
            <label className={cx('company__label')}>{t.website}</label>
            <input 
                className={cx('company__input')} 
                placeholder={t.ph_website} 
            />
          </div>
        </div>
      </section>

      <div className={cx('company__footer')}>
        <button className={cx('company__btn', 'company__btn--primary')}>
          {t.saveBtn}
        </button>
      </div>
    </div>
  );
}

export default NTDProfile;