import { useDispatch, useSelector } from 'react-redux';

import { IoExitOutline } from 'react-icons/io5';

import { selectUser } from '../../redux/auth/selectors.js';
import { logout } from '../../redux/auth/operations.js';

import css from './ProfilePage.module.css';

const ProfilePage = () => {
  const user = useSelector(selectUser);

  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logout());
  };

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
      <div className={css.activityWrapper}>
        <h2 className={css.title}>Ùltima atividade</h2>
      </div>
    </div>
  );
};

export default ProfilePage;
