import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import Button from '../../components/Button/Button.jsx';
import OrdersTable from '../../components/OrdersTable/OrdersTable.jsx';
import CreateOrderForm from '../../components/CreateOrderForm/CreateOrderForm.jsx';
import Loader from '../../components/Loader/Loader.jsx';
import ModalOverlay from '../../components/ModalOverlay/ModalOverlay.jsx';
import SearchBox from '../../components/SearchBox/SearchBox.jsx';

import { selectRole } from '../../redux/auth/selectors.js';
import {
  selectAllOrders,
  selectCurrentPage,
  selectIsOrdersLoading,
  selectPerPage,
  selectSearchQuery,
  selectSortBy,
  selectSortOrder,
  selectTotalPages,
} from '../../redux/orders/selectors.js';
import { getAllOrders } from '../../redux/orders/operations.js';
import {
  setCurrentPage,
  setSearchQuery,
  setSorting,
} from '../../redux/orders/slice.js';
import {
  selectGlassOptions,
  selectIsGlassLoading,
} from '../../redux/glass/selectors.js';
import { getGlassOptions } from '../../redux/glass/operations.js';
import { getAllRoles } from '../../redux/roles/operations.js';
import { selectRolesList } from '../../redux/roles/selectors.js';
import { getAllClients } from '../../redux/clients/operations.js';
import { selectClientsList } from '../../redux/clients/selectors.js';

import { roleCanDo } from '../../utils/roleCanDo.js';

import css from './OrdersPage.module.css';

const OrdersPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  const [openCollapses, setOpenCollapses] = useState([]);

  const role = useSelector(selectRole);
  const rolesList = useSelector(selectRolesList);

  const glassOptions = useSelector(selectGlassOptions);
  const isGlassLoading = useSelector(selectIsGlassLoading);

  const allOrders = useSelector(selectAllOrders);
  const isOrdersLoading = useSelector(selectIsOrdersLoading);

  const clientsList = useSelector(selectClientsList);

  const currentPage = useSelector(selectCurrentPage);
  const totalPages = useSelector(selectTotalPages);
  const perPage = useSelector(selectPerPage);

  const searchQuery = useSelector(selectSearchQuery);

  const sortBy = useSelector(selectSortBy);
  const sortOrder = useSelector(selectSortOrder);

  const hasOrders = allOrders.length > 0;
  const isNotLastPage = currentPage < totalPages;

  useEffect(() => {
    return () => {
      dispatch(setCurrentPage(1));
      dispatch(setSorting({ sortBy: 'createdAt', sortOrder: 'desc' }));
      dispatch(setSearchQuery(''));
    };
  }, [dispatch]);

  useEffect(() => {
    if (!clientsList.length) {
      dispatch(getAllClients());
    }
    if (!rolesList.length) {
      dispatch(getAllRoles());
    }
    if (Object.keys(glassOptions).length === 0) {
      dispatch(getGlassOptions());
    }
  }, [dispatch, clientsList.length, rolesList.length, glassOptions]);

  useEffect(() => {
    let filter = {};
    if (searchQuery) {
      if (!isNaN(Number(searchQuery))) {
        filter.EP = Number(searchQuery);
      } else {
        filter.client = searchQuery;
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
          filter: searchQuery ? { client: searchQuery } : {},
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
      <h1 className={css.title}>{t('ORDERS_TITLE')}</h1>
      <SearchBox onSearch={handleSearch} />

      {roleCanDo(rolesList, role, 'create') && (
        <Button className={css.btn} onClick={openModal}>
          ➕ {t('NEW_ORDER')}
        </Button>
      )}

      {modalIsOpen && (
        <ModalOverlay isOpen={modalIsOpen} onClose={closeModal}>
          {Object.keys(glassOptions).length === 0 ? (
            <Loader loadingState={isGlassLoading} />
          ) : (
            <CreateOrderForm glassOptions={glassOptions} onClose={closeModal} />
          )}
        </ModalOverlay>
      )}

      {isOrdersLoading && <Loader loadingState={isOrdersLoading} />}
      {allOrders.length > 0 && (
        <OrdersTable
          orders={allOrders}
          isArchive={false}
          openCollapses={openCollapses}
          toggleCollapse={toggleCollapse}
        />
      )}
      {!isOrdersLoading && allOrders.length === 0 && (
        <p className={css.noResults}>{t('ORDERS_NO_EXIST')}</p>
      )}
      {hasOrders && !isOrdersLoading && isNotLastPage && (
        <Button className={css.loadMoreBtn} onClick={handleLoadMore}>
          {t('MORE')}
        </Button>
      )}
    </div>
  );
};

export default OrdersPage;
