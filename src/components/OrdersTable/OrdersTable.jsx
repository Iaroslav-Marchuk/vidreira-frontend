import { useSelector } from 'react-redux';
import {
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Table,
  Paper,
} from '@mui/material';

import OrderCollapse from '../OrderCollapse/OrderCollapse.jsx';

import { selectAllOrders } from '../../redux/orders/selectors.js';

const OrdersTable = () => {
  const allOrders = useSelector(selectAllOrders);

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
            <TableCell>EP</TableCell>
            <TableCell>Cliente</TableCell>
            <TableCell>Em falta</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell>Zona</TableCell>
            <TableCell>Data</TableCell>
            <TableCell>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {allOrders.map(order => (
            <OrderCollapse key={order._id} order={order} orderId={order._id} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OrdersTable;
