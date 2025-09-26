import { useSelector } from 'react-redux';

import css from './OrderDetails.module.css';
import {
  selectCurrentOrder,
  selectIsOrdersLoading,
} from '../../redux/orders/selectors.js';
import Loader from '../Loader/Loader.jsx';
import toast from 'react-hot-toast';
import { useEffect } from 'react';

const OrderDetails = ({ itemId, onClose }) => {
  const currentOrder = useSelector(selectCurrentOrder);
  const isOrderLoading = useSelector(selectIsOrdersLoading);

  const item = currentOrder?.items.find(i => i._id === itemId);

  useEffect(() => {
    if (!isOrderLoading && currentOrder && !item) {
      toast.error('Item not found!');
      if (onClose) onClose();
    }
  }, [isOrderLoading, currentOrder, item, onClose]);

  if (isOrderLoading || !currentOrder || !item) {
    return <Loader loadingstate={isOrderLoading} />;
  }

  if (!item) {
    return null;
  }

  return (
    <div className={css.container}>
      <div className={css.header}>
        <h2 className={css.title}>Zona info</h2>
        <ul className={css.headerList}>
          <li className={css.headerItem}>
            <span className={css.span}>Zona:</span> {currentOrder.local.zona}
          </li>
          <li className={css.headerItem}>
            <span className={css.span}>Operador:</span>{' '}
            {currentOrder.local.operator}
          </li>
          <li className={css.headerItem}>
            <span className={css.span}>Data:</span>{' '}
            {new Date(currentOrder.createdAt).toLocaleString('pt-PT', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </li>
        </ul>
      </div>
      <div className={css.info}>
        <h2 className={css.title}>Vidro info</h2>
        <ul className={css.infoList}>
          <li className={css.infoItem}>
            <span className={css.span}>EP:</span> {currentOrder.EP}
          </li>
          <li className={css.infoItem}>
            <span className={css.span}>Cliente:</span> {currentOrder.cliente}
          </li>
          <li className={css.infoItem}>
            <span className={css.span}>Vidro:</span>
            {`${item.category} ${item.type} ${item.sizeZ}mm    ${item.sizeX}x${item.sizeY}`}
          </li>
          <li className={css.infoItem}>
            <span className={css.span}>Quantidade:</span>
            {item.quantity}
          </li>
          <li className={css.infoItem}>
            <span className={css.span}>Motivo:</span> ${item.reason}
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

export default OrderDetails;
