import { Field, Form, Formik, ErrorMessage } from 'formik';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';

import Button from '../Button/Button.jsx';

import { login } from '../../redux/auth/operations.js';

import css from './LoginForm.module.css';

const LoginForm = () => {
  const dispatch = useDispatch();

  const handleSubmit = async (values, actions) => {
    if (!values.name || !values.password) {
      toast.error('Fill all fields, please');
      actions.setSubmitting(false);
      return;
    }

    try {
      await dispatch(login(values)).unwrap();
      toast.success('Logged in successfully!');
      actions.resetForm();
    } catch (error) {
      toast.error('Failed to log in. ' + error);
    }
  };

  return (
    <Formik initialValues={{ name: '', password: '' }} onSubmit={handleSubmit}>
      <Form className={css.form}>
        <div className={css.formGroup}>
          <Field
            className={css.formInput}
            type="text"
            name="name"
            id="name"
            placeholder=" "
          />
          <label className={css.formLabel} htmlFor="name">
            Nome
          </label>
          <ErrorMessage name="name" component="div" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <Field
            className={css.formInput}
            type="password"
            name="password"
            id="password"
            placeholder=" "
          />
          <label className={css.formLabel} htmlFor="password">
            Palvra passe
          </label>
          <ErrorMessage name="password" component="div" className={css.error} />
        </div>

        <Button type="submit">Entrar</Button>
      </Form>
    </Formik>
  );
};

export default LoginForm;
