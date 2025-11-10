import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Menu } from 'lucide-react';
import clsx from 'clsx';

import logo from '../../assets/logo.png';

import Navigation from '../Navigation/Navigation.jsx';
import UserMenu from '../UserMenu/UserMenu.jsx';

import { selectIsLoggedIn } from '../../redux/auth/selectors.js';

import css from './Header.module.css';
import MobileMenu from '../MobileMenu/MobileMenu.jsx';
import { useState } from 'react';
import ModalSideBar from '../ModalSideBar/ModalSideBar.jsx';

const Header = ({ className }) => {
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const [mobileMenuIsOpen, setMobileMenuIsOpen] = useState(false);
  const openMobileMenu = () => setMobileMenuIsOpen(true);
  const closeMobileMenu = () => {
    setMobileMenuIsOpen(false);
  };

  const handleClick = () => {
    openMobileMenu();
  };

  return (
    <header className={clsx(css.header, className)}>
      <NavLink to="/">
        <img src={logo} alt="logo" className={css.logo} />
      </NavLink>
      {isLoggedIn && (
        <>
          <Navigation />
          <UserMenu />
          <button className={css.burgerBtn} onClick={handleClick}>
            <Menu size={32} color={'#163259'} strokeWidth={2} />
          </button>
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

      <ModalSideBar isOpen={mobileMenuIsOpen} onClose={closeMobileMenu}>
        <MobileMenu onClose={closeMobileMenu} />
      </ModalSideBar>
    </header>
  );
};

export default Header;
