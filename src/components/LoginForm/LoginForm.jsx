import { Field, Form, Formik, ErrorMessage } from 'formik';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { UserRound, KeyRound } from 'lucide-react';

import Button from '../Button/Button.jsx';
import Loader from '../Loader/Loader.jsx';

import { login } from '../../redux/auth/operations.js';
import { selectIsUserLoading } from '../../redux/auth/selectors.js';

import css from './LoginForm.module.css';

const LoginForm = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const isUserLoading = useSelector(selectIsUserLoading);

  const handleSubmit = async (values, actions) => {
    if (!values.name || !values.password) {
      toast.error(t('FILL_FIELDS'));
      actions.setSubmitting(false);
      return;
    }

    try {
      await dispatch(login(values)).unwrap();
      toast.success(t('LOGIN_SUCCESS'));
      actions.resetForm();
    } catch (error) {
      toast.error(t('LOGIN_ERROR') + error);
    }
  };

  return (
    <>
      {isUserLoading && <Loader loadingState={true} />}
      <Formik
        initialValues={{ name: '', password: '' }}
        onSubmit={handleSubmit}
      >
        <Form className={css.form}>
          <div className={css.formGroup}>
            <div className={css.input}>
              <Field
                className={css.formInput}
                type="text"
                name="name"
                id="name"
                placeholder=" "
                autoComplete="username"
              />
              <label className={css.formLabel} htmlFor="name">
                {t('NAME')}
              </label>
              <UserRound className={css.inputIcon} />
            </div>

            <ErrorMessage name="name" component="div" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <div className={css.input}>
              <Field
                className={css.formInput}
                type="password"
                name="password"
                id="password"
                placeholder=" "
                autoComplete="current-password"
              />
              <label className={css.formLabel} htmlFor="password">
                {t('PASSWORD')}
              </label>
              <KeyRound className={css.inputIcon} />
            </div>
            <ErrorMessage
              name="password"
              component="div"
              className={css.error}
            />
          </div>

          <Button type="submit">{t('ENTER')}</Button>
        </Form>
      </Formik>
    </>
  );
};

export default LoginForm;
