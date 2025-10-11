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
  selectPerPage,
  selectSearchQuery,
  selectSortBy,
  selectSortOrder,
  selectTotalPages,
} from '../../redux/orders/selectors.js';
import { getAllClients, getAllOrders } from '../../redux/orders/operations.js';

import css from './OrdersPage.module.css';
import ModalOverlay from '../../components/ModalOverlay/ModalOverlay.jsx';
import { setCurrentPage, setSearchQuery } from '../../redux/orders/slice.js';
import SearchBox from '../../components/SearchBox/SearchBox.jsx';

const OrdersPage = () => {
  const dispatch = useDispatch();

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  const [openCollapses, setOpenCollapses] = useState([]);
  // const [searchQuery, setSearchQuery] = useState('');

  const role = useSelector(selectRole);

  const allOrders = useSelector(selectAllOrders);
  const isLoading = useSelector(selectIsOrdersLoading);

  const clientsList = useSelector(selectClientsList);
  const isClientsLoading = useSelector(selectisClientsLoading);

  const currentPage = useSelector(selectCurrentPage);
  const totalPages = useSelector(selectTotalPages);
  const perPage = useSelector(selectPerPage);

  const searchQuery = useSelector(selectSearchQuery);

  const sortBy = useSelector(selectSortBy);
  const sortOrder = useSelector(selectSortOrder);

  const hasOrders = allOrders.length > 0;
  const isNotLastPage = currentPage < totalPages;

  useEffect(() => {
    if (!clientsList.length && !isClientsLoading) {
      dispatch(getAllClients());
    }
  }, [dispatch, clientsList.length, isClientsLoading]);

  useEffect(() => {
    let filter = {};
    if (searchQuery) {
      if (!isNaN(Number(searchQuery))) {
        filter.EP = Number(searchQuery);
      } else {
        filter.cliente = searchQuery;
      }
    }

    dispatch(
      getAllOrders({
        page: currentPage,
        perPage: 10,
        sortBy,
        sortOrder,
        filter,
      })
    );
  }, [dispatch, currentPage, sortBy, sortOrder, searchQuery]);

  const handleSearch = query => {
    dispatch(setSearchQuery(query));
    dispatch(setCurrentPage(1));
  };

  const handleLoadMore = () => {
    if (isNotLastPage) {
      dispatch(
        getAllOrders({
          page: currentPage + 1,
          perPage,
          sortBy,
          sortOrder,
          filter: searchQuery ? { cliente: searchQuery } : {},
        })
      );
      dispatch(setCurrentPage(currentPage + 1));
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
