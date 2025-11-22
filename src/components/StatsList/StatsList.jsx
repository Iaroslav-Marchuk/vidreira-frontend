import { useTranslation } from 'react-i18next';

import css from './StatsList.module.css';

const StatsList = ({ orderList, itemList, type }) => {
  const { t } = useTranslation();
  return (
    <ul className={css.statsList}>
      {orderList.map((order, index) => {
        let content = null;
        switch (type) {
          case 'created': {
            const totalCreated = itemList[index] ?? 0;
            content = (
              <div className={css.content}>
                <span className={css.clienteName}>
                  <b>EP-{order.EP}</b> {order.client.name}
                </span>
                <span>{`(${totalCreated} ${t('DASHBOARD_LIST_TEXT_1')})`}</span>
              </div>
            );
            break;
          }

          case 'completed': {
            const totalCompleted = itemList[index] ?? 0;
            content = (
              <div className={css.content}>
                <span className={css.clienteName}>
                  <b>EP-{order.EP}</b> {order.client.name}
                </span>
                <span>{`${totalCompleted} ${t('DASHBOARD_LIST_TEXT_2')}`}</span>
              </div>
            );
            break;
          }

          case 'pending': {
            content = (
              <div className={css.content}>
                <span className={css.clienteName}>
                  <b>EP-{order.EP}</b> {order.client}
                </span>
                <span>{`${t('DASHBOARD_LIST_TEXT_3')} ${
                  order.completedItems
                } ${t('DASHBOARD_LIST_TEXT_1')},`}</span>
                <span>{`${t('DASHBOARD_LIST_TEXT_4')} ${order.pendingItems} ${t(
                  'DASHBOARD_LIST_TEXT_5'
                )}`}</span>
              </div>
            );
            break;
          }

          case 'delayed': {
            const totalDelayed = itemList[index] ?? 0;
            content = (
              <div className={css.content}>
                <span>
                  {`${t('DASHBOARD_LIST_TEXT_6')} 
                  ${new Date(order.createdAt).toLocaleDateString('pt-PT')}`}
                </span>
                <span className={css.clienteName}>
                  <b>EP-{order.EP}</b> {order.client.name}
                </span>
                <span>{`(${totalDelayed} ${t('DASHBOARD_LIST_TEXT_1')})`}</span>
              </div>
            );
            break;
          }

          default:
            content = null;
        }

        return (
          <li key={index} className={css.statsItem}>
            {content}
          </li>
        );
      })}
    </ul>
  );
};

export default StatsList;
