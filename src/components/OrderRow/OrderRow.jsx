import { useDispatch } from 'react-redux';
import { clearCurrentOrder } from '../../redux/orders/slice.js';
import ModalOverlay from '../ModalOverlay/ModalOverlay.jsx';
import css from './OrderRow.module.css';
import { Pencil, Trash2, NotepadText } from 'lucide-react';

import { TableCell, TableRow } from '@mui/material';
import { useState } from 'react';
import OrderDetails from '../OrderDetails/OrderDetails.jsx';

import OrderItemSummary from '../OrderItemSummary/OrderItemSummary.jsx';

const OrderRow = ({ row }) => {
  const dispatch = useDispatch();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const openModal = () => setModalIsOpen(true);
  const closeModal = () => {
    setModalIsOpen(false);
    dispatch(clearCurrentOrder());
  };

  const handleEdit = () => {};

  const handleDelete = () => {};
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
                onClick={handleDelete}
              />
            </button>
          </div>
        </TableCell>
      </TableRow>
      <ModalOverlay isOpen={modalIsOpen} onClose={closeModal}>
        <OrderItemSummary item={row} onClose={closeModal} />
      </ModalOverlay>
    </>
  );
};

export default OrderRow;
