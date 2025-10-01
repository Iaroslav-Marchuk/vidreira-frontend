import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Button from '../../components/Button/Button.jsx';
import OrdersTable from '../../components/OrdersTable/OrdersTable.jsx';
import FormContainer from '../../components/FormContainer/FormContainer.jsx';
import Loader from '../../components/Loader/Loader.jsx';

import { selectRole } from '../../redux/auth/selectors.js';
import {
  selectAllOrders,
  selectCurrentPage,
  selectIsOrdersLoading,
  selectTotalPages,
} from '../../redux/orders/selectors.js';
import { getAllOrders } from '../../redux/orders/operations.js';

import css from './OrdersPage.module.css';
import ModalOverlay from '../../components/ModalOverlay/ModalOverlay.jsx';
import { setCurrentPage } from '../../redux/orders/slice.js';

const OrdersPage = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  const [openCollapses, setOpenCollapses] = useState([]);

  const role = useSelector(selectRole);

  const dispatch = useDispatch();
  const allOrders = useSelector(selectAllOrders);
  const isLoading = useSelector(selectIsOrdersLoading);

  const currentPage = useSelector(selectCurrentPage);
  const totalPages = useSelector(selectTotalPages);

  const hasOrders = allOrders.length > 0;
  const isNotLastPage = currentPage < totalPages;

  useEffect(() => {
    dispatch(setCurrentPage(1));
    dispatch(getAllOrders({ page: 1, perPage: 10 }));
  }, [dispatch]);

  const handleLoadMore = () => {
    if (isNotLastPage) {
      const nextPage = currentPage + 1;
      dispatch(getAllOrders({ page: nextPage, perPage: 10 }));
      dispatch(setCurrentPage(nextPage));
    }
  };

  const toggleCollapse = orderId => {
    setOpenCollapses(prev =>
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

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

      {allOrders.length > 0 && (
        <OrdersTable
          openCollapses={openCollapses}
          toggleCollapse={toggleCollapse}
        />
      )}

      {!isLoading && allOrders.length === 0 && (
        <p className={css.noResults}>Não existe nenhum pedido!</p>
      )}
      {hasOrders && !isLoading && isNotLastPage && (
        <Button className={css.loadMoreBtn} onClick={handleLoadMore}>
          Mais...
        </Button>
      )}
    </div>
  );
};

export default OrdersPage;
