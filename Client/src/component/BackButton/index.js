import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate, useLocation } from 'react-router-dom';
import routesConfig from '~/config/routes';
import classNames from 'classnames/bind';
import styles from './BackButton.module.scss';

const cx = classNames.bind(styles);
function Onback( {back_btn, back_btn2 }) {
    const navigate = useNavigate();
    const location = useLocation();

    if (location.pathname === routesConfig.home) return null;


 const classes = cx({back_btn}, {back_btn2});

    return (
        <button className={classes} onClick={() => navigate(-1)}>
            <FontAwesomeIcon icon={faAngleLeft} />
        </button>
    );
}

export default Onback;
