import { NavLink } from 'react-router-dom';

import logo from '../../assets/logo.png';

import UserMenu from '../UserMenu/UserMenu.jsx';

import css from './Header.module.css';

const Header = () => {
  return (
    <header className={css.header}>
      <NavLink to="/">
        <img src={logo} alt="logo" height="85px" width="120px" />
      </NavLink>

      <UserMenu />

      <button>AUTH</button>
    </header>
  );
};

export default Header;
