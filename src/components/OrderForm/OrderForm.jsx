import { Field, ErrorMessage, useFormikContext } from 'formik';
import { useSelector } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { selectUser } from '../../redux/auth/selectors.js';

import css from './OrderForm.module.css';

const OrderForm = ({ clientsList, isClientsLoading }) => {
  const { t } = useTranslation();
  const { values, setFieldValue } = useFormikContext();
  const user = useSelector(selectUser);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const inputRef = useRef(null);

  const filteredClients = clientsList.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectClient = client => {
    setFieldValue('client', client.name);
    setSearchTerm(client.name);
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = event => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchTerm && filteredClients.length > 0) {
      setIsDropdownOpen(true);
    } else if (!searchTerm) {
      setIsDropdownOpen(false);
    }
  }, [searchTerm, filteredClients.length]);

  return (
    <div className={css.wrapper}>
      <fieldset className={css.fieldset}>
        <legend className={css.legend}>{t('FORM_LEGEND_LOCAL')}</legend>
        <label className={css.label}>
          {t('FORM_LABEL_LOCAL')}
          <Field className={css.selectLocal} as="select" name="local.zona">
            <option value="" disabled>
              --
            </option>
            <option value="LINE_1">{t('LOCAL_LINE_1')}</option>
            <option value="LINE_2">{t('LOCAL_LINE_2')}</option>
            <option value="LINE_3">{t('LOCAL_LINE_3')}</option>
            <option value="FURNACE">{t('LOCAL_FURNACE')}</option>
            <option value="LOGISTIC">{t('LOCAL_LOGISTIC')}</option>
            <option value="QUALITY">{t('LOCAL_QUALITY')}</option>
          </Field>
          <ErrorMessage
            className={css.error}
            name="local.zona"
            component="span"
          />
        </label>

        <label className={css.label}>
          {t('FORM_LABEL_OPERATOR')}
          <input
            className={css.inputLocalOperator}
            value={user.name}
            readOnly
          />
        </label>
      </fieldset>

      <fieldset className={css.fieldset}>
        <legend className={css.legend}>{t('FORM_LEGEND_ORDER')}</legend>
        <label className={css.label}>
          EP
          <Field className={css.inputEncomenda} type="text" name="EP" />
          <ErrorMessage className={css.error} name="EP" component="span" />
        </label>

        <label className={css.label}>
          {t('FORM_LABEL_CLIENT')}
          <div ref={inputRef}>
            {isClientsLoading ? (
              <div className={css.loading}>{t('FORM_LOAD_CLIENT')}</div>
            ) : (
              <>
                <Field
                  className={css.inputClient}
                  type="text"
                  name="client"
                  value={values.client}
                  onChange={e => {
                    setSearchTerm(e.target.value);
                    setFieldValue('client', e.target.value);
                  }}
                  onFocus={() => setIsDropdownOpen(true)}
                  placeholder={t('FORM_PLACEHOLDER_CLIENT')}
                  autoComplete="off"
                />

                {isDropdownOpen && filteredClients.length > 0 && (
                  <ul className={css.dropdown}>
                    {filteredClients.map((client, index) => (
                      <li
                        key={index}
                        className={css.dropdownItem}
                        onClick={() => handleSelectClient(client)}
                      >
                        {client.name}
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </div>
          <ErrorMessage className={css.error} name="client" component="span" />
        </label>
      </fieldset>
    </div>
  );
};

export default OrderForm;
