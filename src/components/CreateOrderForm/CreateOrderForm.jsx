import { Formik, Form } from 'formik';

import * as Yup from 'yup';

import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';

import OrderForm from '../OrderForm/OrderForm.jsx';
import OrderItemForm from '../OrderItemForm/OrderItemForm.jsx';
import Button from '../Button/Button.jsx';

import { createOrder, getAllOrders } from '../../redux/orders/operations.js';

import css from './CreateOrderForm.module.css';
import {
  selectClientsList,
  selectisClientsLoading,
} from '../../redux/clients/selectors.js';

const initialValues = {
  EP: '',
  client: '',
  local: {
    zona: '',
    operator: '',
  },
  items: [
    {
      category: '',
      type: '',
      temper: false,
      sizeX: 0,
      sizeY: 0,
      sizeZ: '',
      quantity: 1,
      reason: '',
    },
  ],
};

const CreateOrderForm = ({ glassOptions, onClose }) => {
  const dispatch = useDispatch();

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
    client: Yup.string()
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

  const handleSubmit = async (values, actions) => {
    const payload = {
      EP: Number(values.EP),
      client: values.client,
      local: {
        zona: values.local.zona,
      },
      items: values.items.map(item => ({
        category: item.category,
        type: item.type,
        temper: Boolean(item.temper),
        sizeX: Number(item.sizeX),
        sizeY: Number(item.sizeY),
        sizeZ: String(item.sizeZ),
        quantity: Number(item.quantity),
        reason: item.reason,
      })),
    };

    try {
      await dispatch(createOrder(payload)).unwrap();
      await dispatch(getAllOrders({ page: 1, perPage: 10 }));
      toast.success('Order added successfully!');
      actions.resetForm();
      onClose();
    } catch (error) {
      const errorMessage =
        error || 'Order with this EP and client already exists';
      toast.error('Failed to add new order: ' + errorMessage);
    }
  };

  return (
    <>
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
              values={values}
              setFieldValue={setFieldValue}
              clientsList={clientsList}
              isClientsLoading={isClientsLoading}
            />
            <OrderItemForm
              glassOptions={glassOptions}
              values={values}
              setFieldValue={setFieldValue}
            />
            <Button className={css.button} type="submit">
              Submit
            </Button>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default CreateOrderForm;
