import routesconfig from '~/config/routes';
import Home from '~/user/component/pages/Home';
import Community from '~/user/component/pages/Community';
import Login from '~/user/component/pages/Login';
import Register from '~/user/component/pages/Register';
import Job from '~/user/component/pages/job';
import Contact from '~/user/component/pages/Contact';
import Company from '~/user/component/pages/Company';
import CompanyDetail from '~/user/component/pages/CompanyDetail';
import Role from '~/user/component/pages/Role';
import CVBuilder from '~/user/component/pages/CVBuilder';

const publicRoutes = [
    { path: routesconfig.home, component: Home },
    { path: routesconfig.community, component: Community },
    { path: routesconfig.login, component: Login, layout: null },
    { path: routesconfig.register, component: Register, layout: null },
    { path: routesconfig.jobs, component: Job },
    { path: routesconfig.contact, component: Contact },
    { path: routesconfig.company, component: Company },
    { path: routesconfig.companyDetail, component: CompanyDetail },
    { path: routesconfig.role, component: Role, layout: null },
    { path: routesconfig.cvBuilder, component: CVBuilder },
];
export { publicRoutes };
