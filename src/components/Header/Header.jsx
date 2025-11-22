import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Menu, UserRoundX } from 'lucide-react';
import clsx from 'clsx';
import { useState } from 'react';

import logo from '../../assets/logo.png';

import Navigation from '../Navigation/Navigation.jsx';
import UserMenu from '../UserMenu/UserMenu.jsx';
import MobileMenu from '../MobileMenu/MobileMenu.jsx';
import ModalSideBar from '../ModalSideBar/ModalSideBar.jsx';
import LangSwitcher from '../LangSwitcher/LangSwitcher.jsx';

import { selectIsLoggedIn } from '../../redux/auth/selectors.js';

import css from './Header.module.css';

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
        <div className={css.wrapper}>
          <Navigation />
          <UserMenu />
          <button className={css.burgerBtn} onClick={handleClick}>
            <Menu size={32} color={'#163259'} strokeWidth={2} />
          </button>
          <LangSwitcher />
        </div>
      )}
      {!isLoggedIn && (
        <div className={css.wrapper}>
          <NavLink to="/auth">
            <UserRoundX size={28} color="#0d7fc4" strokeWidth={2} />
          </NavLink>
          <LangSwitcher />
        </div>
      )}

      <ModalSideBar isOpen={mobileMenuIsOpen} onClose={closeMobileMenu}>
        <MobileMenu onClose={closeMobileMenu} />
      </ModalSideBar>
    </header>
  );
};

export default Header;
