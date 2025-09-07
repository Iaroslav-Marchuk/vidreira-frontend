import { useSelector } from 'react-redux';

import Order from '../Order/Order.jsx';

import { selectAllOrders } from '../../redux/orders/selectors.js';

import css from './OrdersList.module.css';

const OrdersList = () => {
  const allOrders = useSelector(selectAllOrders);

  const flattenedRows = allOrders.flatMap(order =>
    order.items.map(item => ({
      ...item,
      itemId: item._id,
      orderId: order._id,
      EP: order.EP,
      cliente: order.cliente,
      status: order.status,
      createdAt: order.createdAt,
      zona: order.local.zona,
      operator: order.local.operator,
    }))
  );

  return (
    <table className={css.table}>
      <thead className={css.header}>
        <tr>
          <th>#</th>
          <th>EP</th>
          <th>Cliente</th>
          <th>Vidro</th>
          <th>Medida</th>
          <th>Qtde</th>
          <th>Estado</th>
          <th>Zona</th>
          <th>Data</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        {flattenedRows.map((row, index) => (
          <Order
            key={`${row.itemId}-${index}`}
            row={row}
            index={index}
            itemId={row.itemId}
            orderId={row.orderId}
          />
        ))}
      </tbody>
    </table>
  );
};

export default OrdersList;
