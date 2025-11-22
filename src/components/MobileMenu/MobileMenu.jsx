import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { LogOut, UserRoundCog } from 'lucide-react';

import { logout } from '../../redux/auth/operations.js';

import css from './MobileMenu.module.css';

const MobileMenu = ({ onClose }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      onClose();
    } catch (error) {
      error('Failed to log out. ' + error);
    }
  };
  return (
    <nav className={css.navigation}>
      <NavLink to="/" className={css.link} onClick={onClose}>
        {t('HOME')}
      </NavLink>
      <NavLink
        to="/archive"
        className={({ isActive }) => clsx(css.link, isActive && css.active)}
        onClick={onClose}
      >
        {t('ARCHIVE')}
      </NavLink>
      <NavLink
        to="/orders"
        className={({ isActive }) => clsx(css.link, isActive && css.active)}
        onClick={onClose}
      >
        {t('ACTIVE_ORDERS')}
      </NavLink>
      <NavLink
        to="/statistics"
        className={({ isActive }) => clsx(css.link, isActive && css.active)}
        onClick={onClose}
      >
        {t('STATISTICS')}
      </NavLink>
      <NavLink to="/profile" className={css.link} onClick={onClose}>
        <UserRoundCog size={16} /> {t('PROFILE')}
      </NavLink>

      <button className={css.btn} type="submit" onClick={handleLogout}>
        {t('EXIT')}
        <LogOut size={16} />
      </button>
    </nav>
  );
};

export default MobileMenu;
