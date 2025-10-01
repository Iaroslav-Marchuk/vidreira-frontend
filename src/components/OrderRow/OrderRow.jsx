import { useDispatch, useSelector } from 'react-redux';
import { clearCurrentOrder } from '../../redux/orders/slice.js';
import ModalOverlay from '../ModalOverlay/ModalOverlay.jsx';
import css from './OrderRow.module.css';
import { Pencil, Trash2, NotepadText } from 'lucide-react';

import { TableCell, TableRow } from '@mui/material';
import { useState } from 'react';

import OrderItemSummary from '../OrderItemSummary/OrderItemSummary.jsx';
import {
  deleteOrderItem,
  getAllOrders,
} from '../../redux/orders/operations.js';
import toast from 'react-hot-toast';
import ConfirmDelete from '../ConfirmDelete/ConfirmDelete.jsx';
import { selectCurrentPage } from '../../redux/orders/selectors.js';

const OrderRow = ({ row, orderId, itemId }) => {
  const dispatch = useDispatch();
  const currentPage = useSelector(selectCurrentPage);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const openModal = () => setModalIsOpen(true);
  const closeModal = () => {
    setModalIsOpen(false);
    dispatch(clearCurrentOrder());
  };

  const [confirmIsOpen, setConfirmIsOpen] = useState(false);
  const openConfirm = () => setConfirmIsOpen(true);
  const closeConfirm = () => setConfirmIsOpen(false);

  const handleEdit = () => {};

  const handleDelete = () => {
    dispatch(deleteOrderItem({ orderId, itemId }))
      .unwrap()
      .then(response => {
        toast.success('Order item deleted successfully!');
        closeConfirm();
        if (!response) {
          dispatch(getAllOrders({ page: currentPage, perPage: 10 }));
        }
      })
      .catch(() => {
        toast.error('Failed to delete order item!');
      });
  };

  return (
    <>
      <TableRow
        sx={{
          backgroundColor: 'var(--color-btn-disabled-txt)',
          '& .MuiTableCell-root': {
            textAlign: 'center',
            verticalAlign: 'middle',
          },
        }}
      >
        <TableCell>{`${row.category} ${row.type} ${row.sizeZ}`}</TableCell>
        <TableCell>{`${row.sizeX}x${row.sizeY}`}</TableCell>
        <TableCell>{row.quantity}</TableCell>
        <TableCell>{row.status}</TableCell>
        <TableCell>
          {new Date(row.createdAt).toLocaleString('pt-PT', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </TableCell>
        <TableCell>
          <div className={css.actions}>
            <button className={css.btn}>
              <NotepadText
                size={20}
                color="#163259"
                strokeWidth={1}
                onClick={openModal}
              />
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
                onClick={e => {
                  e.stopPropagation();
                  openConfirm();
                }}
              />
            </button>
          </div>
        </TableCell>
      </TableRow>
      <ModalOverlay isOpen={modalIsOpen} onClose={closeModal}>
        <OrderItemSummary item={row} onClose={closeModal} />
      </ModalOverlay>

      <ModalOverlay isOpen={confirmIsOpen} onClose={closeConfirm}>
        <ConfirmDelete
          onDelete={handleDelete}
          onClose={closeConfirm}
          text={'Tem a certeza de que deseja eliminar este artigo?'}
        />
      </ModalOverlay>
    </>
  );
};

export default OrderRow;
