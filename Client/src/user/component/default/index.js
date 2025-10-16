import React, { useState, cloneElement } from 'react'; 
import Header from '~/user/component/mainlayout/Header';
import Sidebar from '~/user/component/mainlayout/Sidebar';
import styles from './default.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function Default({ children }) {
    const [language, setLanguage] = useState('vi');

    // Tạo state để quản lý trạng thái của sidebar
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    // Hàm để bật/tắt sidebar
    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    const childrenWithProps = React.isValidElement(children)
        ? cloneElement(children, { language })
        : children;

    return (
        <div>
            <Header 
                onToggleSidebar={toggleSidebar} 
                language={language}
                onLanguageChange={setLanguage}
            />
            
            {isSidebarOpen && <div className={cx('overlay')} onClick={toggleSidebar}></div>}
            
            <div className={cx('container__sidebar')}>
                <Sidebar 
                    isOpen={isSidebarOpen} 
                    onClose={toggleSidebar} 
                    language={language} 
                />
                <div className={cx('content__children')}>{childrenWithProps}</div> 

            </div>
        </div>
    );
}

export default Default;