import { NavLink } from 'react-router-dom';
import clsx from 'clsx';

import css from './Navigation.module.css';

const Navigation = () => {
  return (
    <nav className={css.navigation}>
      <NavLink
        to="/orders"
        className={({ isActive }) => clsx(css.link, isActive && css.active)}
      >
        Pedidos
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
