import routesconfig from '~/config/routes';
import AdminApp from '~/admin/AdminApp';

const publicRoutes = [{ path: routesconfig.home, component: AdminApp, layout: null }];
export { publicRoutes };
