import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';

import OrderDetails from '../OrderDetails/OrderDetails.jsx';

import css from './Order.module.css';
import { useDispatch } from 'react-redux';
import { getOrderById } from '../../redux/orders/operations.js';
import ModalOverlay from '../ModalOverlay/ModalOverlay.jsx';
import { clearCurrentOrder } from '../../redux/orders/slice.js';

const Order = ({ row, itemId, orderId }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const openModal = () => setModalIsOpen(true);
  const closeModal = () => {
    setModalIsOpen(false);
    dispatch(clearCurrentOrder());
  };

  const dispatch = useDispatch();

  const handleMore = async () => {
    try {
      await dispatch(getOrderById(orderId)).unwrap();
      openModal();
    } catch (error) {
      console.error('Failed to fetch order:', error);
    }
  };

  const handleEdit = () => {};

  const handleDelete = () => {};

  return (
    <tr className={css.row}>
      <td
        className={css.largeCeil}
      >{`${row.category} ${row.type} ${row.sizeZ}`}</td>
      <td>{`${row.sizeX}x${row.sizeY}`}</td>
      <td>{row.quantity}</td>
      <td>{row.status}</td>

      <td> {new Date(row.createdAt).toLocaleDateString('pt-PT')}</td>
      <td>
        <div className={css.actions}>
          <button className={css.btn} onClick={handleMore}>
            Mais...
          </button>
          <button className={css.btn}>
            <Pencil
              size={20}
              color="#163259"
              strokeWidth={1}
              onClick={handleEdit}
            />
          </button>
          <button className={css.btn}>
            <Trash2
              size={20}
              color="#ff0000"
              strokeWidth={1}
              onClick={handleDelete}
            />
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
