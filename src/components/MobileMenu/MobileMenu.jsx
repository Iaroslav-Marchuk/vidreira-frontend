import { NavLink } from 'react-router-dom';
import { IoExitOutline } from 'react-icons/io5';
import clsx from 'clsx';
import { useDispatch } from 'react-redux';

import { logout } from '../../redux/auth/operations.js';

import css from './MobileMenu.module.css';

const MobileMenu = ({ onClose }) => {
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
        Home
      </NavLink>
      <NavLink
        to="/archive"
        className={({ isActive }) => clsx(css.link, isActive && css.active)}
        onClick={onClose}
      >
        Arquivo de pedidos
      </NavLink>
      <NavLink
        to="/orders"
        className={({ isActive }) => clsx(css.link, isActive && css.active)}
        onClick={onClose}
      >
        Pedidos activos
      </NavLink>
      <NavLink
        to="/statistics"
        className={({ isActive }) => clsx(css.link, isActive && css.active)}
        onClick={onClose}
      >
        Estatísticas
      </NavLink>
      <NavLink to="/profile" className={css.link} onClick={onClose}>
        Perfil do utilizador
      </NavLink>

      <button className={css.btn} type="submit" onClick={handleLogout}>
        <IoExitOutline className={css.svg} />
        Sair
      </button>
    </nav>
  );
};

export default MobileMenu;
