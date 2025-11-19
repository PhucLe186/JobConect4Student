import Dashboard from '~/Admin/Component/Page/Dashboard/Dashboard';
import NewJob from '~/user/component/pages/NewJob/NewJob';

const Routes = {
    home: '/',
    login: '/login',
    register: '/register',
    community: '/community',
    company: '/company',
    contact: '/contact',
    jobs: '/jobs',
    jobDetail: '/job/:id',
    role: '/role',
    companyDetail: '/company/:id',
    cvBuilder: '/cv_builder',
    studentprofile: '/studentprofile',
    applicationhistory: '/applicationhistory',
    ///////////////Admin PAge///////////////////////////////
    adminlogin: '/adminlogin',
    dashboard: '/dashboard',
    ForumManagement: '/forumManagement',
    JobManagement: '/jobManagement',
    UserManagement: '/userManagement',
    header: '/header',
    sidebar: '/sidebar',
    CandidateManagement:"/CandidateManagement",
    NTDJobManagement:'/NTDJobManagement',
    NTDprofile:'/NTDprofile',
    NewJob:'/newjob'
};

export default Routes;
