import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';

import OrderDetails from '../OrderDetails/OrderDetails.jsx';

import css from './Order.module.css';
import { useDispatch } from 'react-redux';
import { getOrderById } from '../../redux/orders/operations.js';
import ModalOverlay from '../ModalOverlay/ModalOverlay.jsx';
import { clearCurrentOrder } from '../../redux/orders/slice.js';

const Order = ({ row, index, itemId, orderId }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const openModal = () => setModalIsOpen(true);
  const closeModal = () => {
    setModalIsOpen(false);
    dispatch(clearCurrentOrder());
  };

  const dispatch = useDispatch();

  const handleClick = async () => {
    try {
      await dispatch(getOrderById(orderId)).unwrap();
      openModal();
    } catch (error) {
      console.error('Failed to fetch order:', error);
    }
  };

  return (
    <tr className={css.row}>
      <td>{index + 1}</td>
      <td>{row.EP}</td>
      <td className={css.largeCeil}>{row.cliente}</td>
      <td
        className={css.largeCeil}
      >{`${row.category} ${row.type} ${row.sizeZ}`}</td>
      <td>{`${row.sizeX}x${row.sizeY}`}</td>
      <td>{row.quantity}</td>
      <td>{row.status}</td>
      <td>{row.zona}</td>

      <td> {new Date(row.createdAt).toLocaleDateString('pt-PT')}</td>
      <td>
        <div className={css.actions}>
          <button className={css.btn} onClick={handleClick}>
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
      <ModalOverlay isOpen={modalIsOpen} onClose={closeModal}>
        <OrderDetails itemId={itemId} onClose={closeModal} />
      </ModalOverlay>
    </tr>
  );
};

export default Order;
