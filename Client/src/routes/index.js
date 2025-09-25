import routesconfig from '~/config/routes';
import AdminDashboard from '~/admin/Admin_dashboard';

const publicRoutes = [{ path: routesconfig.home, component: AdminDashboard, layout: null }];
export { publicRoutes };
