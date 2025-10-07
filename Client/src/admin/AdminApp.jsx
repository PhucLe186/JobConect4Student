import React, { useState } from 'react';
import AdminLogin from './AdminLogin';
import AdminDashboard from './Admin_dashboard';

const AdminApp = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleLogin = () => {
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
    };

    return (
        <>
            {isLoggedIn ? (
                <AdminDashboard onLogout={handleLogout} />
            ) : (
                <AdminLogin onLogin={handleLogin} />
            )}
        </>
    );
};

export default AdminApp;