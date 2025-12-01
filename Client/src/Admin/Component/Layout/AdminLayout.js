import Header from '../Component/Header/Header';
import Sidebar from '../Component/SideBar/Sidebar';
import { AdminLanguageProvider } from '../../Context/AdminLanguageContext';
import styles from './Adminlayout.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function AdminLayout({ children }) {
    return (
        <AdminLanguageProvider>
            <div className={cx('container')}>
                <Sidebar />
                <div className={cx('inner')}>
                    <Header />
                    <>{children}</>
                </div>
            </div>
        </AdminLanguageProvider>
    );
}

export default AdminLayout;
