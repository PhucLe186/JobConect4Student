import React, { useState, useEffect, useContext, useCallback } from 'react';
import classNames from "classnames/bind";
import styles from "./ApplicationHistory.module.scss";
import translations from '~/component/Translation';
import { AuthContext } from '~/context/AuthContext';
import ApplicationDetailModal from './ApplicationDetailModal';

const cx = classNames.bind(styles);

function ApplicationHistory({ language = 'vi' }) {
    const [applications, setApplications] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const { api, user } = useContext(AuthContext);

    const t = translations[language];

    const fetchApplicationHistory = useCallback(async () => {
        try {
            const response = await api.get('applications/history');
            console.log('Response data:', response.data);
            setApplications(response.data.applications || []);
        } catch (err) {
            console.error('Fetch error:', err);
            setError(`Lỗi kết nối: ${err.response?.data?.message || err.message}`);
        } finally {
            setLoading(false);
        }
    }, [api]);

    const testAuth = useCallback(async () => {
        try {
            if (!user) {
                setError('Vui lòng đăng nhập để xem lịch sử ứng tuyển.');
                setLoading(false);
                return;
            }
            
            console.log('Testing auth with user:', user);
            
            const response = await api.get('applications/test');
            console.log('Test auth success:', response.data);
            fetchApplicationHistory();
        } catch (err) {
            console.error('Test auth error:', err);
            setError(`Auth error: ${err.response?.data?.message || err.message}`);
            setLoading(false);
        }
    }, [user, api, fetchApplicationHistory]);

    useEffect(() => {
        testAuth();
    }, [testAuth]);

    const handleViewDetails = (application) => {
        setSelectedApplication(application);
        setIsDetailModalOpen(true);
    };

    const handleCloseDetailModal = () => {
        setIsDetailModalOpen(false);
        setSelectedApplication(null);
    };

    if (loading) return <div className={cx("loading")}>Đang tải...</div>;
    if (error) return <div className={cx("error")}>{error}</div>;

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
                        {applications.length > 0 ? (
                            applications.map((application) => {
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
                                        <td data-label={t.tableCompany}>
                                            <div className={cx("company-info")}>
                                                {application.companyLogo && (
                                                    <img 
                                                        src={application.companyLogo} 
                                                        alt={application.companyName}
                                                        className={cx("company-logo")}
                                                    />
                                                )}
                                                <span>{application.companyName}</span>
                                            </div>
                                        </td>
                                        <td data-label={t.tableJobTitle}>{application.jobTitle}</td>
                                        <td data-label={t.tableAppliedAt}>{new Date(application.applied_at).toLocaleDateString('vi-VN')}</td>
                                        <td data-label={t.tableStatus}>
                                            <span className={cx("status-badge", statusClass)}>
                                                {statusText}
                                            </span>
                                        </td>
                                        <td data-label={t.tableDetails}>
                                            <span 
                                                className={cx("history-btn", "btn-details")}
                                                onClick={() => handleViewDetails(application)}
                                                style={{cursor: 'pointer'}}
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

            <ApplicationDetailModal
                isOpen={isDetailModalOpen}
                onClose={handleCloseDetailModal}
                application={selectedApplication}
                language={language}
            />
        </div>
    );
}

export default ApplicationHistory;