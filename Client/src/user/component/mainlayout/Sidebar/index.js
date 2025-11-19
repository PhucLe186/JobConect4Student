import { useContext, useState } from 'react';
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
    const navigate = useNavigate();

    const t = trans__footer[language];

    const page=[
        {href: Routesconfig.studentprofile, title: t.studentProfile },
        {href: Routesconfig.applicationhistory , title: t.applicationHistory },
        //....chỉ cần thêm router ở đây....//
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
