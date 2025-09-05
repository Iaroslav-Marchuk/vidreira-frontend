import { useState } from 'react';

import Button from '../../components/Button/Button.jsx';
import OrderForm from '../../components/OrderForm/OrderForm.jsx';

import css from './OrdersPage.module.css';
import OrdersList from '../../components/OrdersList/OrdersList.jsx';

const OrdersPage = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);
  return (
    <div className={css.wrapper}>
      <h1 className={css.title}>Pedidos em curso</h1>
      <div className={css.filtersWrapper}>
        <input type="text" />
        <input type="text" />
      </div>

      <Button className={css.btn} onClick={openModal}>
        ➕ Novo Pedido
      </Button>

      {modalIsOpen && <OrderForm isOpen={modalIsOpen} onClose={closeModal} />}

      <OrdersList />
    </div>
  );
};

export default OrdersPage;
