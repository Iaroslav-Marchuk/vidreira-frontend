import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';

import OrderForm from '../OrderForm/OrderForm.jsx';
import OrderItemForm from '../OrderItemForm/OrderItemForm.jsx';
import Button from '../Button/Button.jsx';

import { createOrMergeOrder } from '../../redux/orders/operations.js';

import css from './FormContainer.module.css';

const initialValues = {
  EP: '',
  cliente: '',
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

const FormContainer = ({ onClose }) => {
  const dispatch = useDispatch();

  const handleSubmit = async (values, actions) => {
    const payload = {
      EP: Number(values.EP),
      cliente: values.cliente,
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
      await dispatch(createOrMergeOrder(payload)).unwrap();
      toast.success('Order added successfully!');
      actions.resetForm();
      onClose();
    } catch (error) {
      toast.error('Failed to add new order: ' + error);
    }
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
          <OrderForm values={values} setFieldValue={setFieldValue} />
          <OrderItemForm values={values} setFieldValue={setFieldValue} />
          <Button className={css.button} type="submit">
            Submit
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default FormContainer;
