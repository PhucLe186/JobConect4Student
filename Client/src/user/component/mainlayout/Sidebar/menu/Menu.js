import classNames from 'classnames/bind';
import styles from './menulist.module.scss';

const cx = classNames.bind(styles);
function Menu({ children, open }) {
    return <nav className={cx('sidebar', {'is-open': open})}>{children}</nav>;
}

export default Menu;
