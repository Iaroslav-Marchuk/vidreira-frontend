import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import Loader from '../Loader/Loader.jsx';

import {
  selectCurrentOrder,
  selectHistory,
  selectIsHistoryLoading,
  selectIsOrdersLoading,
} from '../../redux/orders/selectors.js';
import { getOrderHistory } from '../../redux/orders/operations.js';
import { formatHistoryEntry } from '../../utils/formatHistory.js';
import { selectGlassOptions } from '../../redux/glass/selectors.js';

import css from './OrderSummary.module.css';

const OrderSummary = () => {
  const { t } = useTranslation();
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
        <h2 className={css.title}>{t('SUMMARY_INFO')}</h2>
        <ul className={css.infoList}>
          <li className={css.infoItem}>
            <span className={css.span}>EP:</span> {currentOrder.EP}
          </li>
          <li className={css.infoItem}>
            <span className={css.span}>{t('SUMMARY_CLIENT')}</span>{' '}
            {currentOrder.client.name}
          </li>
          <li className={css.infoItem}>
            <span className={css.span}>{t('SUMMARY_ZONE')}</span>{' '}
            {t(`LOCAL_${currentOrder.local.zona}`)}
          </li>
          <li className={css.infoItem}>
            <span className={css.span}>{t('SUMMARY_OPERATOR')}</span>{' '}
            {currentOrder.owner.name}
          </li>
          <li className={css.infoItem}>
            <span className={css.span}>{t('SUMMARY_INCOMPLETED')}</span>{' '}
            {currentOrder.items
              .filter(item => item.status !== 'FINISHED')
              .reduce((sum, item) => sum + item.quantity, 0)}
          </li>
          <li className={css.infoItem}>
            <span className={css.span}>{t('SUMMARY_PANDING')}</span>{' '}
            {currentOrder.items
              .filter(item => item.status === 'CREATED')
              .reduce((sum, item) => sum + item.quantity, 0)}
          </li>
          <li className={css.infoItem}>
            <span className={css.span}>{t('SUMMARY_IN_PROGRESS')}</span>{' '}
            {currentOrder.items
              .filter(item => item.status === 'IN_PROGRESS')
              .reduce((sum, item) => sum + item.quantity, 0)}
          </li>
          <li className={css.infoItem}>
            <span className={css.span}>{t('SUMMARY_FINISHED')}</span>{' '}
            {currentOrder.items
              .filter(item => item.status === 'FINISHED')
              .reduce((sum, item) => sum + item.quantity, 0)}
          </li>
        </ul>
      </div>

      <div className={css.history}>
        <h2 className={css.title}>{t('SUMMARY_ORDER_HISTORY')}</h2>

        {isHistoryLoading ? (
          <Loader loadingstate={isHistoryLoading} />
        ) : (
          <ul className={css.historyList}>
            {history
              .filter(h =>
                [
                  'ORDER_CREATED',
                  'ORDER_EDITED',
                  'ITEM_ADDED',
                  'ITEM_DELETED',
                  'STATUS_OF_ORDER_CHANGED',
                ].includes(h.action)
              )
              .map((h, index) =>
                formatHistoryEntry(h, { glassOptions }, t).map((line, i) => (
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
