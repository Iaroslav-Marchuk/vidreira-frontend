import { useSelector } from 'react-redux';

import Order from '../Order/Order.jsx';

import { selectAllOrders } from '../../redux/orders/selectors.js';

import css from './OrdersList.module.css';

const OrdersList = () => {
  const allOrders = useSelector(selectAllOrders);

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
        {allOrders.map((order, index) => (
          <Order key={order._id} order={order} index={index} />
        ))}
      </tbody>
    </table>
  );
};

export default OrdersList;

[
  {
    EP: 101,
    cliente: 'João Silva',
    local: {
      zona: 'L1',
      operator: 'OperatorA',
    },
    status: 'created',
    items: [
      {
        category: 'Vidro',
        type: 'Temperado',
        temper: true,
        sizeX: 100,
        sizeY: 50,
        sizeZ: '8mm',
        quantity: 2,
        reason: 'Janela sala',
      },
    ],
  },
];
