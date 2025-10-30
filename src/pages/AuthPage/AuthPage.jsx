import clsx from 'clsx';

import { useEffect, useState } from 'react';

import LoginForm from '../../components/LoginForm/LoginForm.jsx';
import RegisterForm from '../../components/RegistrationForm/RegistrationForm.jsx';

import css from './AuthPage.module.css';
import { useDispatch, useSelector } from 'react-redux';

import {
  selectIsRolesLoading,
  selectRolesList,
} from '../../redux/roles/selectors.js';
import { getAllRoles } from '../../redux/roles/operations.js';

const AuthPage = () => {
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
          Login
        </button>
        <button
          onClick={handleRegisterForm}
          className={clsx(
            formType === 'register' ? css.activeTab : css.passiveTab
          )}
        >
          Register
        </button>
      </div>

      {formType === 'login' && <LoginForm />}
      {formType === 'register' && <RegisterForm rolesList={rolesList} />}
    </>
  );
};

export default AuthPage;
