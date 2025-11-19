import React, { useState, useMemo } from 'react';
import styles from './CandidateManagement.module.scss';
import classNames from 'classnames/bind';

// 1. Import file dịch
import trans__candidateManagement from "../../../../component/Translation/CandidateManagement"

const cx = classNames.bind(styles);

const MOCK_CANDIDATES = [
  {
    id: 1,
    name: 'Nguyễn Văn A',
    avatar: 'https://placehold.co/56x56',
    phone: '0901234567',
    address: 'TP.HCM',
    school: 'Đại học Bách Khoa',
    major: 'Kỹ thuật phần mềm',
    gpa: 3.6,
    graduation_year: 2024,
    career_goal: 'Trở thành Fullstack Developer chuyên nghiệp trong 2 năm tới.',
    desired_salary: '15.000.000 VNĐ',
  },
  {
    id: 2,
    name: 'Trần Thị B',
    avatar: 'https://placehold.co/56x56',
    phone: '0912345678',
    address: 'Hà Nội', // Giữ nguyên không dịch
    school: 'Đại học Công Nghệ',
    major: 'Khoa học máy tính',
    gpa: 3.8,
    graduation_year: 2025,
    career_goal: 'Phát triển sâu về AI và Machine Learning.',
    desired_salary: '20.000.000 VNĐ',
  },
  {
    id: 3,
    name: 'Lê Văn C',
    avatar: 'https://placehold.co/56x56',
    phone: '0987654321',
    address: 'Đà Nẵng', // Giữ nguyên không dịch
    school: 'Đại học Bách Khoa Đà Nẵng',
    major: 'Hệ thống thông tin',
    gpa: 3.2,
    graduation_year: 2023,
    career_goal: 'Mong muốn làm việc trong môi trường quốc tế, sử dụng tiếng Anh.',
    desired_salary: '12.000.000 VNĐ',
  },
];

// 2. Thêm prop language
function CandidateManagement({ language = 'vi' }) {
  const [query, setQuery] = useState('');
  const [selectedMajor, setSelectedMajor] = useState('all');

  // 3. Lấy từ điển
  const t = trans__candidateManagement[language];

  // Lấy danh sách các chuyên ngành (Major) để làm bộ lọc
  const majors = useMemo(() => {
    const allMajors = MOCK_CANDIDATES.map((c) => c.major);
    return ['all', ...new Set(allMajors)];
  }, []);

  // Xử lý lọc dữ liệu
  const filtered = MOCK_CANDIDATES.filter((c) => {
    const matchQuery =
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.school.toLowerCase().includes(query.toLowerCase());

    const matchMajor = selectedMajor === 'all' || c.major === selectedMajor;

    return matchQuery && matchMajor;
  });

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
          <article key={c.id} className={cx('cand-card')}>
            <header className={cx('cand-card__header')}>
              <img
                className={cx('cand-card__avatar')}
                src={c.avatar}
                alt={c.name}
              />
              <div className={cx('cand-card__headings')}>
                <div className={cx('cand-card__name')}>{c.name}</div>
                <div className={cx('cand-card__role')}>
                  {c.major}
                </div>
              </div>
            </header>

            <ul className={cx('cand-card__info')}>
              {/* Phone */}
              <li className={cx('cand-card__info-item')}>
                <span className={cx('cand-card__icon')} title={t.tooltipPhone}>📞</span>
                {c.phone}
              </li>
              
              {/* Address */}
              <li className={cx('cand-card__info-item')}>
                <span className={cx('cand-card__icon')} title={t.tooltipAddress}>📍</span>
                {c.address}
              </li>

              {/* School */}
              <li className={cx('cand-card__info-item')}>
                <span className={cx('cand-card__icon')} title={t.tooltipSchool}>🎓</span>
                {c.school}
              </li>

              {/* Graduation Year */}
              <li className={cx('cand-card__info-item')}>
                <span className={cx('cand-card__icon')} title={t.tooltipGradYear}>🗓️</span>
                {t.labelGraduation}: {c.graduation_year}
              </li>

               {/* GPA */}
               <li className={cx('cand-card__info-item')}>
                <span className={cx('cand-card__icon')} title={t.tooltipGPA}>📊</span>
                {t.labelGPA}: <strong>{c.gpa}</strong>
              </li>

              {/* Salary */}
              <li className={cx('cand-card__info-item')}>
                <span className={cx('cand-card__icon')} title={t.tooltipSalary}>💰</span>
                {c.desired_salary}
              </li>
            </ul>

            {/* Career Goal */}
            <div className={cx('cand-card__goal-section')}>
              <div className={cx('cand-card__goal-label')}>🎯 {t.labelGoal}:</div>
              <div className={cx('cand-card__goal-text')}>
                 {c.career_goal}
              </div>
            </div>
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