import routesconfig from '~/config/routes';
import AdminApp from '~/admin/AdminApp';
import Dashboard from '~/Adminn/component/pages/Dashboard/Dashboard';
import ForumManagement from '~/Adminn/component/pages/ForumManagement/ForumManagement';
import JobManagement from '~/Adminn/component/pages/JobManagement/JobManagement';
import UserManagement from '~/Adminn/component/pages/UserManagement/UserManagement';

const publicRoutes = [
    { path: routesconfig.home, component: AdminApp, layout: null },

    { path: routesconfig.dashboard, component: Dashboard, layout: null },
    { path: routesconfig.ForumManagement, component: ForumManagement, layout: null },
    { path: routesconfig.JobManagement, component: JobManagement, layout: null },
    { path: routesconfig.UserManagement, component: UserManagement, layout: null },
];
export { publicRoutes };
