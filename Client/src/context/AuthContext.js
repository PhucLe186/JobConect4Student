import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    
    console.log('AuthProvider rendered - isLoggedIn:', isLoggedIn);

    const login = (userData) => {
        console.log('AuthContext login called with:', userData);
        setIsLoggedIn(true);
        setUser(userData || { name: 'User', avatar: null });
        console.log('AuthContext login completed - isLoggedIn should be true');
    };

    const logout = () => {
        setIsLoggedIn(false);
        setUser(null);
    };

    const value = {
        isLoggedIn,
        user,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};