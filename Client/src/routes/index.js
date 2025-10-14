import routesconfig from '~/config/routes';
import Community from '~/user/component/pages/Community';
import Home from '~/user/component/pages/Home';

const publicRoutes = [
    { path: routesconfig.Community, component: Community },
    { path: routesconfig.Home, component: Home },
];
export { publicRoutes };
