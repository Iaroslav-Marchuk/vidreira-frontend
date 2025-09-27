import Loader from '../Loader/Loader.jsx';
import css from './OrderSummary.module.css';
import { useSelector } from 'react-redux';

import {
  selectCurrentOrder,
  selectIsOrdersLoading,
} from '../../redux/orders/selectors.js';

const OrderSummary = () => {
  const currentOrder = useSelector(selectCurrentOrder);
  const isOrderLoading = useSelector(selectIsOrdersLoading);

  if (isOrderLoading || !currentOrder) {
    return <Loader loadingstate={isOrderLoading} />;
  }

  return (
    <div className={css.container}>
      <div className={css.info}>
        <h2 className={css.title}>Encomenda info</h2>
        <ul className={css.infoList}>
          <li className={css.infoItem}>
            <span className={css.span}>EP:</span> {currentOrder.EP}
          </li>
          <li className={css.infoItem}>
            <span className={css.span}>Cliente:</span> {currentOrder.cliente}
          </li>
          <li className={css.infoItem}>
            <span className={css.span}>Zona:</span> {currentOrder.local.zona}
          </li>
          <li className={css.infoItem}>
            <span className={css.span}>Em falta</span>{' '}
            {currentOrder.items
              .filter(item => item.status !== 'Concluído')
              .reduce((total, item) => total + item.quantity, 0)}{' '}
            unidades
          </li>
        </ul>
      </div>

      <div className={css.history}>
        <h2 className={css.title}>História do pedido</h2>
        <ul className={css.historyList}>
          <li className={css.historyItem}>Iaroslav criou pedido 22.02.2022</li>
          <li className={css.historyItem}>
            Iaroslav corrigiu pedido 22.02.2022
          </li>
          <li className={css.historyItem}>
            Bruno mudou estado do pedido para "Em processo" 24.02.2022
          </li>
          <li className={css.historyItem}>
            Iaroslav mudou estado do pedido para "Concluido" 24.02.2022
          </li>
        </ul>
      </div>
    </div>
  );
};

export default OrderSummary;
