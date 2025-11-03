import { useSelector } from 'react-redux';
import css from './OrderItemSummary.module.css';
import {
  selectHistory,
  selectIsHistoryLoading,
} from '../../redux/orders/selectors.js';
import Loader from '../Loader/Loader.jsx';
import { selectGlassOptions } from '../../redux/glass/selectors.js';
import { formatHistoryEntry } from '../../utils/formatHistory.js';

const OrderItemSummary = ({ item, itemId }) => {
  const history = useSelector(selectHistory);
  const isHistoryLoading = useSelector(selectIsHistoryLoading);
  const glassOptions = useSelector(selectGlassOptions);

  const itemHistory = history.filter(entry => entry.itemId === itemId);

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
                formatHistoryEntry(h, {
                  glassOptions,
                  actualX: item.sizeX,
                  actualY: item.sizeY,
                }).map((line, i) => (
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
