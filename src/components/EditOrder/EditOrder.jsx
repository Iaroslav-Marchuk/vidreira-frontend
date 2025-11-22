import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import OrderForm from '../OrderForm/OrderForm.jsx';
import OrderItemForm from '../OrderItemForm/OrderItemForm.jsx';
import Button from '../Button/Button.jsx';

import {
  selectClientsList,
  selectisClientsLoading,
} from '../../redux/clients/selectors.js';
import { selectGlassOptions } from '../../redux/glass/selectors.js';

import css from './EditOrder.module.css';

const EditOrder = ({ order, onSubmit }) => {
  const { t } = useTranslation();
  const clientsList = useSelector(selectClientsList);
  const isClientsLoading = useSelector(selectisClientsLoading);

  const glassOptions = useSelector(selectGlassOptions);

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
    EP: Yup.number()
      .typeError(t('NUMBER_ERROR'))
      .positive(t('POSITIVE_NUMBER'))
      .integer(t('INTEGER_NUMBER'))
      .required(t('REQUIRED')),
    client: Yup.string()
      .oneOf(clientsList.map(c => c.name))
      .required(t('SELECT_OPTION')),
    local: Yup.object().shape({
      zona: Yup.string().required(t('SELECT_OPTION')),
    }),
    items: Yup.array().of(
      Yup.object().shape({
        category: Yup.string().required(t('SELECT_OPTION')),
        type: Yup.string().required(t('SELECT_OPTION')),
        sizeX: Yup.number()
          .typeError(t('NUMBER_ERROR'))
          .positive(t('POSITIVE_NUMBER'))
          .integer(t('INTEGER_NUMBER'))
          .required(t('REQUIRED')),
        sizeY: Yup.number()
          .typeError(t('NUMBER_ERROR'))
          .positive(t('POSITIVE_NUMBER'))
          .integer(t('INTEGER_NUMBER'))
          .required(t('REQUIRED')),
        sizeZ: Yup.string()
          .required(t('SELECT_OPTION'))
          .min(1, t('MIN_1'))
          .max(20, t('MAX_20')),
        quantity: Yup.number()
          .typeError(t('NUMBER_ERROR'))
          .positive(t('POSITIVE_NUMBER'))
          .integer(t('INTEGER_NUMBER'))
          .required(t('REQUIRED')),
        reason: Yup.string()
          .min(3, t('MIN_3'))
          .max(40, t('MAX_40'))
          .required(t('REQUIRED')),
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
            glassOptions={glassOptions}
            values={{ items: [newItem] }}
            setFieldValue={(field, value) =>
              setNewItem(prev => ({
                ...prev,
                [field.split('.').pop()]: value,
              }))
            }
          />

          <Button className={css.button} type="submit">
            {t('UPDATE')}
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default EditOrder;
