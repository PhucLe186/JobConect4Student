import { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { publicRoutes } from '~/routes';
import Default from '~/user/component/default';
import { AuthProvider } from '~/context/AuthContext';

function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
}

function App() {
    return (

        <Router>
            <ScrollToTop />
            <AuthProvider>
                <Routes>
                    {publicRoutes.map((route, idx) => {
                        let Layout = Default;

                        const Page = route.component;
                        if (route.layout === null) {
                            Layout = Fragment;
                        } else if (route.layout) {
                            Layout = route.layout;
                        }
                        return (
                            <Route
                                key={idx}
                                path={route.path}
                                element={
                                    <Layout>
                                        <Page />
                                    </Layout>
                                }
                            />
                        );
                    })}
                </Routes>
            </AuthProvider>
        </Router>

    );
}

export default App;
