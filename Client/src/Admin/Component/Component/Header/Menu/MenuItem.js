import { NavLink } from 'react-router-dom';
import styles from './menulist.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);
function MenuItem({ to, title }) {
    return (
        <NavLink className={(nav) => cx('list', { active: nav.isActive })} to={to}>
            {title}
        </NavLink>
    );
}

export default MenuItem;
