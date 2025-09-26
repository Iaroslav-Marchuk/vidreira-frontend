import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';

import { glassOptions } from '../../constants/glassOptions.js';

import ModalOverlay from '../ModalOverlay/ModalOverlay.jsx';

import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../../redux/auth/selectors.js';

import css from './OrderForm.module.css';
import { createOrMergeOrder } from '../../redux/orders/operations.js';

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

const OrderForm = ({ isOpen, onClose }) => {
  const user = useSelector(selectUser);
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
    <ModalOverlay isOpen={isOpen} onClose={onClose}>
      <Formik
        initialValues={initialValues}
        validationSchema={OrderSchema}
        validateOnBlur={true}
        validateOnChange={false}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue }) => (
          <Form className={css.form}>
            <div className={css.wrapper}>
              <fieldset className={css.fieldset}>
                <legend className={css.legend}>Local Info</legend>
                <label className={css.label}>
                  Linha
                  <Field
                    className={css.selectLocal}
                    as="select"
                    name="local.zona"
                  >
                    <option value="" disabled>
                      --
                    </option>
                    <option value="L1">L1</option>
                    <option value="L2">L2</option>
                    <option value="L3">L3</option>
                  </Field>
                  <ErrorMessage
                    className={css.error}
                    name="local.zona"
                    component="span"
                  />
                </label>

                <label className={css.label}>
                  Operador
                  <input
                    className={css.inputLocalOperator}
                    value={user.name}
                    readOnly
                  />
                </label>
              </fieldset>

              <fieldset className={css.fieldset}>
                <legend className={css.legend}>Encomenda</legend>
                <label className={css.label}>
                  EP
                  <Field className={css.inputEncomenda} type="text" name="EP" />
                  <ErrorMessage
                    className={css.error}
                    name="EP"
                    component="span"
                  />
                </label>

                <label className={css.label}>
                  Cliente
                  <Field
                    className={css.inputCliente}
                    type="text"
                    name="cliente"
                  />
                  <ErrorMessage
                    className={css.error}
                    name="cliente"
                    component="span"
                  />
                </label>
              </fieldset>
            </div>

            <fieldset className={css.fieldsetArray}>
              <legend className={css.legend}>Vidro</legend>
              <FieldArray name="items">
                {({ remove, push }) => (
                  <>
                    {values.items.map((item, index) => (
                      <div className={css.row} key={index}>
                        <label className={css.label}>
                          Categoria
                          <Field
                            className={css.selectUnit}
                            as="select"
                            name={`items[${index}].category`}
                            onChange={e => {
                              const newCategory = e.target.value;

                              setFieldValue(
                                `items[${index}].category`,
                                newCategory
                              );
                              setFieldValue(`items[${index}].type`, '');
                              setFieldValue(`items[${index}].sizeZ`, '');
                              setFieldValue(`items[${index}].temper`, false);
                            }}
                          >
                            <option value="" disabled>
                              --
                            </option>
                            {Object.entries(glassOptions).map(
                              ([key, category]) => (
                                <option key={key} value={key}>
                                  {category.label}
                                </option>
                              )
                            )}
                          </Field>
                          <ErrorMessage
                            className={css.error}
                            name={`items[${index}].category`}
                            component="span"
                          />
                        </label>

                        <label className={css.label}>
                          Tipo
                          <Field
                            className={css.selectUnit}
                            as="select"
                            name={`items[${index}].type`}
                            disabled={!item.category}
                            onChange={e => {
                              const newType = e.target.value;
                              setFieldValue(`items[${index}].type`, newType);

                              const typeCfg =
                                glassOptions[item.category].types[newType];

                              if (typeCfg.temper === 'yes') {
                                setFieldValue(`items[${index}].temper`, true);
                              } else if (typeCfg.temper === 'no') {
                                setFieldValue(`items[${index}].temper`, false);
                              } else {
                                setFieldValue(`items[${index}].temper`, false);
                              }

                              setFieldValue(`items[${index}].sizeZ`, '');
                            }}
                          >
                            <option value="" disabled>
                              --
                            </option>
                            {item.category &&
                              Object.entries(
                                glassOptions[item.category].types
                              ).map(([key, type]) => (
                                <option key={key} value={key}>
                                  {type.label}
                                </option>
                              ))}
                          </Field>
                          <ErrorMessage
                            className={css.error}
                            name={`items[${index}].type`}
                            component="span"
                          />
                        </label>

                        <label className={css.label}>
                          Espressura
                          <Field
                            className={css.selectSizeZ}
                            as="select"
                            name={`items[${index}].sizeZ`}
                            disabled={!item.category}
                          >
                            <option value="" disabled>
                              --
                            </option>
                            {item.category &&
                              item.type &&
                              glassOptions[item.category].types[
                                item.type
                              ].thickness.map(t => (
                                <option key={t} value={t}>
                                  {t}
                                </option>
                              ))}
                          </Field>
                          <ErrorMessage
                            className={css.error}
                            name={`items[${index}].sizeZ`}
                            component="span"
                          />
                        </label>

                        <label className={css.label}>
                          Medida
                          <div className={css.inlineInputs}>
                            <div className={css.inputWrapper}>
                              <Field
                                className={css.inputSize}
                                type="text"
                                name={`items[${index}].sizeX`}
                              />
                              <ErrorMessage
                                className={css.error}
                                name={`items[${index}].sizeX`}
                                component="span"
                              />
                            </div>

                            <span className={css.multiply}>×</span>
                            <div className={css.inputWrapper}>
                              <Field
                                className={css.inputSize}
                                type="text"
                                name={`items[${index}].sizeY`}
                              />
                              <ErrorMessage
                                className={css.error}
                                name={`items[${index}].sizeY`}
                                component="span"
                              />
                            </div>
                          </div>
                        </label>

                        <label
                          className={css.label}
                          htmlFor={`temper-${index}`}
                        >
                          Temper
                          <Field
                            className={css.checkbox}
                            id={`temper-${index}`}
                            type="checkbox"
                            name={`items[${index}].temper`}
                            disabled={
                              item.category &&
                              item.type &&
                              glassOptions[item.category].types[item.type]
                                .temper !== 'both'
                            }
                          />
                        </label>

                        <label className={css.label}>
                          Quantidade
                          <Field
                            className={css.inputQuantity}
                            type="text"
                            name={`items[${index}].quantity`}
                          />
                          <ErrorMessage
                            className={css.error}
                            name={`items[${index}].quantity`}
                            component="span"
                          />
                        </label>

                        <label className={css.label}>
                          Motivo
                          <Field
                            className={css.textarea}
                            type="text"
                            name={`items[${index}].reason`}
                          />
                          <ErrorMessage
                            className={css.error}
                            name={`items[${index}].reason`}
                            component="span"
                          />
                        </label>

                        <button
                          className={`${css.button} ${css.buttonDelete}`}
                          type="button"
                          onClick={() => remove(index)}
                        >
                          delete
                        </button>
                      </div>
                    ))}
                    <div className={css.addWrapper}>
                      <button
                        className={`${css.button} ${css.buttonAdd}`}
                        type="button"
                        onClick={() =>
                          push({
                            category: '',
                            type: '',
                            temper: false,
                            sizeX: 0,
                            sizeY: 0,
                            sizeZ: '',
                            quantity: 1,
                            reason: '',
                          })
                        }
                      >
                        add
                      </button>
                    </div>
                  </>
                )}
              </FieldArray>
            </fieldset>
            <button
              className={`${css.button} ${css.buttonSubmit}`}
              type="submit"
            >
              Submit
            </button>
          </Form>
        )}
      </Formik>
    </ModalOverlay>
  );
};

export default OrderForm;
