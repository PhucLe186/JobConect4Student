import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './sidebar.module.scss';
import classNames from 'classnames/bind';

import trans__footer from '../../../../component/Translation/footer';

const cx = classNames.bind(styles);

function Sidebar({ isOpen, onClose, language = 'vi' }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const navigate = useNavigate();

    const t = trans__footer[language];

    const handleClick = (index, path) => {
        setActiveIndex(index);
        navigate(path);
        if (onClose) {
            onClose();
        }
    };

    return (
        <div className={cx('sidebar', { 'is-open': isOpen })}>
            <button className={cx('sidebar__close-btn')} onClick={onClose}>
                &times;
            </button>

            <div
                className={cx('sidebar__menu-item', { 'sidebar__menu-item--active': activeIndex === 0 })}
                onClick={() => handleClick(0, '/studentprofile')}
            >
                {t.studentProfile}
            </div>

            <div
                className={cx('sidebar__menu-item', { 'sidebar__menu-item--active': activeIndex === 1 })}
                onClick={() => handleClick(1, '/applicationhistory')}
            >
                {t.applicationHistory}
            </div>
        </div>
    );
}

export default Sidebar;
