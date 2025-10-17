import Header from '~/user/component/mainlayout/Header';
import Footer from '~/user/component/mainlayout/Footer';
import classNames from 'classnames/bind';
import styles from './Default.module.scss';

const cx = classNames.bind(styles);

function Default({ children }) {
    return (
        <div className={cx('parent')}>
            <Header></Header>
            <div>{children}</div>
            <Footer></Footer>
        </div>
    );
}

export default Default;
