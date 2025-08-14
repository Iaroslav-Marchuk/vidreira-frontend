import clsx from 'clsx';

import { useState } from 'react';

import Button from '../../components/Button/Button.jsx';
import LoginForm from '../../components/LoginForm/LoginForm.jsx';
import RegisterForm from '../../components/RegistrationForm/RegistrationForm.jsx';

import css from './AuthPage.module.css';

const AuthPage = () => {
  const [formType, setFormType] = useState('login');
  const handleLoginForm = () => setFormType('login');
  const handleRegisterForm = () => setFormType('register');

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
      {formType === 'register' && <RegisterForm />}
    </>
  );
};

export default AuthPage;
