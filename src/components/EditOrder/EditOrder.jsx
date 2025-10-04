import * as Yup from 'yup';

import { Formik, Form } from 'formik';

import css from './EditOrder.module.css';

import OrderForm from '../OrderForm/OrderForm.jsx';
import Button from '../Button/Button.jsx';

const OrderSchema = Yup.object().shape({
  local: Yup.object().shape({
    zona: Yup.string().required('Escolha uma opção.'),
  }),
  EP: Yup.number()
    .positive('O valor deve ser um número positivo.')
    .integer('Valida se um número é um inteiro.')
    .required('Campo obrigatório'),
  cliente: Yup.string()
    .min(3, 'Mínimo 3 caracteres')
    .max(40, 'Máximo de 40 caracteres')
    .required('Campo obrigatório'),
});

const EditOrder = ({ order, onSubmit }) => {
  const initialValues = {
    EP: order.EP,
    cliente: order.cliente,
    local: {
      zona: order.local.zona,
      operator: order.local.operator,
    },
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={OrderSchema}
      validateOnBlur={true}
      validateOnChange={false}
      onSubmit={onSubmit}
    >
      {() => (
        <Form className={css.form}>
          <OrderForm />
          <Button className={css.button} type="submit">
            Update
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default EditOrder;
