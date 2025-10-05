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

import { selectAllOrders } from '../../redux/orders/selectors.js';
import { useState } from 'react';

import css from './OrdersTable.module.css';
import { getAllOrders } from '../../redux/orders/operations.js';

const OrdersTable = ({ openCollapses, toggleCollapse }) => {
  const dispatch = useDispatch();
  const allOrders = useSelector(selectAllOrders);

  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('none');

  const sortableColumns = {
    1: 'EP',
    2: 'cliente',
    3: 'falta',
    4: 'status',
    5: 'local.zona',
    6: 'createdAt',
  };

  const handleSortClick = colIndex => {
    const columnKey = sortableColumns[colIndex];
    let newDirection;

    if (sortColumn === colIndex) {
      newDirection = sortDirection === 'desc' ? 'asc' : 'desc';
    } else {
      newDirection = 'desc';
    }

    setSortColumn(colIndex);
    setSortDirection(newDirection);

    dispatch(
      getAllOrders({
        page: 1,
        perPage: 10,
        sortBy: columnKey,
        sortOrder: newDirection,
        filter: {},
      })
    );
  };

  const getSortIcon = colIndex => {
    if (sortColumn === colIndex && sortDirection !== 'none') {
      return sortDirection === 'asc' ? (
        <ArrowUpNarrowWide size={20} color="#fff" strokeWidth={2} />
      ) : (
        <ArrowDownWideNarrow size={20} color="#fff" strokeWidth={2} />
      );
    }
    return <ArrowUpDown size={20} color="#fff" strokeWidth={2} />;
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
              fontSize: '16px',
              textAlign: 'center',
            },
          }}
        >
          <TableRow>
            <TableCell />
            <TableCell>
              <div className={css.wrapper}>
                {sortableColumns[1] && (
                  <button
                    className={css.button}
                    onClick={() => handleSortClick(1)}
                  >
                    {getSortIcon(1)}
                  </button>
                )}
                <span className={css.text}>EP</span>
              </div>
            </TableCell>
            <TableCell>
              <div className={css.wrapper}>
                {sortableColumns[2] && (
                  <button
                    className={css.button}
                    onClick={() => handleSortClick(2)}
                  >
                    {getSortIcon(2)}
                  </button>
                )}
                <span className={css.text}>Cliente</span>
              </div>
            </TableCell>
            <TableCell>
              <div className={css.wrapper}>
                {sortableColumns[3] && (
                  <button
                    className={css.button}
                    onClick={() => handleSortClick(3)}
                  >
                    {getSortIcon(3)}
                  </button>
                )}
                <span className={css.text}>Em falta</span>
              </div>
            </TableCell>
            <TableCell>
              <div className={css.wrapper}>
                {sortableColumns[4] && (
                  <button
                    className={css.button}
                    onClick={() => handleSortClick(4)}
                  >
                    {getSortIcon(4)}
                  </button>
                )}
                <span className={css.text}>Estado</span>
              </div>
            </TableCell>
            <TableCell>
              <div className={css.wrapper}>
                {sortableColumns[5] && (
                  <button
                    className={css.button}
                    onClick={() => handleSortClick(5)}
                  >
                    {getSortIcon(5)}
                  </button>
                )}
                <span className={css.text}>Zona</span>
              </div>
            </TableCell>
            <TableCell>
              <div className={css.wrapper}>
                {sortableColumns[6] && (
                  <button
                    className={css.button}
                    onClick={() => handleSortClick(6)}
                  >
                    {getSortIcon(6)}
                  </button>
                )}
                <span className={css.text}>Data</span>
              </div>
            </TableCell>
            <TableCell>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {allOrders.map(order => (
            <OrderCollapse
              key={order._id}
              order={order}
              orderId={order._id}
              isOpen={openCollapses.includes(order._id)}
              toggleCollapse={() => toggleCollapse(order._id)}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OrdersTable;
