import { useSelector, useDispatch } from 'react-redux';
import {
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Table,
  Paper,
} from '@mui/material';

import {
  ArrowUpDown,
  ArrowUpNarrowWide,
  ArrowDownWideNarrow,
} from 'lucide-react';

import OrderCollapse from '../OrderCollapse/OrderCollapse.jsx';

import { selectSortBy, selectSortOrder } from '../../redux/orders/selectors.js';

import { setSorting } from '../../redux/orders/slice.js';

import css from './OrdersTable.module.css';

const OrdersTable = ({ orders, openCollapses, toggleCollapse, isArchive }) => {
  const dispatch = useDispatch();

  const sortBy = useSelector(selectSortBy);
  const sortOrder = useSelector(selectSortOrder);

  const handleSortClick = sortField => {
    const newOrder =
      sortBy === sortField && sortOrder === 'desc' ? 'asc' : 'desc';
    dispatch(setSorting({ sortBy: sortField, sortOrder: newOrder }));
  };

  const getSortIcon = sortField => {
    if (sortBy === sortField) {
      return sortOrder === 'asc' ? (
        <ArrowUpNarrowWide className={css.arrow} color="#fff" strokeWidth={2} />
      ) : (
        <ArrowDownWideNarrow
          className={css.arrow}
          color="#fff"
          strokeWidth={2}
        />
      );
    }
    return <ArrowUpDown className={css.arrow} color="#fff" strokeWidth={2} />;
  };

  return (
    <TableContainer component={Paper}>
      <Table aria-label="orders table">
        <TableHead
          sx={{
            backgroundColor: 'var(--color-btn-bg)',
            '& .MuiTableCell-head': {
              color: 'var(--color-btn-txt)',
              fontWeight: 700,
              fontSize: '14px',
              textAlign: 'center',
              padding: '4px',
            },

            '@media (min-width: 1240px)': {
              '& .MuiTableCell-head': {
                fontSize: '16px',
                padding: '16px',
              },
            },
          }}
        >
          <TableRow>
            <TableCell />
            <TableCell>
              <div className={css.wrapper}>
                <button
                  className={css.button}
                  onClick={() => handleSortClick('EP')}
                >
                  {getSortIcon('EP')}
                </button>
                <span className={css.text}>EP</span>
              </div>
            </TableCell>
            <TableCell>
              <div className={css.wrapper}>
                <button
                  className={css.button}
                  onClick={() => handleSortClick('client')}
                >
                  {getSortIcon('client')}
                </button>
                <span className={css.text}>Cliente</span>
              </div>
            </TableCell>
            {!isArchive && (
              <TableCell>
                <div className={css.wrapper}>
                  <button
                    className={css.button}
                    onClick={() => handleSortClick('falta')}
                  >
                    {getSortIcon('falta')}
                  </button>
                  <span className={css.text}>Em falta</span>
                </div>
              </TableCell>
            )}
            <TableCell>
              <div className={css.wrapper}>
                <button
                  className={css.button}
                  onClick={() => handleSortClick('status')}
                >
                  {getSortIcon('status')}
                </button>
                <span className={css.text}>Estado</span>
              </div>
            </TableCell>
            <TableCell>
              <div className={css.wrapper}>
                <button
                  className={css.button}
                  onClick={() => handleSortClick('local.zona')}
                >
                  {getSortIcon('local.zona')}
                </button>
                <span className={css.text}>Zona</span>
              </div>
            </TableCell>
            <TableCell>
              <div className={css.wrapper}>
                <button
                  className={css.button}
                  onClick={() =>
                    handleSortClick(isArchive ? 'updatedAt' : 'createdAt')
                  }
                >
                  {getSortIcon(isArchive ? 'updatedAt' : 'createdAt')}
                </button>
                <span className={css.text}>
                  {isArchive ? 'Data de Conclusão' : 'Data de Criação'}
                </span>
              </div>
            </TableCell>
            <TableCell>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map(order => (
            <OrderCollapse
              key={order._id}
              order={order}
              orderId={order._id}
              isOpen={openCollapses.includes(order._id)}
              toggleCollapse={() => toggleCollapse(order._id)}
              isArchive={isArchive}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OrdersTable;
