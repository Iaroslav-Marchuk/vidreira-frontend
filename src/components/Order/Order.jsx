import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';

import OrderDetails from '../OrderDetails/OrderDetails.jsx';

import css from './Order.module.css';

const Order = ({ order, index }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  return (
    <tr className={css.row}>
      <td>{index + 1}</td>
      <td>{order.EP}</td>
      <td className={css.largeCeil}>{order.cliente}</td>
      <td
        className={css.largeCeil}
      >{`${order.items.category} ${order.items.type} ${order.items.sixeZ}`}</td>
      <td>{`${order.items.sizeX}x${order.items.sizeY}`}</td>
      <td>{order.items.quantity}</td>
      <td>{order.items.reason}</td>
      <td>{order.local.zona}</td>

      <td>{order.createdAt}</td>
      <td>
        <div className={css.actions}>
          <button className={css.btn} onClick={openModal}>
            Mais...
          </button>
          <button className={css.btn}>
            <Pencil size={20} color="#163259" strokeWidth={1} />
          </button>
          <button className={css.btn}>
            <Trash2 size={20} color="#ff0000" strokeWidth={1} />
          </button>
        </div>
      </td>
      {modalIsOpen && (
        <OrderDetails isOpen={modalIsOpen} onClose={closeModal} />
      )}
    </tr>
  );
};

export default Order;
