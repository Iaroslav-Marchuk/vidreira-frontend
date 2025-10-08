import * as Yup from 'yup';

import { Formik, Form } from 'formik';

import css from './EditOrder.module.css';

import OrderForm from '../OrderForm/OrderForm.jsx';
import Button from '../Button/Button.jsx';
import { useSelector } from 'react-redux';
import {
  selectClientsList,
  selectisClientsLoading,
} from '../../redux/orders/selectors.js';
import OrderItemForm from '../OrderItemForm/OrderItemForm.jsx';

const EditOrder = ({ order, onSubmit }) => {
  const clientsList = useSelector(selectClientsList);
  const isClientsLoading = useSelector(selectisClientsLoading);

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
    items: Yup.array().of(
      Yup.object().shape({
        category: Yup.string().required('Escolha uma opção.'),
        type: Yup.string().required('Escolha uma opção.'),
        sizeX: Yup.number()
          .transform(value => (value === '' ? undefined : Number(value)))
          .typeError('Deve ser um número')
          .positive('Deve ser positivo')
          .integer('Deve ser inteiro')
          .required('Campo obrigatório'),
        sizeY: Yup.number()
          .transform(value => (value === '' ? undefined : Number(value)))
          .typeError('Deve ser um número')
          .positive('Deve ser positivo')
          .integer('Deve ser inteiro')
          .required('Campo obrigatório'),
        sizeZ: Yup.string()
          .required('Escolha uma opção.')
          .min(1, 'Mínimo 1 caractere')
          .max(20, 'Máximo 20 caracteres'),
        quantity: Yup.number()
          .transform(value => (value === '' ? undefined : Number(value)))
          .typeError('Deve ser um número')
          .positive('Deve ser positivo')
          .integer('Deve ser inteiro')
          .required('Campo obrigatório'),
        reason: Yup.string()
          .min(3, 'Mínimo 3 caracteres')
          .max(40, 'Máximo de 40 caracteres')
          .required('Campo obrigatório'),
      })
    ),
  });

  const initialValues = {
    EP: order.EP,
    cliente: order.cliente.name,
    local: {
      zona: order.local.zona,
      operator: order.local.operator,
    },
    items: order.items,
  };

  const handleSubmit = values => {
    const payload = {
      EP: Number(values.EP),
      cliente: values.cliente,
      local: { zona: values.local.zona },
      items: values.items.map(item => ({
        ...item,
        sizeX: Number(item.sizeX),
        sizeY: Number(item.sizeY),
        quantity: Number(item.quantity),
        temper: Boolean(item.temper),
        sizeZ: String(item.sizeZ),
      })),
    };

    onSubmit(payload);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={OrderSchema}
      validateOnBlur={true}
      validateOnChange={false}
      onSubmit={handleSubmit}
    >
      {({ values, setFieldValue }) => (
        <Form className={css.form}>
          <OrderForm
            clientsList={clientsList}
            isClientsLoading={isClientsLoading}
          />

          <OrderItemForm
            values={values}
            setFieldValue={setFieldValue}
            isEditMode={false}
          />

          <Button className={css.button} type="submit">
            Update
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default EditOrder;
