import { Field, ErrorMessage } from 'formik';
import { useSelector } from 'react-redux';

import { selectUser } from '../../redux/auth/selectors.js';

import css from './OrderForm.module.css';

const OrderForm = () => {
  const user = useSelector(selectUser);

  return (
    <div className={css.wrapper}>
      <fieldset className={css.fieldset}>
        <legend className={css.legend}>Local Info</legend>
        <label className={css.label}>
          Linha
          <Field className={css.selectLocal} as="select" name="local.zona">
            <option value="" disabled>
              --
            </option>
            <option value="L1">L1</option>
            <option value="L2">L2</option>
            <option value="L3">L3</option>
          </Field>
          <ErrorMessage
            className={css.error}
            name="local.zona"
            component="span"
          />
        </label>

        <label className={css.label}>
          Operador
          <input
            className={css.inputLocalOperator}
            value={user.name}
            readOnly
          />
        </label>
      </fieldset>

      <fieldset className={css.fieldset}>
        <legend className={css.legend}>Encomenda</legend>
        <label className={css.label}>
          EP
          <Field className={css.inputEncomenda} type="text" name="EP" />
          <ErrorMessage className={css.error} name="EP" component="span" />
        </label>

        <label className={css.label}>
          Cliente
          <Field className={css.inputCliente} type="text" name="cliente" />
          <ErrorMessage className={css.error} name="cliente" component="span" />
        </label>
      </fieldset>
    </div>
  );
};

export default OrderForm;
