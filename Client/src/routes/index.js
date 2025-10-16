import routesconfig from '~/config/routes';
import StudentProfile from '~/user/component/pages/StudentProfile';
import ApplicationHistory from '~/user/component/pages/ApplicationHistory';

const publicRoutes = [
    { path: routesconfig.studentprofile, component: StudentProfile },
    { path: routesconfig.applicationhistory, component: ApplicationHistory }
];
export { publicRoutes };
