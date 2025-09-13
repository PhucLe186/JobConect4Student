import MenuItem from './menu/MenuList';
import Menu from './menu/Menu';
import routesConfig from '~/config/routes';

import Onback from '~/component/BackButton';

function Header() {
    return (
        <header>
            <div>
                <Menu>
                    <Onback back_btn />
                    <MenuItem to={routesConfig.home} title="Home" />
                </Menu>
            </div>
        </header>
    );
}

export default Header;
