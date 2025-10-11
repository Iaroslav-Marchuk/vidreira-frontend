import * as Yup from 'yup';
import { Formik, Form } from 'formik';

import Button from '../Button/Button.jsx';
import OrderItemForm from '../OrderItemForm/OrderItemForm.jsx';

import css from './EditItem.module.css';

const ItemSchema = Yup.object().shape({
  items: Yup.array().of(
    Yup.object().shape({
      category: Yup.string().required('Escolha uma opção.'),
      type: Yup.string().required('Escolha uma opção.'),
      sizeX: Yup.number()
        .typeError('Deve ser um número')
        .positive('Deve ser positivo')
        .integer('Deve ser inteiro')
        .required('Campo obrigatório'),
      sizeY: Yup.number()
        .typeError('Deve ser um número')
        .positive('Deve ser positivo')
        .integer('Deve ser inteiro')
        .required('Campo obrigatório'),
      sizeZ: Yup.string()
        .required('Escolha uma opção.')
        .min(1, 'Mínimo 1 caractere')
        .max(20, 'Máximo 20 caracteres'),
      quantity: Yup.number()
        .typeError('Deve ser um número')
        .positive('Deve ser positivo')
        .integer('Deve ser inteiro')
        .required('Campo obrigatório'),
      reason: Yup.string()
        .min(3, 'Mínimo 3 caracteres')
        .max(40, 'Máximo de 40 caracteres')
        .required('Campo obrigatório'),
      temper: Yup.boolean(),
    })
  ),
});

const EditItem = ({ item, onSubmit }) => {
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
          <OrderItemForm isEditItemMode={true} />
          <Button className={css.button} type="submit">
            Update
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default EditItem;
