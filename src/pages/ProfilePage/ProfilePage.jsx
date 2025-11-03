import { useDispatch, useSelector } from 'react-redux';

import { IoExitOutline } from 'react-icons/io5';

import { selectUser } from '../../redux/auth/selectors.js';
import { logout } from '../../redux/auth/operations.js';

import css from './ProfilePage.module.css';
import { useEffect } from 'react';
import {
  selectIsHistoryLoading,
  selectUserHistory,
} from '../../redux/orders/selectors.js';
import { getUserHistory } from '../../redux/orders/operations.js';
import { formatHistoryEntry } from '../../utils/formatHistory.js';
import Loader from '../../components/Loader/Loader.jsx';

const ProfilePage = () => {
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
            <span className={css.span}>Nome do utilizador:</span> {user.name}
          </li>
          <li className={css.item}>
            <span className={css.span}>Role do utilizador:</span> {user.role}
          </li>
          <li className={css.item}>
            <span className={css.span}>Na plataforma desde:</span>{' '}
            {new Date(user.createdAt).toLocaleDateString('pt-PT', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            })}
          </li>
        </ul>
        <button className={css.btn} type="submit" onClick={handleLogout}>
          <IoExitOutline className={css.svg} />
          Sair
        </button>
      </div>
      {/* <div className={css.activityWrapper}>
        <h2 className={css.title}>Ùltima atividade</h2>
        {isHistoryLoading ? (
          <Loader loadingstate={isHistoryLoading} />
        ) : (
          <ul className={css.historyList}>
            {userHistory.map((h, index) => {
              return formatHistoryEntry(h, { simplified: true }).map(
                (line, i) => (
                  <li key={`${index}-${i}`} className={css.historyItem}>
                    {line}
                  </li>
                )
              );
            })}
          </ul>
        )}
      </div> */}
      <div className={css.activityWrapper}>
        <h2 className={css.title}>Última atividade</h2>
        {isHistoryLoading ? (
          <Loader loadingstate={isHistoryLoading} />
        ) : userHistory.length === 0 ? (
          <p className={css.noHistory}>Sem dados de atividade do utilizador.</p>
        ) : (
          <ul className={css.historyList}>
            {userHistory.map((h, index) => {
              return formatHistoryEntry(h, { simplified: true }).map(
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
