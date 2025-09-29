import { Field, ErrorMessage, useFormikContext } from 'formik';
import { useSelector } from 'react-redux';
import { useEffect, useRef, useState } from 'react';

import { clientsBase } from '../../constants/clientsBase.js';

import { selectUser } from '../../redux/auth/selectors.js';

import css from './OrderForm.module.css';

const OrderForm = () => {
  const user = useSelector(selectUser);
  const { setFieldValue } = useFormikContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const inputRef = useRef(null);

  const filteredClients = clientsBase
    .filter(client => client.toLowerCase().includes(searchTerm.toLowerCase()))
    .slice(0, 10);

  const handleSelectClient = client => {
    setSearchTerm(client);
    setFieldValue('cliente', client);
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
        <legend className={css.legend}>Local Info</legend>
        <label className={css.label}>
          Linha
          <Field className={css.selectLocal} as="select" name="local.zona">
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
          <ErrorMessage className={css.error} name="EP" component="span" />
        </label>

        <label className={css.label}>
          Cliente
          <div ref={inputRef}>
            <Field
              className={css.inputCliente}
              type="text"
              name="cliente"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              onFocus={() => setIsDropdownOpen(true)}
              placeholder="Type or select a client..."
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
                    {client}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <ErrorMessage className={css.error} name="cliente" component="span" />
        </label>
      </fieldset>
    </div>
  );
};

export default OrderForm;
