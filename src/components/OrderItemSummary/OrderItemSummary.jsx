import css from './OrderItemSummary.module.css';

const OrderItemSummary = () => {
  return (
    <div className={css.container}>
      <div className={css.history}>
        <h2 className={css.title}>História do vidro</h2>
        <ul className={css.historyList}>
          <li className={css.historyItem}>Iaroslav criou pedido 22.02.2022</li>
          <li className={css.historyItem}>
            Iaroslav corrigiu pedido 22.02.2022
          </li>
          <li className={css.historyItem}>
            Bruno mudou estado do pedido para "Em processo" 24.02.2022
          </li>
          <li className={css.historyItem}>
            Iaroslav mudou estado do pedido para "Concluido" 24.02.2022
          </li>
        </ul>
      </div>
    </div>
  );
};

export default OrderItemSummary;
