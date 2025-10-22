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

const OrderSummary = () => {
  const dispatch = useDispatch();
  const currentOrder = useSelector(selectCurrentOrder);
  const isOrderLoading = useSelector(selectIsOrdersLoading);

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

  function formatHistoryEntry(h) {
    const date = new Date(h.changedAt).toLocaleString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const user = h.changedBy.name;
    const action = h.action;
    const changes = h.changes;
    const lines = [];

    switch (action) {
      case 'criou pedido':
        lines.push(
          `${date} — ${user} criou o pedido EP-${changes.EP} com ${changes.itemsCount} posição(ões).`
        );
        break;

      case 'corregiu pedidio':
        if (changes.EP && changes.EP.old !== changes.EP.new) {
          lines.push(
            `${date} — ${user} alterou o número de EP de ${changes.EP.old} para ${changes.EP.new}.`
          );
        }
        if (changes.client && changes.client.old !== changes.client.new) {
          lines.push(
            `${date} — ${user} alterou o cliente de "${changes.client.old}" para "${changes.client.new}".`
          );
        }
        if (
          changes.local &&
          changes.local.old.zona !== changes.local.new.zona
        ) {
          lines.push(
            `${date} — ${user} alterou a zona de ${changes.local.old.zona} para ${changes.local.new.zona}.`
          );
        }
        if (changes.addedItemsCount && changes.addedItemsCount > 0) {
          lines.push(
            `${date} — ${user} adicionou ${changes.addedItemsCount} artigo(s).`
          );
        }
        if (lines.length === 0) {
          lines.push(`${date} — ${user} corrigiu o pedido.`);
        }
        break;

      case 'adicionou artigo':
        lines.push(
          `${date} — ${user} adicionou ${changes.addedItemsCount} artigo(s).`
        );
        break;

      case 'mudou estado do pedido':
        lines.push(
          `${date} — ${user} mudou o estado do pedido de "${changes.status.old}" para "${changes.status.new}".`
        );
        break;

      case 'eliminou artigo':
        lines.push(
          `${date} — ${user} eliminou um artigo: ${changes.deletedItem?.category} ${changes.deletedItem?.sizeX}x${changes.deletedItem?.sizeY} ${changes.deletedItem?.sizeZ}.`
        );
        break;

      default:
        lines.push(`${date} — ${user} fez uma ação desconhecida.`);
        break;
    }

    return lines;
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
            <span className={css.span}>Faltas total:</span>{' '}
            {currentOrder.items.reduce((sum, item) => sum + item.quantity, 0)}
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
                  'corregiu pedidio',
                  'adicionou artigo',
                  'eliminou artigo',
                  'mudou estado do pedido',
                ].includes(h.action)
              )
              .map((h, index) =>
                formatHistoryEntry(h).map((line, i) => (
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
