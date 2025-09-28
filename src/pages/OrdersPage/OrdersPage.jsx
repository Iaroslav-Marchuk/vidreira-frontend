import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Button from '../../components/Button/Button.jsx';
import OrdersTable from '../../components/OrdersTable/OrdersTable.jsx';
import FormContainer from '../../components/FormContainer/FormContainer.jsx';
import Loader from '../../components/Loader/Loader.jsx';

import { selectRole } from '../../redux/auth/selectors.js';
import {
  selectAllOrders,
  selectIsOrdersLoading,
} from '../../redux/orders/selectors.js';
import { getAllOrders } from '../../redux/orders/operations.js';

import css from './OrdersPage.module.css';
import ModalOverlay from '../../components/ModalOverlay/ModalOverlay.jsx';

const OrdersPage = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);
  const role = useSelector(selectRole);

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

      {role === 'duplo' && (
        <Button className={css.btn} onClick={openModal}>
          ➕ Novo Pedido
        </Button>
      )}

      {modalIsOpen && (
        <ModalOverlay isOpen={modalIsOpen} onClose={closeModal}>
          <FormContainer onClose={closeModal} />
        </ModalOverlay>
      )}

      {isLoading && <Loader loadingState={isLoading} />}

      {allOrders.length > 0 && <OrdersTable />}
      {!isLoading && allOrders.length === 0 && (
        <p className={css.noResults}>Não existe nenhum pedido!</p>
      )}
    </div>
  );
};

export default OrdersPage;
