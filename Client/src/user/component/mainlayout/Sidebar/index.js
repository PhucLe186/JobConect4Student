import { useContext, useEffect, useState } from 'react';
import styles from './sidebar.module.scss';
import classNames from 'classnames/bind';
import Routesconfig  from  '~/routes/routes';
import Menu from './menu/Menu';
import MenuItem from './menu/MenuList';
import { AuthContext } from '~/context/AuthContext';
import translations from '~/component/Translation';


const cx = classNames.bind(styles);

function Sidebar() {
   const [language, setLanguage] = useState('vi');
    const [isOpen, setIsopen]= useState(true)
    const {user} = useContext(AuthContext);

    const t = translations[language];

    const page= user?.type === 'student' ?
        [
            {href: Routesconfig.studentprofile, title: t.studentProfile },
            {href: Routesconfig.applicationhistory , title: t.applicationHistory }
        ]:
        [
            {href:Routesconfig.CandidateManagement,title:t.candidateManagement},
            {href:Routesconfig.NTDJobManagement,title:t.jobManagement},
            {href:Routesconfig.NTDprofile,title:t.companyProfile},
        ]
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
