import css from './StatsList.module.css';

const StatsList = ({ orderList, itemList, type }) => {
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
                <span>({totalCreated} vidros)</span>
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
                <span>{totalCompleted} vidros, encomenda completa</span>
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
                <span>fechado {order.completedItems} vidros,</span>
                <span>falta {order.pendingItems} para concluir</span>
              </div>
            );
            break;
          }

          case 'overdues': {
            const totalOverdue = itemList[index] ?? 0;
            content = (
              <div className={css.content}>
                <span>
                  Desde {new Date(order.createdAt).toLocaleDateString('pt-PT')}
                </span>
                <span className={css.clienteName}>
                  <b>EP-{order.EP}</b> {order.client.name}
                </span>
                <span>({totalOverdue} vidros)</span>
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
