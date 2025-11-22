import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import Loader from '../Loader/Loader.jsx';

import {
  selectHistory,
  selectIsHistoryLoading,
} from '../../redux/orders/selectors.js';

import { selectGlassOptions } from '../../redux/glass/selectors.js';

import { formatHistoryEntry } from '../../utils/formatHistory.js';

import css from './OrderItemSummary.module.css';

const OrderItemSummary = ({ item, itemId }) => {
  const { t } = useTranslation();
  const history = useSelector(selectHistory);
  const isHistoryLoading = useSelector(selectIsHistoryLoading);
  const glassOptions = useSelector(selectGlassOptions);

  const itemHistory = history.filter(entry => entry.itemId === itemId);

  return (
    <div className={css.container}>
      <div className={css.history}>
        <h2 className={css.title}>{t('SUMMARY_ITEM_HISTORY')}</h2>
        {isHistoryLoading ? (
          <Loader loadingstate={isHistoryLoading} />
        ) : (
          <ul className={css.historyList}>
            {itemHistory
              .filter(h =>
                [
                  'ITEM_ADDED_TO_ORDER',
                  'ITEM_ADDED',
                  'ITEM_EDITED',
                  'STATUS_OF_ITEM_CHANGED',
                ].includes(h.action)
              )
              .map((h, index) =>
                formatHistoryEntry(
                  h,
                  {
                    glassOptions,
                    actualX: item.sizeX,
                    actualY: item.sizeY,
                  },
                  t
                ).map((line, i) => (
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
