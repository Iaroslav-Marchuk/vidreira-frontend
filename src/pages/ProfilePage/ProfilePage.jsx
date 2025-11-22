import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { LogOut } from 'lucide-react';

import Loader from '../../components/Loader/Loader.jsx';

import { selectUser } from '../../redux/auth/selectors.js';
import { logout } from '../../redux/auth/operations.js';
import {
  selectIsHistoryLoading,
  selectUserHistory,
} from '../../redux/orders/selectors.js';
import { getUserHistory } from '../../redux/orders/operations.js';

import { formatHistoryEntry } from '../../utils/formatHistory.js';

import css from './ProfilePage.module.css';

const ProfilePage = () => {
  const { t } = useTranslation();
  const user = useSelector(selectUser);
  const userHistory = useSelector(selectUserHistory);
  const isHistoryLoading = useSelector(selectIsHistoryLoading);

  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logout());
  };

  useEffect(() => {
    dispatch(getUserHistory());
  }, [dispatch]);

  return (
    <div className={css.wrapper}>
      <div className={css.profileWrapper}>
        <p className={css.avatar}>{user.name[0]}</p>
        <ul className={css.list}>
          <li className={css.item}>
            <span className={css.span}>{t('PROFILE_NAME')}</span> {user.name}
          </li>
          <li className={css.item}>
            <span className={css.span}>{t('PROFILE_ROLE')}</span>{' '}
            {t(`ROLE_${user.role}`)}
          </li>
          <li className={css.item}>
            <span className={css.span}>{t('PROFILE_ON_PLATFORM')}</span>{' '}
            {new Date(user.createdAt).toLocaleDateString('pt-PT', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            })}
          </li>
        </ul>
        <button className={css.btn} type="submit" onClick={handleLogout}>
          {t('EXIT')} <LogOut />
        </button>
      </div>

      <div className={css.activityWrapper}>
        <h2 className={css.title}>{t('PROFILE_ACTIVITY')}</h2>
        {isHistoryLoading ? (
          <Loader loadingstate={isHistoryLoading} />
        ) : userHistory.length === 0 ? (
          <p className={css.noHistory}>{t('PROFILE_NO_DATA')}</p>
        ) : (
          <ul className={css.historyList}>
            {userHistory.map((h, index) => {
              return formatHistoryEntry(h, { simplified: true }, t).map(
                (line, i) => (
                  <li key={`${index}-${i}`} className={css.historyItem}>
                    {line}
                  </li>
                )
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
