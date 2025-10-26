import css from './StatsList.module.css';

const StatsList = ({ orderList, itemList, isOverdues }) => {
  return (
    <ul className={css.statsList}>
      {orderList.map((order, index) => {
        const totalItems = itemList[index] ?? 0;

        return (
          <li key={index} className={css.statsItem}>
            {isOverdues
              ? `${new Date(order.createdAt).toLocaleDateString('pt-PT')} EP-${
                  order.EP
                } - ${order.client.name} (${totalItems} vidros)`
              : `EP-${order.EP} - ${order.client.name} (${totalItems} vidros)`}
          </li>
        );
      })}
    </ul>
  );
};

export default StatsList;
