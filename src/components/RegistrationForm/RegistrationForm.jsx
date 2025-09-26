import { Field, Form, Formik, ErrorMessage } from 'formik';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { UserRound, KeyRound } from 'lucide-react';

import Button from '../Button/Button.jsx';
import Loader from '../Loader/Loader.jsx';

import { register } from '../../redux/auth/operations.js';
import { selectIsLoading } from '../../redux/auth/selectors.js';

import css from './RegistrationForm.module.css';

const RegistrationForm = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectIsLoading);

  const handleSubmit = async (values, actions) => {
    if (!values.name) {
      toast.error('Fill all fields, please');
      actions.setSubmitting(false);
      return;
    }

    try {
      await dispatch(register(values)).unwrap();
      toast.success('Registered successfully!');
      actions.resetForm();
    } catch (error) {
      toast.error('Failed to register.' + error);
    }
  };

  return (
    <>
      {isLoading && <Loader loadingState={true} />}
      <Formik
        initialValues={{ name: '', role: '', password: '' }}
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
              />
              <label className={css.formLabel} htmlFor="name">
                Nome
              </label>
              <UserRound className={css.inputIcon} />
            </div>

            <ErrorMessage name="name" component="div" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <Field className={css.formInput} as="select" name="role">
              <option value="" disabled>
                Escolha o seu cargo
              </option>
              <option value="corte">Corte</option>
              <option value="duplo">Duplo</option>
              <option value="guest">Visitante</option>
            </Field>
          </div>

          <div className={css.formGroup}>
            <div className={css.input}>
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
              <KeyRound className={css.inputIcon} />
            </div>

            <ErrorMessage
              name="password"
              component="div"
              className={css.error}
            />
          </div>

          <Button type="submit">Registar</Button>
        </Form>
      </Formik>
    </>
  );
};

export default RegistrationForm;
