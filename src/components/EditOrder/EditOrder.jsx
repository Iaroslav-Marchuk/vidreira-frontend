import * as Yup from 'yup';

import { Formik, Form } from 'formik';

import css from './EditOrder.module.css';

import OrderForm from '../OrderForm/OrderForm.jsx';
import Button from '../Button/Button.jsx';
import { useSelector } from 'react-redux';
import { selectClientsList } from '../../redux/orders/selectors.js';

const EditOrder = ({ order, onSubmit }) => {
  const clientsList = useSelector(selectClientsList);

  const OrderSchema = Yup.object().shape({
    local: Yup.object().shape({
      zona: Yup.string().required('Escolha uma opção.'),
    }),
    EP: Yup.number()
      .positive('O valor deve ser um número positivo.')
      .integer('Valida se um número é um inteiro.')
      .required('Campo obrigatório'),
    cliente: Yup.string()
      .oneOf(
        clientsList.map(c => c.name),
        'Escolhe o cliente'
      )
      .required('Campo obrigatório'),
  });

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
