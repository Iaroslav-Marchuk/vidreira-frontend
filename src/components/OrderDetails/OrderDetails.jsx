import ModalOverlay from '../ModalOverlay/ModalOverlay.jsx';

import css from './OrderDetails.module.css';

const OrderDetails = ({ isOpen, onClose }) => {
  return (
    <ModalOverlay isOpen={isOpen} onClose={onClose}>
      <div className={css.container}>
        <div className={css.header}>
          <h2 className={css.title}>Zona info</h2>
          <ul className={css.headerList}>
            <li className={css.headerItem}>
              <span className={css.span}>Zona:</span> L1
            </li>
            <li className={css.headerItem}>
              <span className={css.span}>Operador:</span> Iaroslav
            </li>
            <li className={css.headerItem}>
              <span className={css.span}>Data:</span> 22.02.2022
            </li>
          </ul>
        </div>
        <div className={css.info}>
          <h2 className={css.title}>Vidro info</h2>
          <ul className={css.infoList}>
            <li className={css.infoItem}>
              <span className={css.span}>EP:</span> 12345
            </li>
            <li className={css.infoItem}>
              <span className={css.span}>Cliente:</span> Rodruigues e Almeida
            </li>
            <li className={css.infoItem}>
              <span className={css.span}>Vidro:</span> Cool-lite SKN 183 II 8mm
              9999x9999
            </li>
            <li className={css.infoItem}>
              <span className={css.span}>Quantidade:</span> 10
            </li>
            <li className={css.infoItem}>
              <span className={css.span}>Motivo:</span> Medida Errada
            </li>
          </ul>
        </div>
        <div className={css.history}>
          <h2 className={css.title}>História do pedido</h2>
          <ul className={css.historyList}>
            <li className={css.historyItem}>
              Iaroslav criou pedido 22.02.2022
            </li>
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
    </ModalOverlay>
  );
};

export default OrderDetails;
