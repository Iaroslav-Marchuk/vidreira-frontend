import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Button from '../../components/Button/Button.jsx';
import OrdersTable from '../../components/OrdersTable/OrdersTable.jsx';
import Loader from '../../components/Loader/Loader.jsx';

import {
  selectArchive,
  selectClientsList,
  selectCurrentPage,
  selectIsArchiveLoading,
  selectisClientsLoading,
  selectPerPage,
  selectRolesList,
  selectSearchQuery,
  selectSortBy,
  selectSortOrder,
  selectTotalPages,
} from '../../redux/orders/selectors.js';
import {
  getAllClients,
  getAllRoles,
  getArchive,
} from '../../redux/orders/operations.js';

import css from './ArchivePage.module.css';
import {
  setCurrentPage,
  setSearchQuery,
  setSorting,
} from '../../redux/orders/slice.js';
import SearchBox from '../../components/SearchBox/SearchBox.jsx';

const ArchivePage = () => {
  const dispatch = useDispatch();

  const [openCollapses, setOpenCollapses] = useState([]);

  const archive = useSelector(selectArchive);
  const isArchiveLoading = useSelector(selectIsArchiveLoading);

  const rolesList = useSelector(selectRolesList);

  const clientsList = useSelector(selectClientsList);
  const isClientsLoading = useSelector(selectisClientsLoading);

  const currentPage = useSelector(selectCurrentPage);
  const totalPages = useSelector(selectTotalPages);
  const perPage = useSelector(selectPerPage);

  const searchQuery = useSelector(selectSearchQuery);

  const sortBy = useSelector(selectSortBy);
  const sortOrder = useSelector(selectSortOrder);

  const hasArchive = archive.length > 0;
  const isNotLastPage = currentPage < totalPages;

  useEffect(() => {
    return () => {
      dispatch(setCurrentPage(1));
      dispatch(setSorting({ sortBy: 'createdAt', sortOrder: 'desc' }));
      dispatch(setSearchQuery(''));
    };
  }, [dispatch]);

  useEffect(() => {
    if (!clientsList.length && !isClientsLoading) {
      dispatch(getAllClients());
    }
  }, [dispatch, clientsList.length, isClientsLoading]);

  useEffect(() => {
    if (!rolesList.length) {
      dispatch(getAllRoles());
    }
  }, [dispatch, rolesList.length]);

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
      getArchive({
        page: currentPage,
        perPage: 10,
        sortBy,
        sortOrder,
        filter,
      })
    );

    console.log(getArchive());
  }, [dispatch, currentPage, sortBy, sortOrder, searchQuery]);

  const handleSearch = query => {
    dispatch(setSearchQuery(query));
    dispatch(setCurrentPage(1));
  };

  const handleLoadMore = () => {
    if (isNotLastPage) {
      dispatch(
        getArchive({
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
      <h1 className={css.title}>Pedidos concluídos</h1>
      <SearchBox onSearch={handleSearch} />

      {isArchiveLoading && <Loader loadingState={isArchiveLoading} />}
      {archive.length > 0 && (
        <OrdersTable
          orders={archive}
          isArchive={true}
          openCollapses={openCollapses}
          toggleCollapse={toggleCollapse}
        />
      )}
      {!isArchiveLoading && archive.length === 0 && (
        <p className={css.noResults}>Não existe nenhum pedido em archivo!</p>
      )}
      {hasArchive && !isArchiveLoading && isNotLastPage && (
        <Button className={css.loadMoreBtn} onClick={handleLoadMore}>
          Mais...
        </Button>
      )}
    </div>
  );
};

export default ArchivePage;
