import * as Yup from 'yup';
import { Formik, Form } from 'formik';
import { useTranslation } from 'react-i18next';

import Button from '../Button/Button.jsx';
import OrderItemForm from '../OrderItemForm/OrderItemForm.jsx';

import { useSelector } from 'react-redux';
import { selectGlassOptions } from '../../redux/glass/selectors.js';

import css from './EditItem.module.css';

const EditItem = ({ item, onSubmit }) => {
  const { t } = useTranslation();

  const ItemSchema = Yup.object().shape({
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

  const glassOptions = useSelector(selectGlassOptions);
  return (
    <Formik
      initialValues={{ items: [item] }}
      validationSchema={ItemSchema}
      validateOnBlur={true}
      validateOnChange={false}
      onSubmit={values => onSubmit(values.items[0])}
      enableReinitialize={true}
    >
      {() => (
        <Form className={css.form}>
          <OrderItemForm isEditItemMode={true} glassOptions={glassOptions} />
          <Button className={css.button} type="submit">
            {t('UPDATE')}
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default EditItem;
