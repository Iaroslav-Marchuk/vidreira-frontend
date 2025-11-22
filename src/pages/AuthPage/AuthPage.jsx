import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import LoginForm from '../../components/LoginForm/LoginForm.jsx';
import RegisterForm from '../../components/RegistrationForm/RegistrationForm.jsx';

import {
  selectIsRolesLoading,
  selectRolesList,
} from '../../redux/roles/selectors.js';
import { getAllRoles } from '../../redux/roles/operations.js';
import css from './AuthPage.module.css';

const AuthPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [formType, setFormType] = useState('login');
  const handleLoginForm = () => setFormType('login');
  const handleRegisterForm = () => setFormType('register');

  const rolesList = useSelector(selectRolesList);
  const isRolesLoading = useSelector(selectIsRolesLoading);

  useEffect(() => {
    if (!rolesList.length && !isRolesLoading) {
      dispatch(getAllRoles());
    }
  }, [dispatch, rolesList.length, isRolesLoading]);

  return (
    <>
      <div className={css.btnWrapper}>
        <button
          onClick={handleLoginForm}
          className={clsx(
            formType === 'login' ? css.activeTab : css.passiveTab
          )}
        >
          {t('LOGIN')}
        </button>
        <button
          onClick={handleRegisterForm}
          className={clsx(
            formType === 'register' ? css.activeTab : css.passiveTab
          )}
        >
          {t('REGISTRATION')}
        </button>
      </div>

      {formType === 'login' && <LoginForm />}
      {formType === 'register' && <RegisterForm rolesList={rolesList} />}
    </>
  );
};

export default AuthPage;
