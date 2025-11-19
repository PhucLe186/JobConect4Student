import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './sidebar.module.scss';
import classNames from 'classnames/bind';
import Routesconfig  from  '~/routes/routes';
import trans__footer from '../../../../component/Translation/footer';
import Menu from '../Header/menu/Menu';
import MenuItem from '../Header/menu/MenuList';



const cx = classNames.bind(styles);

function Sidebar({language}) {
    const [isOpen, setIsopen]= useState(true)
    const [user, setUser] = useState(null);
     const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
            const checkLoginStatus = () => {
                const loginStatus = localStorage.getItem('isLoggedIn');
                const userData = localStorage.getItem('userData');
                console.log('Checking login status:', loginStatus, userData);
                if (loginStatus === 'true') {
                    setIsLoggedIn(true);
                    setUser(userData ? JSON.parse(userData) : { name: 'User' });
                } else {
                    setIsLoggedIn(false);
                    setUser(null);
                }
            };
    
            checkLoginStatus();
    
            // Listen for storage changes
            window.addEventListener('storage', checkLoginStatus);
    
            // Custom event listener for same-tab changes
            window.addEventListener('loginStatusChanged', checkLoginStatus);
    
            return () => {
                window.removeEventListener('storage', checkLoginStatus);
                window.removeEventListener('loginStatusChanged', checkLoginStatus);
            };
        }, []);

    const t = trans__footer[language];

    const page=
       user?.role === 'student' ?
       [
        {href: Routesconfig.studentprofile, title: t.studentProfile },
        {href: Routesconfig.applicationhistory , title: t.applicationHistory }
        ]:
        [
        {href: Routesconfig.CandidateManagement, title: "CandidateManagement" },
        {href: Routesconfig.NTDJobManagement, title: "NTDJobManagement" },
        {href: Routesconfig.NTDprofile, title: "NTDprofile" }   
        ]
        //....chỉ cần thêm router ở đây....//
    return (
        
        <Menu open={isOpen}>
            <button className={cx('sidebar__close-btn')} onClick={()=>setIsopen(!isOpen)}>
                &times;
            </button>
            {page.map((page, idx) => (
                 <MenuItem key={idx} to={page.href} title={page.title}/>
            ))}
        </Menu>
    );
}

export default Sidebar;
