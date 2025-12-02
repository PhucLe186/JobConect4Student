import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './JobSuggestions.module.scss';
import { AuthContext } from '~/context/AuthContext';
import translations from '~/component/Translation';

const cx = classNames.bind(styles);

function JobSuggestions() {
    const navigate = useNavigate();
    const { api, language, user } = useContext(AuthContext);
    const [suggestedJobs, setSuggestedJobs] = useState([]);
    const [showAll, setShowAll] = useState(false);
    
    const t = translations[language || 'vi'];

    useEffect(() => {
        const fetchSuggestedJobs = async () => {
            try {
                const res = await api.get('jobs');
                if (res.data) {
                    setSuggestedJobs(res.data);
                }
            } catch (error) {
                console.error('Error fetching jobs:', error);
            }
        };
        fetchSuggestedJobs();
    }, []);

    return (
        <div className={cx('job-suggestions')}>
            <div className={cx('container')}>
                <div className={cx('header')}>
                    <h1 className={cx('title')}>
                        {language === 'vi' ? 'Gợi ý công việc phù hợp' : 'Job Suggestions'}
                    </h1>
                    <p className={cx('subtitle')}>
                        {language === 'vi' 
                            ? 'Khám phá những cơ hội việc làm phù hợp với kỹ năng và kinh nghiệm của bạn'
                            : 'Discover job opportunities that match your skills and experience'
                        }
                    </p>
                </div>

                <div className={cx('jobs-grid')}>
                    {(showAll ? suggestedJobs : suggestedJobs.slice(0, 6)).map((job, index) => (
                        <div className={cx('job-card')} key={index}>
                            <div className={cx('job-header')}>
                                <img src={job.logo} alt={job.company} className={cx('company-logo')} />
                                <div className={cx('job-info')}>
                                    <h3 className={cx('job-title')}>{job.title}</h3>
                                    <p className={cx('company-name')}>{job.company_name}</p>
                                </div>
                            </div>
                            <button
                                className={cx('apply-btn')}
                                onClick={() => {
                                    if (!user) {
                                        alert(t.loginToViewMore);
                                        return;
                                    }
                                    navigate(`/job/${job.id}`);
                                }}
                            >
                                {t.seeMore}
                            </button>
                        </div>
                    ))}
                </div>
                
                {suggestedJobs.length > 6 && (
                    <div className={cx('view-more-wrapper')}>
                        <button 
                            className={cx('view-more-btn')}
                            onClick={() => {
                                if (!user) {
                                    alert(t.loginToViewMore);
                                    return;
                                }
                                setShowAll(!showAll);
                            }}
                        >
                            {showAll ? (language === 'vi' ? 'Thu gọn' : 'Show Less') : t.viewMore}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default JobSuggestions;