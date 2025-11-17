import classNames from 'classnames/bind';
import style from './footer.module.scss';

const cx = classNames.bind(style);
function Footer() {
    return (
        <footer>
            <div className="container text-center" style={{textAlign: 'center'}}>
                <h5 className="fw-bold">
                    <span style={{ color: '#007bff' }}>JobConnect</span>
                    <span style={{ color: '#28a745' }}>4Students</span>
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
