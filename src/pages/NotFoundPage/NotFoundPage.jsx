import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import css from './NotFoundPage.module.css';

const NotFoundPage = () => {
  const { t } = useTranslation();

  return (
    <div className={css.wrapper}>
      <h1 className={css.title}>404</h1>
      <p className={css.text}>{t('NOT_FOUND_TEXT')}</p>
      <NavLink to="/" className={css.link}>
        {t('NOT_FOUND_LINK')}
      </NavLink>
    </div>
  );
};

export default NotFoundPage;
