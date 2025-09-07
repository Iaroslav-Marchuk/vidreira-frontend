import { useEffect, useState } from 'react';

import Button from '../../components/Button/Button.jsx';
import OrderForm from '../../components/OrderForm/OrderForm.jsx';

import css from './OrdersPage.module.css';
import OrdersList from '../../components/OrdersList/OrdersList.jsx';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectAllOrders,
  selectIsOrdersLoading,
} from '../../redux/orders/selectors.js';
import { getAllOrders } from '../../redux/orders/operations.js';

const OrdersPage = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  const dispatch = useDispatch();
  const allOrders = useSelector(selectAllOrders);
  const isLoading = useSelector(selectIsOrdersLoading);

  useEffect(() => {
    dispatch(getAllOrders());
  }, [dispatch]);

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

      {allOrders.length > 0 && <OrdersList />}

      {!isLoading && allOrders.length === 0 && (
        <p className={css.noResults}>Não existe nenhum pedido!</p>
      )}
    </div>
  );
};

export default OrdersPage;
