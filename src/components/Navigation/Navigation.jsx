import { NavLink } from 'react-router-dom';
import clsx from 'clsx';

import css from './Navigation.module.css';

const Navigation = () => {
  return (
    <nav className={css.navigation}>
      <NavLink
        to="/archive"
        className={({ isActive }) => clsx(css.link, isActive && css.active)}
      >
        Arquivo de pedidos
      </NavLink>
      <NavLink
        to="/orders"
        className={({ isActive }) => clsx(css.link, isActive && css.active)}
      >
        Pedidos activos
      </NavLink>
      <NavLink
        to="/statistics"
        className={({ isActive }) => clsx(css.link, isActive && css.active)}
      >
        Estatísticas
      </NavLink>
    </nav>
  );
};

export default Navigation;
