import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import css from './Navigation.module.css';

const Navigation = () => {
  const { t } = useTranslation();

  return (
    <nav className={css.navigation}>
      <NavLink
        to="/archive"
        className={({ isActive }) => clsx(css.link, isActive && css.active)}
      >
        {t('ARCHIVE')}
      </NavLink>
      <NavLink
        to="/orders"
        className={({ isActive }) => clsx(css.link, isActive && css.active)}
      >
        {t('ACTIVE_ORDERS')}
      </NavLink>
      <NavLink
        to="/statistics"
        className={({ isActive }) => clsx(css.link, isActive && css.active)}
      >
        {t('STATISTICS')}
      </NavLink>
    </nav>
  );
};

export default Navigation;
