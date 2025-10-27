import css from './StatsList.module.css';

const StatsList = ({ orderList, itemList, type }) => {
  return (
    <ul className={css.statsList}>
      {orderList.map((order, index) => {
        let text = '';
        switch (type) {
          case 'created': {
            const totalCreated = itemList[index] ?? 0;
            text = `EP-${order.EP} - ${order.client.name} (${totalCreated} vidros)`;
            break;
          }

          case 'completed': {
            const totalCompleted = itemList[index] ?? 0;
            text = `EP-${order.EP} - ${order.client.name} (${totalCompleted} vidros), encomenda completa`;
            break;
          }

          case 'pending': {
            text = `EP-${order.EP} - ${order.client} - ${order.completedItems} vidros, falta ${order.pendingItems} para concluir`;
            break;
          }

          case 'overdues': {
            const totalOverdue = itemList[index] ?? 0;
            text = `${new Date(order.createdAt).toLocaleDateString(
              'pt-PT'
            )} EP-${order.EP} - ${order.client.name} (${totalOverdue} vidros)`;
            break;
          }

          default:
            text = '';
        }

        return (
          <li key={index} className={css.statsItem}>
            {text}
          </li>
        );
      })}
    </ul>
  );
};

export default StatsList;
