import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import { useSelector } from 'react-redux';

import OrderForm from '../OrderForm/OrderForm.jsx';
import OrderItemForm from '../OrderItemForm/OrderItemForm.jsx';
import Button from '../Button/Button.jsx';

import {
  selectClientsList,
  selectisClientsLoading,
} from '../../redux/orders/selectors.js';

import css from './EditOrder.module.css';

const EditOrder = ({ order, onSubmit }) => {
  const clientsList = useSelector(selectClientsList);
  const isClientsLoading = useSelector(selectisClientsLoading);

  const initialNewItem = {
    category: '',
    type: '',
    temper: false,
    sizeX: 0,
    sizeY: 0,
    sizeZ: '',
    quantity: 1,
    reason: '',
  };

  const [newItem, setNewItem] = useState(initialNewItem);

  const OrderSchema = Yup.object().shape({
    EP: Yup.number().positive().integer().required('Campo obrigatório'),
    client: Yup.string()
      .oneOf(clientsList.map(c => c.name))
      .required('Campo obrigatório'),
    local: Yup.object().shape({
      zona: Yup.string().required('Escolha uma opção.'),
    }),
    items: Yup.array().of(
      Yup.object().shape({
        category: Yup.string().required('Escolha uma opção.'),
        type: Yup.string().required('Escolha uma opção.'),
        sizeX: Yup.number().positive().integer().required('Campo obrigatório'),
        sizeY: Yup.number().positive().integer().required('Campo obrigatório'),
        sizeZ: Yup.string().min(1).max(20).required('Escolha uma opção.'),
        quantity: Yup.number()
          .positive()
          .integer()
          .required('Campo obrigatório'),
        reason: Yup.string().min(3).max(40).required('Campo obrigatório'),
        temper: Yup.boolean(),
      })
    ),
  });

  const initialValues = {
    EP: order.EP,
    client: order.client.name,
    local: {
      zona: order.local.zona,
      operator: order.local.operator,
    },
    items: [],
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={OrderSchema}
      enableReinitialize
      onSubmit={async (values, { setSubmitting }) => {
        try {
          await onSubmit(values);
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {() => (
        <Form className={css.form}>
          <OrderForm
            clientsList={clientsList}
            isClientsLoading={isClientsLoading}
          />

          <OrderItemForm
            values={{ items: [newItem] }}
            setFieldValue={(field, value) =>
              setNewItem(prev => ({
                ...prev,
                [field.split('.').pop()]: value,
              }))
            }
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
