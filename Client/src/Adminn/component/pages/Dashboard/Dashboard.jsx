import React, { useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './Dashboard.module.scss';
const cx = classNames.bind(styles);

const Dashboard = ({ t, showSection }) => {
    useEffect(() => {
        drawCharts();
    }, []);

    const drawCharts = () => {
        // Vẽ biểu đồ cột người dùng
        const userCanvas = document.getElementById('userChart');
        if (userCanvas) {
            const ctx = userCanvas.getContext('2d');
            const data = [120, 150, 180, 200, 250, 300];
            const labels = ['2020', '2021', '2022', '2023', '2024', '2025'];

            ctx.clearRect(0, 0, userCanvas.width, userCanvas.height);

            const barWidth = 46;
            const barSpacing = 15;
            const maxValue = Math.max(...data);
            const chartHeight = 150;

            data.forEach((value, index) => {
                const barHeight = (value / maxValue) * chartHeight;
                const x = 40 + index * (barWidth + barSpacing);
                const y = 170 - barHeight;

                ctx.fillStyle = '#667eea';
                ctx.fillRect(x, y, barWidth, barHeight);

                ctx.fillStyle = '#333';
                ctx.font = '12px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(labels[index], x + barWidth / 2, 190);
                ctx.fillText(value, x + barWidth / 2, y - 5);
            });
        }

        // Vẽ biểu đồ tròn ngành nghề
        const jobCanvas = document.getElementById('jobChart');
        if (jobCanvas) {
            const ctx = jobCanvas.getContext('2d');
            const data = [
                { label: 'IT', value: 45, color: '#667eea' },
                { label: 'Marketing', value: 25, color: '#764ba2' },
                { label: 'Kế toán', value: 15, color: '#f093fb' },
                { label: 'Nhân sự', value: 10, color: '#4facfe' },
                { label: 'Khác', value: 5, color: '#43e97b' },
            ];

            ctx.clearRect(0, 0, jobCanvas.width, jobCanvas.height);

            const centerX = jobCanvas.width / 2;
            const centerY = jobCanvas.height / 2;
            const radius = 80;
            let currentAngle = 0;

            data.forEach((item) => {
                const sliceAngle = (item.value / 100) * 2 * Math.PI;

                ctx.beginPath();
                ctx.moveTo(centerX, centerY);
                ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
                ctx.closePath();
                ctx.fillStyle = item.color;
                ctx.fill();

                const labelAngle = currentAngle + sliceAngle / 2;
                const labelX = centerX + Math.cos(labelAngle) * (radius + 20);
                const labelY = centerY + Math.sin(labelAngle) * (radius + 20);

                ctx.fillStyle = '#333';
                ctx.font = '12px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(item.label, labelX, labelY);
                ctx.fillText(item.value + '%', labelX, labelY + 15);

                currentAngle += sliceAngle;
            });
        }
    };

    return (
        <div className={cx('content-section')}>
            <h2>{t.dashboardOverview}</h2>
            <div className={cx('stats-grid')}>
                <div className={cx('stat-card')} onClick={() => showSection('users')}>
                    <div className={cx('stat-info')}>
                        <h3>1,250</h3>
                        <p>{t.totalUsers}</p>
                    </div>
                </div>
                <div className={cx('stat-card')} onClick={() => showSection('jobs')}>
                    <div className={cx('stat-info')}>
                        <h3>340</h3>
                        <p>{t.totalJobs}</p>
                    </div>
                </div>
                <div className={cx('stat-card')} onClick={() => showSection('companies')}>
                    <div className={cx('stat-info')}>
                        <h3>85</h3>
                        <p>{t.totalPosts}</p>
                    </div>
                </div>
                <div className={cx('stat-card')} onClick={() => showSection('jobs')}>
                    <div className={cx('stat-info')}>
                        <h3>156</h3>
                        <p>{t.pendingApplications}</p>
                    </div>
                </div>
            </div>

            <div className={cx('charts-container')}>
                <div className={cx('chart-card')}>
                    <h3>{t.userRegistrationChart}</h3>
                    <canvas id="userChart" width="400" height="200"></canvas>
                </div>
                <div className={cx('chart-card')}>
                    <h3>{t.jobCategoryChart}</h3>
                    <canvas id="jobChart" width="300" height="300"></canvas>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
