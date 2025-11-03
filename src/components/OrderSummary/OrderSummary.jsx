import Loader from '../Loader/Loader.jsx';
import css from './OrderSummary.module.css';
import { useDispatch, useSelector } from 'react-redux';

import {
  selectCurrentOrder,
  selectHistory,
  selectIsHistoryLoading,
  selectIsOrdersLoading,
} from '../../redux/orders/selectors.js';
import { useEffect } from 'react';
import { getOrderHistory } from '../../redux/orders/operations.js';
import { formatHistoryEntry } from '../../utils/formatHistory.js';
import { selectGlassOptions } from '../../redux/glass/selectors.js';

const OrderSummary = () => {
  const dispatch = useDispatch();
  const currentOrder = useSelector(selectCurrentOrder);
  const isOrderLoading = useSelector(selectIsOrdersLoading);
  const glassOptions = useSelector(selectGlassOptions);

  const history = useSelector(selectHistory);
  const isHistoryLoading = useSelector(selectIsHistoryLoading);

  useEffect(() => {
    if (currentOrder) {
      dispatch(getOrderHistory(currentOrder._id));
    }
  }, [currentOrder, dispatch]);

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
            <span className={css.span}>Cliente:</span>{' '}
            {currentOrder.client.name}
          </li>
          <li className={css.infoItem}>
            <span className={css.span}>Zona:</span> {currentOrder.local.zona}
          </li>
          <li className={css.infoItem}>
            <span className={css.span}>Operador:</span>{' '}
            {currentOrder.owner.name}
          </li>
          <li className={css.infoItem}>
            <span className={css.span}>Vidros em falta:</span>{' '}
            {currentOrder.items
              .filter(item => item.status !== 'Concluído')
              .reduce((sum, item) => sum + item.quantity, 0)}
          </li>
          <li className={css.infoItem}>
            <span className={css.span}>- em espera:</span>{' '}
            {currentOrder.items
              .filter(item => item.status === 'Criado')
              .reduce((sum, item) => sum + item.quantity, 0)}
          </li>
          <li className={css.infoItem}>
            <span className={css.span}>- em produção:</span>{' '}
            {currentOrder.items
              .filter(item => item.status === 'Em produção')
              .reduce((sum, item) => sum + item.quantity, 0)}
          </li>
          <li className={css.infoItem}>
            <span className={css.span}>- concluído</span>{' '}
            {currentOrder.items
              .filter(item => item.status === 'Concluído')
              .reduce((sum, item) => sum + item.quantity, 0)}
          </li>
        </ul>
      </div>

      <div className={css.history}>
        <h2 className={css.title}>História do pedido</h2>

        {isHistoryLoading ? (
          <Loader loadingstate={isHistoryLoading} />
        ) : (
          <ul className={css.historyList}>
            {history
              .filter(h =>
                [
                  'criou pedido',
                  'corrigiu pedido',
                  'adicionou artigo',
                  'eliminou artigo',
                  'mudou estado do pedido',
                ].includes(h.action)
              )
              .map((h, index) =>
                formatHistoryEntry(h, { glassOptions }).map((line, i) => (
                  <li key={`${index}-${i}`} className={css.historyItem}>
                    {line}
                  </li>
                ))
              )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default OrderSummary;
