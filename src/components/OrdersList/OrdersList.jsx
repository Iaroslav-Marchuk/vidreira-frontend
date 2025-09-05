import Order from '../Order/Order.jsx';

import css from './OrdersList.module.css';

const OrdersList = () => {
  return (
    <>
      <table calssName={css.table}>
        <thead className={css.header}>
          <tr>
            <th>#</th>
            <th>EP</th>
            <th>Cliente</th>
            <th>Vidro</th>
            <th>Medida</th>
            <th>Qtde</th>
            <th>Motivo</th>
            <th>Estado</th>
            <th>Zona</th>
            <th>Operador</th>
            <th>Data</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <Order />
        </tbody>
      </table>
    </>
  );
};

export default OrdersList;
