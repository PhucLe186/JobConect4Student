import React, { useState, useMemo, useContext, useEffect } from 'react';
import styles from './CandidateManagement.module.scss';
import classNames from 'classnames/bind';
import translations from '~/component/Translation';
import { AuthContext } from '~/context/AuthContext';

const cx = classNames.bind(styles);

// 2. Thêm prop language
function CandidateManagement() {
  const {language, api}= useContext(AuthContext)
  const [query, setQuery] = useState('');
  const [data, setData]= useState([]);
  const t = translations[language];
  const filtered = data.filter((c) => {
    const matchQuery =
      c.name?.toLowerCase().includes(query.toLowerCase()) ||
      c.jobApplied?.toLowerCase().includes(query.toLowerCase());
    return matchQuery;
  });
  function timeAgo(dateString) {
        const now = Date.now();
        const postTime = new Date(dateString).getTime();
        const diffMs = now - postTime;

        const seconds = Math.floor(diffMs / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days} ngày trước`;
        if (hours > 0) return `${hours} giờ trước`;
        if (minutes > 0) return `${minutes} phút trước`;
        return 'Vừa xong';
    }

  useEffect(()=> {
    const fetchData= async()=> {
      const res= await api.get('applications')
      if(res.data) {
        console.log(res.data)
        setData(res.data)
      }
    }
    fetchData()
  },[])
  console.log(data)
  const handleView= (url)=> {
    window.open(url)
  }

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
                                <span className={cx('cand-name')}>{c.name}</span>
                            </div>
                        </td>
                        <td>{c.jobApplied}</td>
                        <td>{timeAgo(c.applied_at)}</td>
                        <td>
                            <button className={cx('btn', 'btn-view')} onClick={()=>handleView(c.link)} >{t.btnViewCV}</button>
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