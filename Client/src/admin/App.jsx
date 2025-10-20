import React from 'react';
import classNames from 'classnames/bind';
import AdminDashboard from './AdminDashboard';
import './App.css';
import styles from './App.module.scss';
const cx = classNames.bind(styles);

function App() {
    return (
        <div className={cx('content-section active')}>
            <AdminDashboard />
        </div>
    );
}

export default App;
