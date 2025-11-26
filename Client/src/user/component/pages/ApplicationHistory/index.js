import React from 'react';
import classNames from "classnames/bind";
import styles from "./ApplicationHistory.module.scss";
import translations from '~/component/Translation';

const cx = classNames.bind(styles);

const mockData = [
    {
        id: 1,
        jobTitle: 'Frontend Developer (ReactJS)',
        companyName: 'Công Ty A',
        status: 'accepted',
        applied_at: '2025-10-15'
    },
    {
        id: 2,
        jobTitle: 'Backend Developer (NodeJS)',
        companyName: 'Công Ty B',
        status: 'rejected',
        applied_at: '2025-10-12'
    },
    {
        id: 3,
        jobTitle: 'Fullstack Developer',
        companyName: 'Công Ty C',
        status: 'viewed',
        applied_at: '2025-10-10'
    },
    {
        id: 4,
        jobTitle: 'UI/UX Designer',
        companyName: 'Công Ty D',
        status: 'sent',
        applied_at: '2025-10-09'
    },
];

function ApplicationHistory({ language = 'vi' }) {

    const t = translations[language];

    return (
        <div className={cx("history-container")}>
            <h1 className={cx("history-title")}>{t.pageTitle}</h1>

            <div className={cx("history-table-wrapper")}>
                <table className={cx("history-table")}>
                    <thead>
                        <tr>
                            <th>{t.tableCompany}</th>
                            <th>{t.tableJobTitle}</th>
                            <th>{t.tableAppliedAt}</th>
                            <th>{t.tableStatus}</th>
                            <th>{t.tableDetails}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockData.length > 0 ? (
                            mockData.map((application) => {
                                let statusText;
                                let statusClass;
                                switch (application.status) {
                                    case 'accepted':
                                        statusText = t.statusAccepted;
                                        statusClass = 'status--accepted';
                                        break;
                                    case 'rejected':
                                        statusText = t.statusRejected;
                                        statusClass = 'status--rejected';
                                        break;
                                    case 'viewed':
                                        statusText = t.statusViewed;
                                        statusClass = 'status--viewed';
                                        break;
                                    case 'sent':
                                        statusText = t.statusSent;
                                        statusClass = 'status--sent';
                                        break;
                                    default:
                                        statusText = t.statusUnknown;
                                        statusClass = 'status--sent';
                                }

                                return (
                                    <tr key={application.id}>
                                        <td data-label={t.tableCompany}>{application.companyName}</td>
                                        <td data-label={t.tableJobTitle}>{application.jobTitle}</td>
                                        <td data-label={t.tableAppliedAt}>{application.applied_at}</td>
                                        <td data-label={t.tableStatus}>
                                            <span className={cx("status-badge", statusClass)}>
                                                {statusText}
                                            </span>
                                        </td>
                                        <td data-label={t.tableDetails}>
                                            <span 
                                                className={cx("history-btn", "btn-details")}
                                            >
                                                {t.viewMore}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="5" className={cx("no-data")}>
                                    {t.noData}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ApplicationHistory;