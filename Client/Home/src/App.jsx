import React, { useState } from 'react';
import Homepage from './Homepage';
import Community from './Community';
import Company from './Company';
import Company2 from './Company2';
import Company3 from './Company3';
import CompanyDetail from './CompanyDetail';
import Contact from './Contact';
import Job from './Job';
import Home2 from './Home2';
import Home3 from './Home3';
import CVBuilder from './CVBuilder';

function App() {
    const [currentPage, setCurrentPage] = useState(1);
    const [companyFilter, setCompanyFilter] = useState(null);
    const handlePageChange = (page, filter = null) => {
        setCurrentPage(page);
        setCompanyFilter(filter);
    };
    const renderPage = () => {
        switch (currentPage) {
            case 1:
                return <Homepage onPageChange={handlePageChange} companyFilter={companyFilter} />;
            case 2:
                return <Home2 onPageChange={handlePageChange} />;
            case 3:
                return <Home3 onPageChange={handlePageChange} />;
            case 'community':
                return <Community onPageChange={handlePageChange} />;
            case 'company':
                return <Company onPageChange={handlePageChange} />;
            case 'company2':
                return <Company2 onPageChange={handlePageChange} />;
            case 'company3':
                return <Company3 onPageChange={handlePageChange} />;
            case 'companyDetail':
                return <CompanyDetail onPageChange={handlePageChange} />;
            case 'contact':
                return <Contact onPageChange={handlePageChange} />;
            case 'job':
                return <Job onPageChange={handlePageChange} />;
            case 'cvbuilder':
                return <CVBuilder onPageChange={handlePageChange} />;
            default:
                return <Homepage onPageChange={handlePageChange} companyFilter={companyFilter} />;
        }
    };

    return <div className="App">{renderPage()}</div>;
}

export default App;
