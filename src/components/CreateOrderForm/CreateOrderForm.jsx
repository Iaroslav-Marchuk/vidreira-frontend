import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';

import * as Yup from 'yup';

import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';

import OrderForm from '../OrderForm/OrderForm.jsx';
import OrderItemForm from '../OrderItemForm/OrderItemForm.jsx';
import Button from '../Button/Button.jsx';

import {
  createOrMergeOrder,
  getAllOrders,
} from '../../redux/orders/operations.js';

import css from './CreateOrderForm.module.css';

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

const CreateOrderForm = ({ onClose }) => {
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
      await dispatch(getAllOrders({ page: 1, perPage: 10 }));
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

export default CreateOrderForm;

// import { Formik, Form } from 'formik';
// import * as Yup from 'yup';
// import toast from 'react-hot-toast';
// import { useDispatch } from 'react-redux';

// import OrderForm from '../OrderForm/OrderForm.jsx';
// import OrderItemForm from '../OrderItemForm/OrderItemForm.jsx';
// import Button from '../Button/Button.jsx';

// import {
//   createOrMergeOrder,
//   getAllOrders,
//   updateOrder,
//   updateOrderItem,
// } from '../../redux/orders/operations.js';

// import css from './FormContainer.module.css';

// const OrderSchema = Yup.object().shape({
//   local: Yup.object().shape({
//     zona: Yup.string().required('Escolha uma opção.'),
//   }),
//   EP: Yup.number()
//     .positive('O valor deve ser um número positivo.')
//     .integer('Valida se um número é um inteiro.')
//     .required('Campo obrigatório'),
//   cliente: Yup.string()
//     .min(3, 'Mínimo 3 caracteres')
//     .max(40, 'Máximo de 40 caracteres')
//     .required('Campo obrigatório'),
// });

// const ItemSchema = Yup.object().shape({
//   category: Yup.string().required('Escolha uma opção.'),
//   type: Yup.string().required('Escolha uma opção.'),
//   sizeX: Yup.number()
//     .typeError('Deve ser um número')
//     .positive('Deve ser positivo')
//     .integer('Deve ser inteiro')
//     .required('Campo obrigatório'),
//   sizeY: Yup.number()
//     .typeError('Deve ser um número')
//     .positive('Deve ser positivo')
//     .integer('Deve ser inteiro')
//     .required('Campo obrigatório'),
//   sizeZ: Yup.string()
//     .required('Escolha uma opção.')
//     .min(1, 'Mínimo 1 caractere')
//     .max(20, 'Máximo 20 caracteres'),
//   quantity: Yup.number()
//     .typeError('Deve ser um número')
//     .positive('Deve ser positivo')
//     .integer('Deve ser inteiro')
//     .required('Campo obrigatório'),
//   reason: Yup.string()
//     .min(3, 'Mínimo 3 caracteres')
//     .max(40, 'Máximo de 40 caracteres')
//     .required('Campo obrigatório'),
//   temper: Yup.boolean(),
// });

// const GeneralOrderSchema = OrderSchema.shape({
//   items: Yup.array().of(ItemSchema),
// });

// const FormContainer = ({
//   initialOrder,
//   orderId,
//   itemId,
//   mode = 'create',
//   onClose,
// }) => {
//   const dispatch = useDispatch();

//   // --- Initial values ---
//   const createInitialValues = {
//     EP: '',
//     cliente: '',
//     local: { zona: '', operator: '' },
//     items: [
//       {
//         category: '',
//         type: '',
//         temper: false,
//         sizeX: 0,
//         sizeY: 0,
//         sizeZ: '',
//         quantity: 1,
//         reason: '',
//       },
//     ],
//   };

//   const getOrderInitialValues = (order = {}) => ({
//     EP: order.EP,
//     cliente: order.cliente,
//     local: { zona: order.local.zona, operator: order.local?.operator },
//   });

//   const getItemInitialValues = (item = {}) => ({
//     category: item.category,
//     type: item.type,
//     temper: item.temper,
//     sizeX: item.sizeX,
//     sizeY: item.sizeY,
//     sizeZ: item.sizeZ,
//     quantity: item.quantity,
//     reason: item.reason,
//   });

//   const initialValuesMap = {
//     create: createInitialValues,
//     editGeneral: getOrderInitialValues(initialOrder),
//     editItem: getItemInitialValues(initialOrder),
//   };

//   // --- Validation schemas ---
//   const validationSchemaMap = {
//     create: GeneralOrderSchema,
//     editGeneral: OrderSchema,
//     editItem: ItemSchema,
//   };

//   // --- Submit actions ---
//   const submitActions = {
//     create: async values => {
//       const payload = {
//         ...values,
//         items: values.items.map(item => ({
//           ...item,
//           temper: Boolean(item.temper),
//           sizeX: Number(item.sizeX),
//           sizeY: Number(item.sizeY),
//           sizeZ: String(item.sizeZ),
//           quantity: Number(item.quantity),
//         })),
//       };
//       await dispatch(createOrMergeOrder(payload)).unwrap();
//       dispatch(getAllOrders({ page: 1, perPage: 10 }));
//       toast.success('Order created successfully!');
//     },
//     editGeneral: async values => {
//       const payload = {
//         EP: Number(values.EP),
//         cliente: values.cliente,
//         local: { zona: values.local.zona, operator: values.local.operator },
//       };
//       await dispatch(updateOrder({ orderId, values: payload })).unwrap();
//       toast.success('Order general info updated successfully!');
//     },
//     editItem: async values => {
//       const payload = {
//         ...values,
//         temper: Boolean(values.temper),
//         sizeX: Number(values.sizeX),
//         sizeY: Number(values.sizeY),
//         sizeZ: String(values.sizeZ),
//         quantity: Number(values.quantity),
//       };
//       await dispatch(
//         updateOrderItem({ orderId, itemId, values: payload })
//       ).unwrap();
//       toast.success('Order item updated successfully!');
//     },
//   };

//   const handleSubmit = async (values, actions) => {
//     try {
//       await submitActions[mode](values);
//       actions.resetForm();
//       onClose();
//     } catch (error) {
//       toast.error(`Failed: ${error}`);
//     }
//   };

//   // --- Components map ---
//   const formComponentsMap = {
//     create: [
//       { component: OrderForm, props: { isEditMode: false } },
//       { component: OrderItemForm, props: { singleItemMode: false } },
//     ],
//     editGeneral: [{ component: OrderForm, props: { isEditMode: true } }],
//     editItem: [{ component: OrderItemForm, props: { singleItemMode: true } }],
//   };

//   const submitButtonText = {
//     create: 'Submit',
//     editGeneral: 'Update General Info',
//     editItem: 'Update Item',
//   };

//   return (
//     <Formik
//       initialValues={initialValuesMap[mode]}
//       validationSchema={validationSchemaMap[mode]}
//       onSubmit={handleSubmit}
//       validateOnBlur
//       validateOnChange={false}
//     >
//       {() => (
//         <Form className={css.form}>
//           {formComponentsMap[mode].map((item, index) => {
//             const Component = item.component;
//             return <Component key={index} {...item.props} />;
//           })}
//           <Button type="submit" className={css.button}>
//             {submitButtonText[mode]}
//           </Button>
//         </Form>
//       )}
//     </Formik>
//   );
// };

// export default FormContainer;
