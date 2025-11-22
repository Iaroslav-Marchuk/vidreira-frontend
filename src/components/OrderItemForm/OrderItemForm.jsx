import { Field, FieldArray, ErrorMessage, useFormikContext } from 'formik';
import { Trash2, CirclePlus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import css from './OrderItemForm.module.css';

const OrderItemForm = ({ glassOptions, isEditItemMode = false }) => {
  const { t } = useTranslation();
  const { values, setFieldValue } = useFormikContext();

  return (
    <fieldset className={css.fieldsetArray}>
      <legend className={css.legend}>{t('FORM_GLASS')}</legend>
      <FieldArray name="items">
        {({ remove, push }) => {
          return (
            <>
              {values.items.map((item, index) => (
                <div className={css.row} key={index}>
                  <label className={css.label}>
                    {t('FORM_CATEGORY')}
                    <Field
                      className={css.selectUnit}
                      as="select"
                      name={`items[${index}].category`}
                      onChange={e => {
                        const newCategory = e.target.value;

                        setFieldValue(`items[${index}].category`, newCategory);
                        setFieldValue(`items[${index}].type`, '');
                        setFieldValue(`items[${index}].sizeZ`, '');
                        setFieldValue(`items[${index}].temper`, false);
                      }}
                    >
                      <option value="" disabled>
                        --
                      </option>

                      <optgroup label="Monolítico">
                        {['incolor', 'colorido', 'impresso', 'fosco'].map(
                          key => (
                            <option key={key} value={key}>
                              {glassOptions[key].label}
                            </option>
                          )
                        )}
                      </optgroup>

                      <optgroup label="Laminado">
                        {[
                          'laminadoIncolor',
                          'laminadoSilence',
                          'laminadoOpalino',
                          'laminadoCor',
                          'laminadoCapa',
                        ].map(key => (
                          <option key={key} value={key}>
                            {glassOptions[key].label}
                          </option>
                        ))}
                      </optgroup>

                      <optgroup label="Com Revestimento">
                        {[
                          'espelhado',
                          'capa',
                          'capaSolar',
                          'coolLite',
                          'sunguard',
                        ].map(key => (
                          <option key={key} value={key}>
                            {glassOptions[key].label}
                          </option>
                        ))}
                      </optgroup>
                    </Field>
                    <ErrorMessage
                      className={css.error}
                      name={`items[${index}].category`}
                      component="span"
                    />
                  </label>

                  <label className={css.label}>
                    {t('FORM_TYPE')}
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
                        Object.entries(glassOptions[item.category].types).map(
                          ([key, type]) => (
                            <option key={key} value={key}>
                              {type.label}
                            </option>
                          )
                        )}
                    </Field>
                    <ErrorMessage
                      className={css.error}
                      name={`items[${index}].type`}
                      component="span"
                    />
                  </label>

                  <label className={css.label}>
                    {t('FORM_THIKNESS')}
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
                    {t('FORM_SIZE')}
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

                  <label className={css.label} htmlFor={`temper-${index}`}>
                    {t('FORM_TERM')}
                    <Field
                      className={css.checkbox}
                      id={`temper-${index}`}
                      type="checkbox"
                      name={`items[${index}].temper`}
                      disabled={
                        !item.category ||
                        !item.type ||
                        glassOptions[item.category].types[item.type].temper !==
                          'both'
                      }
                      checked={
                        item.category && item.type
                          ? glassOptions[item.category].types[item.type]
                              .temper === 'yes'
                            ? true
                            : item.temper
                          : false
                      }
                    />
                  </label>

                  <label className={css.label}>
                    {t('FORM_QUANTITY')}
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
                    {t('FORM_REASON')}
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

                  {values.items.length > 1 && (
                    <button
                      className={`${css.button} ${css.buttonDelete}`}
                      onClick={() => remove(index)}
                    >
                      <Trash2 size={24} color="#ff0000" strokeWidth={1} />
                    </button>
                  )}
                </div>
              ))}

              {!isEditItemMode && (
                <div className={css.addWrapper}>
                  <button
                    className={css.button}
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
                    <CirclePlus size={36} color="#4caf50" strokeWidth={2} />
                  </button>
                </div>
              )}
            </>
          );
        }}
      </FieldArray>
    </fieldset>
  );
};

export default OrderItemForm;
