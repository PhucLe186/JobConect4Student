import React, { useState } from 'react';
import Homepage from './Homepage';
import Home2 from './Home2';
import Home3 from './Home3';
import Job from './Job';
import Company from './Company';
import Company2 from './Company2';
import Company3 from './Company3';
import CompanyDetail from './CompanyDetail';
import Community from './Community';
import Contact from './Contact';
import CVBuilder from './CVBuilder';

function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const [companyFilter, setCompanyFilter] = useState(null);

  const handlePageChange = (page, filter = null) => {
    setCurrentPage(page);
    setCompanyFilter(filter);
  };

  const renderPage = () => {
    if (currentPage === 'job') {
      return <Job onBack={() => setCurrentPage(1)} onPageChange={handlePageChange} />;
    } else if (currentPage === 'company') {
      return <Company onPageChange={setCurrentPage} />;
    } else if (currentPage === 'company2') {
      return <Company2 onPageChange={setCurrentPage} />;
    } else if (currentPage === 'company3') {
      return <Company3 onPageChange={setCurrentPage} />;
    } else if (currentPage === 'companyDetail') {
      return <CompanyDetail onBack={() => setCurrentPage('company')} onPageChange={handlePageChange} />;
    } else if (currentPage === 'community') {
      return <Community onPageChange={handlePageChange} />;
    } else if (currentPage === 'contact') {
      return <Contact onPageChange={handlePageChange} />;
    } else if (currentPage === 'cvbuilder') {
      return <CVBuilder onPageChange={handlePageChange} />;
    } else if (currentPage === 1) {
      return <Homepage onPageChange={handlePageChange} companyFilter={companyFilter} />;
    } else if (currentPage === 2) {
      return <Home2 onPageChange={handlePageChange} />;
    } else {
      return <Home3 onPageChange={handlePageChange} />;
    }
  };

  return (
    <div className="App">
      {renderPage()}
    </div>
  );
}

export default App;