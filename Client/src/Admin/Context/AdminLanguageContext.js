import React, { createContext, useContext, useState } from 'react';

const AdminLanguageContext = createContext();

export const useAdminLanguage = () => {
  const context = useContext(AdminLanguageContext);
  if (!context) {
    throw new Error('useAdminLanguage must be used within AdminLanguageProvider');
  }
  return context;
};

export const AdminLanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('vi');

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
    localStorage.setItem('adminLanguage', newLanguage);
  };

  React.useEffect(() => {
    const savedLanguage = localStorage.getItem('adminLanguage');
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  return (
    <AdminLanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </AdminLanguageContext.Provider>
  );
};