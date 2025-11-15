import classNames from 'classnames/bind';
import style from './footer.module.scss';

const cx = classNames.bind(style);
function Footer() {
    return (
        <footer>
<<<<<<< HEAD
            <div className="container text-center" style={{textAlign: 'center'}}>
                <h5 className="fw-bold text-primary">
                    JobConnect <span className="text-success">4Students</span>
=======
            <div className={cx('container text-center')}>
                <h5 className={cx('fw-bold text-primary')}>
                    JobConnect <span className={cx('text-success')}>4Students</span>
>>>>>>> 48553a4edcbeacb90fdc51c767579f2b7ef8f5c2
                </h5>
                <p>497 Hoa Hao Street, Ward 7, District 10, Ho Chi Minh City</p>
                <p>Hotline : 0943009243</p>
                <div className="mt-2">
                    <a href="#">Facebook</a> · <a href="#">Instagram</a> ·<a href="#">YouTube</a>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
