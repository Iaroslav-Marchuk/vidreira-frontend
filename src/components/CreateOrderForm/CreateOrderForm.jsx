import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import OrderForm from '../OrderForm/OrderForm.jsx';
import OrderItemForm from '../OrderItemForm/OrderItemForm.jsx';
import Button from '../Button/Button.jsx';

import { createOrder, getAllOrders } from '../../redux/orders/operations.js';

import {
  selectClientsList,
  selectisClientsLoading,
} from '../../redux/clients/selectors.js';

import css from './CreateOrderForm.module.css';

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
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const clientsList = useSelector(selectClientsList);
  const isClientsLoading = useSelector(selectisClientsLoading);

  const OrderSchema = Yup.object().shape({
    local: Yup.object().shape({
      zona: Yup.string().required(t('SELECT_OPTION')),
    }),
    EP: Yup.number()
      .positive(t('POSITIVE_NUMBER'))
      .integer(t('INTEGER_NUMBER'))
      .required(t('REQUIRED')),
    client: Yup.string()
      .oneOf(
        clientsList.map(c => c.name),
        t('SELECT_OPTION')
      )
      .required(t('REQUIRED')),
    items: Yup.array().of(
      Yup.object().shape({
        category: Yup.string().required(t('SELECT_OPTION')),
        type: Yup.string().required(t('SELECT_OPTION')),
        sizeX: Yup.number()
          .transform(value => (value === '' ? undefined : Number(value)))
          .typeError(t('NUMBER_ERROR'))
          .positive(t('POSITIVE_NUMBER'))
          .integer(t('INTEGER_NUMBER'))
          .required(t('REQUIRED')),
        sizeY: Yup.number()
          .transform(value => (value === '' ? undefined : Number(value)))
          .typeError(t('NUMBER_ERROR'))
          .positive(t('POSITIVE_NUMBER'))
          .integer(t('INTEGER_NUMBER'))
          .required(t('REQUIRED')),
        sizeZ: Yup.string()
          .required(t('SELECT_OPTION'))
          .min(1, t('MIN_1'))
          .max(20, t('MAX_20')),
        quantity: Yup.number()
          .transform(value => (value === '' ? undefined : Number(value)))
          .typeError(t('NUMBER_ERROR'))
          .positive(t('POSITIVE_NUMBER'))
          .integer(t('INTEGER_NUMBER'))
          .required(t('REQUIRED')),
        reason: Yup.string()
          .min(3, t('MIN_3'))
          .max(40, t('MAX_40'))
          .required(t('REQUIRED')),
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
      toast.success(t('ORDER_ADDED'));
      actions.resetForm();
      onClose();
    } catch (error) {
      const errorMessage = error || t('ORDER_EXIST');
      toast.error(`${t('ORDER_FAILED')} ${errorMessage}`);
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
              {t('SUBMIT')}
            </Button>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default CreateOrderForm;
