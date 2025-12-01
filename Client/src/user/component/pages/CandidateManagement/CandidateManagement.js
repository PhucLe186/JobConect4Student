import React, { useState, useMemo, useEffect, useContext } from 'react';
import styles from './CandidateManagement.module.scss';
import classNames from 'classnames/bind';
import translations from '~/component/Translation';
import { AuthContext } from '~/context/AuthContext';
import { dashboardAPI } from '~/services/api';

const cx = classNames.bind(styles);



// 2. Thêm prop language
function CandidateManagement() {
  const {language}= useContext(AuthContext)
  const [query, setQuery] = useState('');
  const [selectedMajor, setSelectedMajor] = useState('all');
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const t = translations[language];

  useEffect(() => {
    fetchCandidates();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const users = await dashboardAPI.getAllUsers();
      const students = users.filter(user => user.role === 'student');
      setCandidates(students);
    } catch (error) {
      console.error('Error fetching candidates:', error);
    } finally {
      setLoading(false);
    }
  };

  const majors = useMemo(() => {
    const allMajors = candidates.map((c) => c.major).filter(Boolean);
    return ['all', ...new Set(allMajors)];
  }, [candidates]);

  const filtered = candidates.filter((c) => {
    const matchQuery =
      c.name?.toLowerCase().includes(query.toLowerCase()) ||
      c.email?.toLowerCase().includes(query.toLowerCase());

    const matchMajor = selectedMajor === 'all' || c.major === selectedMajor;

    return matchQuery && matchMajor;
  });

  if (loading) {
    return <div className={cx('loading')}>Đang tải...</div>;
  }

  return (
    <div className={cx('cands')}>
      <h1 className={cx('cands__title')}>{t.pageTitle}</h1>

      <section className={cx('cands__panel')}>
        <h2 className={cx('cands__panel-title')}>{t.panelTitle}</h2>

        <div className={cx('cands__controls')}>
          <div className={cx('cands__search')}>
            <span className={cx('cands__search-icon')} aria-hidden>
              🔍
            </span>
            <input
              className={cx('cands__search-input')}
              placeholder={t.searchPlaceholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className={cx('cands__filters')}>
            <div className={cx('cands__select')}>
              <select
                className={cx('cands__select-native')}
                value={selectedMajor}
                onChange={(e) => setSelectedMajor(e.target.value)}
              >
                <option value="all">{t.filterAllMajors}</option>
                {majors.map((m) => (
                  m !== 'all' && (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  )
                ))}
              </select>
              <span className={cx('cands__select-caret')}>▾</span>
            </div>

            <button className={cx('cands__filter-btn')} title={t.filterTooltip}>
              🧰
            </button>
          </div>
        </div>
      </section>

      <div className={cx('cands__list')}>
        {filtered.map((c) => (
          <article key={c._id} className={cx('cand-card')}>
            <header className={cx('cand-card__header')}>
              <img
                className={cx('cand-card__avatar')}
                src={c.avatar || 'https://placehold.co/56x56'}
                alt={c.name}
              />
              <div className={cx('cand-card__headings')}>
                <div className={cx('cand-card__name')}>{c.name}</div>
                <div className={cx('cand-card__role')}>
                  {c.major || 'Chưa cập nhật'}
                </div>
              </div>
            </header>

            <ul className={cx('cand-card__info')}>
              {/* Phone */}
              <li className={cx('cand-card__info-item')}>
                <span className={cx('cand-card__icon')} title="Email">✉️</span>
                {c.email}
              </li>
              <li className={cx('cand-card__info-item')}>
                <span className={cx('cand-card__icon')} title={t.tooltipPhone}>📞</span>
                {c.phone || 'Chưa cập nhật'}
              </li>
              
              {/* Address */}
              <li className={cx('cand-card__info-item')}>
                <span className={cx('cand-card__icon')} title={t.tooltipAddress}>📍</span>
                {c.address || 'Chưa cập nhật'}
              </li>

              {/* School */}
              <li className={cx('cand-card__info-item')}>
                <span className={cx('cand-card__icon')} title={t.tooltipSchool}>🎓</span>
                {c.school || 'Chưa cập nhật'}
              </li>

              {/* Graduation Year */}
              {c.graduation_year && (
                <li className={cx('cand-card__info-item')}>
                  <span className={cx('cand-card__icon')} title={t.tooltipGradYear}>🗓️</span>
                  Năm tốt nghiệp: {c.graduation_year}
                </li>
              )}

               {/* GPA */}
               {c.gpa && (
                 <li className={cx('cand-card__info-item')}>
                  <span className={cx('cand-card__icon')} title={t.tooltipGPA}>📊</span>
                  GPA: <strong>{c.gpa}</strong>
                </li>
               )}

              {/* Salary */}
              {c.desired_salary && (
                <li className={cx('cand-card__info-item')}>
                  <span className={cx('cand-card__icon')} title={t.tooltipSalary}>💰</span>
                  {c.desired_salary} VNĐ
                </li>
              )}
              <li className={cx('cand-card__info-item')}>
                <span className={cx('cand-card__icon')} title="Trạng thái">🔴</span>
                <span className={cx('status', c.status === 'online' ? 'online' : 'offline')}>
                  {c.status === 'online' ? 'Online' : 'Offline'}
                </span>
              </li>
            </ul>

            {/* Career Goal */}
            {c.career_goal && (
              <div className={cx('cand-card__goal-section')}>
                <div className={cx('cand-card__goal-label')}>🎯 Mục tiêu:</div>
                <div className={cx('cand-card__goal-text')}>
                   {c.career_goal}
                </div>
              </div>
            )}
          </article>
        ))}
        
        {filtered.length === 0 && (
             <div style={{textAlign: 'center', color: '#888', padding: '20px'}}>
                 {t.noResult}
             </div>
        )}
      </div>
    </div>
  );
}

export default CandidateManagement;