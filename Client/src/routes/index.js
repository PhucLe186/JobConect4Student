import routesconfig from '~/routes/routes';
import Home from '~/user/component/pages/Home';
import Community from '~/user/component/pages/Community';
import Login from '~/user/component/pages/Login';
import Register from '~/user/component/pages/Register';
import ForgotPassword from '~/user/component/pages/ForgotPassword';
import SocialRoleSelection from '~/user/component/pages/SocialRoleSelection';
import Job from '~/user/component/pages/DetailJob';
import Contact from '~/user/component/pages/Contact';
import Company from '~/user/component/pages/Company';
import CompanyDetail from '~/user/component/pages/CompanyDetail';
import Role from '~/user/component/pages/Role';
import CVBuilder from '~/user/component/pages/CVBuilder';
import ApplicationHistory from '~/user/component/pages/ApplicationHistory';
import Default from '~/user/component/default/detaillayout';
import StudentProfile from '~/user/component/pages/StudentProfile';
import AdminLogin from '~/Admin/Component/Page/Login/AdminLogin';
import Dashboard from '~/Admin/Component/Page/Dashboard/Dashboard';
import ForumManagement from '~/Admin/Component/Page/ForumManagement/ForumManagement';
import JobManagement from '~/Admin/Component/Page/JobManagement/JobManagement';
import UserManagement from '~/Admin/Component/Page/UserManagement/UserManagement';
import AdminLayout from '~/Admin/Component/Layout/AdminLayout';
import CandidateManagement from '~/user/component/pages/CandidateManagement/CandidateManagement';
import NTDJobManagement from '~/user/component/pages/JobManagement/JobManagement'
import NTDProfile from '~/user/component/pages/NTDProfile';
import NewJob from '~/user/component/pages/NewJob/NewJob';
import JobSuggestions from '~/user/component/pages/JobSuggestions';

const publicRoutes = [
    { path: routesconfig.home, component: Home },
    { path: routesconfig.community, component: Community },
    { path: routesconfig.login, component: Login, layout: null },
    { path: routesconfig.register, component: Register, layout: null },
    { path: routesconfig.forgotPassword, component: ForgotPassword, layout: null },
    { path: routesconfig.socialRoleSelection, component: SocialRoleSelection, layout: null },
    { path: routesconfig.jobs, component: Home },
    { path: routesconfig.jobDetail, component: Job },
    { path: routesconfig.contact, component: Contact },
    { path: routesconfig.company, component: Company },
    { path: routesconfig.companyDetail, component: CompanyDetail },
    { path: routesconfig.role, component: Role, layout: null },
    { path: routesconfig.cvBuilder, component: CVBuilder },
    { path: routesconfig.jobSuggestions, component: JobSuggestions },
    { path: routesconfig.applicationhistory, component: ApplicationHistory, layout: Default },
    { path: routesconfig.studentprofile, component: StudentProfile, layout: Default },
    { path: routesconfig.CandidateManagement, component: CandidateManagement, layout: Default  },
    { path: routesconfig.NTDJobManagement, component: NTDJobManagement, layout: Default  },
    { path: routesconfig.NTDprofile, component: NTDProfile, layout: Default  },
    { path: routesconfig.NewJob, component: NewJob, layout: Default  },
    { path: routesconfig.EditJob, component: NewJob, layout: Default  },
    /*****************************************Admin_Page**********************************************************/
    { path: routesconfig.adminlogin, component: AdminLogin, layout: null },
    { path: routesconfig.dashboard, component: Dashboard, layout: AdminLayout },
    { path: routesconfig.ForumManagement, component: ForumManagement, layout: AdminLayout },
    { path: routesconfig.JobManagement, component: JobManagement, layout: AdminLayout },
    { path: routesconfig.UserManagement, component: UserManagement, layout: AdminLayout },

];
const PrivateRoutes = [
    { path: routesconfig.dashboard, component: Dashboard, layout: AdminLayout },
    { path: routesconfig.ForumManagement, component: ForumManagement, layout: AdminLayout },
    { path: routesconfig.JobManagement, component: JobManagement, layout: AdminLayout },
    { path: routesconfig.UserManagement, component: UserManagement, layout: AdminLayout },
];
export { publicRoutes, PrivateRoutes };
