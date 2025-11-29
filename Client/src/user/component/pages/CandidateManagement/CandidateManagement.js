import React, { useState, useMemo, useContext } from 'react';
import styles from './CandidateManagement.module.scss';
import classNames from 'classnames/bind';
<<<<<<< HEAD
import { AuthContext } from '~/context/AuthContext';

// 1. Import file dịch
import trans__candidateManagement from "../../../../component/Translation/CandidateManagement"
=======
import translations from '~/component/Translation';
import { useContext } from 'react';
import { AuthContext } from '~/context/AuthContext';
>>>>>>> 165a7464 (new updat 29/11/2025)

const cx = classNames.bind(styles);

const MOCK_CANDIDATES = [
  {
    id: 1,
    name: 'Nguyễn Văn A',
    avatar: 'https://placehold.co/56x56',
    jobApplied: 'Frontend Developer (ReactJS)',
    dateApplied: '20/11/2025',
    status: 'Pending'
  },
  {
    id: 2,
    name: 'Trần Thị B',
    avatar: 'https://placehold.co/56x56',
<<<<<<< HEAD
    jobApplied: 'Backend Developer (NodeJS)',
    dateApplied: '21/11/2025',
    status: 'Pending'
=======
    phone: '0912345678',
    address: 'Hà Nội', 
    school: 'Đại học Công Nghệ',
    major: 'Khoa học máy tính',
    gpa: 3.8,
    graduation_year: 2025,
    career_goal: 'Phát triển sâu về AI và Machine Learning.',
    desired_salary: '20.000.000 VNĐ',
>>>>>>> 165a7464 (new updat 29/11/2025)
  },
  {
    id: 3,
    name: 'Lê Văn C',
    avatar: 'https://placehold.co/56x56',
<<<<<<< HEAD
    jobApplied: 'Fullstack Developer',
    dateApplied: '22/11/2025',
    status: 'Pending'
=======
    phone: '0987654321',
    address: 'Đà Nẵng', 
    school: 'Đại học Bách Khoa Đà Nẵng',
    major: 'Hệ thống thông tin',
    gpa: 3.2,
    graduation_year: 2023,
    career_goal: 'Mong muốn làm việc trong môi trường quốc tế, sử dụng tiếng Anh.',
    desired_salary: '12.000.000 VNĐ',
>>>>>>> 165a7464 (new updat 29/11/2025)
  },
];

// 2. Thêm prop language
function CandidateManagement() {
<<<<<<< HEAD
  const { language } = useContext(AuthContext);
  const [query, setQuery] = useState('');

  // 3. Lấy từ điển
  const t = trans__candidateManagement[language || 'vi'];
=======
  const {language}= useContext(AuthContext)
  const [query, setQuery] = useState('');
  const [selectedMajor, setSelectedMajor] = useState('all');
  const t = translations[language];

  // Lấy danh sách các chuyên ngành (Major) để làm bộ lọc
  const majors = useMemo(() => {
    const allMajors = MOCK_CANDIDATES.map((c) => c.major);
    return ['all', ...new Set(allMajors)];
  }, []);
>>>>>>> 165a7464 (new updat 29/11/2025)

  // Xử lý lọc dữ liệu
  const filtered = MOCK_CANDIDATES.filter((c) => {
    const matchQuery =
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.jobApplied.toLowerCase().includes(query.toLowerCase());

    return matchQuery;
  });

  return (
    <div className={cx('cands')}>
      <h1 className={cx('cands__title')}>{t.pageTitle}</h1>

      <section className={cx('cands__panel')}>
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
        </div>
      </section>

      <div className={cx('cands__table-wrapper')}>
        <table className={cx('cands__table')}>
            <thead>
                <tr>
                    <th>{t.colCandidate}</th>
                    <th>{t.colAppliedJob}</th>
                    <th>{t.colDateApplied}</th>
                    <th>{t.colCV}</th>
                    <th>{t.colAction}</th>
                </tr>
            </thead>
            <tbody>
                {filtered.map((c) => (
                    <tr key={c.id}>
                        <td>
                            <div className={cx('cand-info')}>
                                <img src={c.avatar} alt={c.name} className={cx('cand-avatar')} />
                                <span className={cx('cand-name')}>{c.name}</span>
                            </div>
                        </td>
                        <td>{c.jobApplied}</td>
                        <td>{c.dateApplied}</td>
                        <td>
                            <button className={cx('btn', 'btn-view')}>{t.btnViewCV}</button>
                        </td>
                        <td>
                            <div className={cx('action-buttons')}>
                                <button className={cx('btn', 'btn-accept')}>{t.btnAccept}</button>
                                <button className={cx('btn', 'btn-reject')}>{t.btnReject}</button>
                            </div>
                        </td>
                    </tr>
                ))}
                 {filtered.length === 0 && (
                    <tr>
                        <td colSpan="5" style={{textAlign: 'center', padding: '20px'}}>
                            {t.noResult}
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
      </div>
    </div>
  );
}

export default CandidateManagement;