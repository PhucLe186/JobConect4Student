import routesconfig from '~/config/routes';
<<<<<<< HEAD
import Home from '~/user/component/pages/Home';
import Community from '~/user/component/pages/Community';
import Login from '~/user/component/pages/Login';
import Register from '~/user/component/pages/Register';
import Job from '~/user/component/pages/job';

const publicRoutes = [
    { path: routesconfig.home, component: Home },
    { path: routesconfig.community, component: Community },

    { path: routesconfig.login, component: Login, layout: null },
    { path: routesconfig.register, component: Register, layout: null },
    { path: routesconfig.jobs, component: Job },
];

=======
import Community from '~/user/component/pages/Community';
import Home from '~/user/component/pages/Home';

const publicRoutes = [
    { path: routesconfig.Community, component: Community },
    { path: routesconfig.Home, component: Home },
];
>>>>>>> 48553a4edcbeacb90fdc51c767579f2b7ef8f5c2
export { publicRoutes };
