import { NavLink } from 'react-router-dom';

import logo from '../../assets/logo.png';

import Navigation from '../Navigation/Navigation.jsx';
import UserMenu from '../UserMenu/UserMenu.jsx';

import css from './Header.module.css';

const Header = () => {
  return (
    <header className={css.header}>
      <NavLink to="/">
        <img src={logo} alt="logo" height="85px" width="120px" />
      </NavLink>

      <Navigation />
      <UserMenu />

      <NavLink to="/auth">Sign Up</NavLink>
    </header>
  );
};

export default Header;
