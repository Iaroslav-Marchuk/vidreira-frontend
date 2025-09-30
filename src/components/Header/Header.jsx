import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import clsx from 'clsx';

import logo from '../../assets/logo.png';

import Navigation from '../Navigation/Navigation.jsx';
import UserMenu from '../UserMenu/UserMenu.jsx';

import { selectIsLoggedIn } from '../../redux/auth/selectors.js';

import css from './Header.module.css';

const Header = ({ className }) => {
  const isLoggedIn = useSelector(selectIsLoggedIn);

  return (
    <header className={clsx(css.header, className)}>
      <NavLink to="/">
        <img src={logo} alt="logo" height="85px" width="120px" />
      </NavLink>
      {isLoggedIn && (
        <>
          <Navigation />
          <UserMenu />
        </>
      )}
      {!isLoggedIn && (
        <NavLink
          to="/auth"
          className={({ isActive }) => clsx(css.link, isActive && css.active)}
        >
          Sign Up
        </NavLink>
      )}
    </header>
  );
};

export default Header;
