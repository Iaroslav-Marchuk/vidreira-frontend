import { useSelector } from 'react-redux';
import css from './OrderItemSummary.module.css';
import {
  selectHistory,
  selectIsHistoryLoading,
} from '../../redux/orders/selectors.js';

import Loader from '../Loader/Loader.jsx';

const OrderItemSummary = ({ itemId }) => {
  const history = useSelector(selectHistory);

  const itemHistory = history.filter(entry => entry.itemId === itemId);
  const isHistoryLoading = useSelector(selectIsHistoryLoading);

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
      case 'adicionou artigo no pedido':
        lines.push(`${date} — ${user} adicionou artigo.`);
        break;

      case 'corrigiu artigo':
        if (
          (changes.category && changes.category.old !== changes.category.new) ||
          (changes.type && changes.type.old !== changes.type.new)
        ) {
          lines.push(
            `${date} — ${user} alterou o tipo de vidro de ${changes.type.old} para ${changes.type.new}.`
          );
        }

        if (changes.sizeZ && changes.sizeZ.old !== changes.sizeZ.new) {
          lines.push(
            `${date} — ${user} alterou a espressura do vidro de "${changes.sizeZ.old}" para "${changes.sizeZ.new}".`
          );
        }

        if (
          (changes.sizeX && changes.sizeX.old !== changes.sizeX.new) ||
          (changes.sizeY && changes.sizeY.old !== changes.sizeY.new)
        ) {
          lines.push(
            `${date} — ${user} alterou a medida de "${changes.sizeX.old}x${changes.sizeY.old}" para "${changes.sizeX.new}x${changes.sizeY.new}".`
          );
        }

        if ('temper' in changes && changes.temper.old !== changes.temper.new) {
          const oldValue = changes.temper.old
            ? 'vidro temperado'
            : 'vidro normal';
          const newValue = changes.temper.new
            ? 'vidro temperado'
            : 'vidro normal';

          lines.push(
            `${date} — ${user} alterou o tipo do vidro de "${oldValue}" para "${newValue}".`
          );
        }

        if (changes.quantity && changes.quantity.old !== changes.quantity.new) {
          lines.push(
            `${date} — ${user} alterou a quantidade de vidro de "${changes.quantity.old}" para "${changes.quantity.new}".`
          );
        }

        if (changes.reason && changes.reason.old !== changes.reason.new) {
          lines.push(
            `${date} — ${user} alterou o motivo do pedido de vidro de "${changes.reason.old}" para "${changes.reason.new}".`
          );
        }

        break;

      case 'mudou estado do artigo':
        lines.push(
          `${date} — ${user} mudou o estado do artigo de "${changes.status.old}" para "${changes.status.new}".`
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
      <div className={css.history}>
        <h2 className={css.title}>História do vidro</h2>
        {isHistoryLoading ? (
          <Loader loadingstate={isHistoryLoading} />
        ) : (
          <ul className={css.historyList}>
            {itemHistory
              .filter(h =>
                [
                  'adicionou artigo no pedido',
                  'adicionou artigo',
                  'corrigiu artigo',
                  'mudou estado do artigo',
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

export default OrderItemSummary;
