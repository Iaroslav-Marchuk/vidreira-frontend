import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Button from '../../components/Button/Button.jsx';
import OrdersTable from '../../components/OrdersTable/OrdersTable.jsx';
import CreateOrderForm from '../../components/CreateOrderForm/CreateOrderForm.jsx';
import Loader from '../../components/Loader/Loader.jsx';

import { selectRole } from '../../redux/auth/selectors.js';
import {
  selectAllOrders,
  selectClientsList,
  selectCurrentPage,
  selectisClientsLoading,
  selectIsOrdersLoading,
  selectTotalPages,
} from '../../redux/orders/selectors.js';
import { getAllClients, getAllOrders } from '../../redux/orders/operations.js';

import css from './OrdersPage.module.css';
import ModalOverlay from '../../components/ModalOverlay/ModalOverlay.jsx';
import { setCurrentPage } from '../../redux/orders/slice.js';
import SearchBox from '../../components/SearchBox/SearchBox.jsx';

const OrdersPage = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  const [openCollapses, setOpenCollapses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const role = useSelector(selectRole);

  const dispatch = useDispatch();
  const allOrders = useSelector(selectAllOrders);
  const isLoading = useSelector(selectIsOrdersLoading);

  const clientsList = useSelector(selectClientsList);
  const isClientsLoading = useSelector(selectisClientsLoading);

  const currentPage = useSelector(selectCurrentPage);
  const totalPages = useSelector(selectTotalPages);

  const hasOrders = allOrders.length > 0;
  const isNotLastPage = currentPage < totalPages;

  useEffect(() => {
    dispatch(setCurrentPage(1));

    dispatch(getAllOrders({ page: 1, perPage: 10 }));

    if (!clientsList?.length && !isClientsLoading) {
      dispatch(getAllClients());
    }
  }, [dispatch, clientsList?.length, isClientsLoading]);

  const handleSearch = query => {
    setSearchQuery(query);
    dispatch(setCurrentPage(1));

    let filter = {};
    if (query) {
      if (!isNaN(Number(query))) {
        filter.EP = Number(query);
      } else {
        filter.cliente = query;
      }
    }

    dispatch(
      getAllOrders({
        page: 1,
        perPage: 10,
        filter,
      })
    );
  };

  const handleLoadMore = () => {
    if (isNotLastPage) {
      const nextPage = currentPage + 1;
      let filter = {};
      if (searchQuery) {
        if (!isNaN(Number(searchQuery))) {
          filter.EP = Number(searchQuery);
        } else {
          filter.cliente = searchQuery;
        }
      }
      dispatch(getAllOrders({ page: nextPage, perPage: 10, filter }));
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
      <SearchBox onSearch={handleSearch} />
      {role === 'duplo' && (
        <Button className={css.btn} onClick={openModal}>
          ➕ Novo Pedido
        </Button>
      )}

      {modalIsOpen && (
        <ModalOverlay isOpen={modalIsOpen} onClose={closeModal}>
          <CreateOrderForm onClose={closeModal} />
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
