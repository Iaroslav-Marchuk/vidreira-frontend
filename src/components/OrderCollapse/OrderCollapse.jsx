import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Collapse,
  IconButton,
} from '@mui/material';
import {
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
} from '@mui/icons-material';
import { useState } from 'react';
import { Pencil, Trash2, NotepadText } from 'lucide-react';

import OrderRow from '../OrderRow/OrderRow.jsx';

import css from './OrderCollapse.module.css';
import { useDispatch } from 'react-redux';
import { deleteOrder, getOrderById } from '../../redux/orders/operations.js';
import ModalOverlay from '../ModalOverlay/ModalOverlay.jsx';
import OrderDetails from '../OrderDetails/OrderDetails.jsx';
import { clearCurrentOrder } from '../../redux/orders/slice.js';
import toast from 'react-hot-toast';
import ConfirmDelete from '../ConfirmDelete/ConfirmDelete.jsx';

const OrderCollapse = ({ order, orderId }) => {
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const openModal = () => setModalIsOpen(true);
  const closeModal = () => {
    setModalIsOpen(false);
    dispatch(clearCurrentOrder());
  };

  const [confirm, setConfirm] = useState(false);
  const openConfirm = () => setConfirm(true);
  const closeConfirm = () => setConfirm(false);

  const handleMore = async () => {
    try {
      await dispatch(getOrderById(orderId)).unwrap();
      openModal();
    } catch (error) {
      console.error('Failed to fetch order:', error);
    }
  };

  const handleEdit = () => {};

  const handleDelete = () => {
    dispatch(deleteOrder(orderId))
      .unwrap()
      .then(() => {
        toast.success('Order deleted successfully!');
        closeConfirm();
      })
      .catch(() => {
        toast.error('Failed to delete order.');
      });
  };

  return (
    <>
      <TableRow
        sx={{
          '& > *': { borderBottom: 'unset' },
          '& .MuiTableCell-root': {
            textAlign: 'center',
            verticalAlign: 'middle',
          },
        }}
      >
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{order.EP}</TableCell>
        <TableCell>{order.cliente}</TableCell>
        <TableCell>{order.items.length}</TableCell>
        <TableCell>{order.status}</TableCell>
        <TableCell>{order.local.zona}</TableCell>
        <TableCell>
          {new Date(order.createdAt).toLocaleDateString('pt-PT')}
        </TableCell>
        <TableCell>
          <div className={css.actions}>
            <button className={css.btn}>
              <NotepadText
                size={20}
                color="#163259"
                strokeWidth={1}
                onClick={handleMore}
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
      <TableRow>
        <TableCell colSpan={8} sx={{ paddingBottom: 0, paddingTop: 0 }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Table size="small" aria-label="items">
                <TableHead>
                  <TableRow
                    sx={{
                      backgroundColor: 'var(--color-btn-disabled-txt)',
                      '& .MuiTableCell-root': {
                        textAlign: 'center',
                        verticalAlign: 'middle',
                        fontWeight: 'bold',
                        borderBottom: '1px solid rgba(0,0,0,0.12)',
                      },
                    }}
                  >
                    <TableCell>Vidro</TableCell>
                    <TableCell>Medida</TableCell>
                    <TableCell>Qtde</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell>Data</TableCell>
                    <TableCell>Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.items.map((item, i) => (
                    <OrderRow
                      key={item._id}
                      row={item}
                      index={i}
                      itemId={item._id}
                      orderId={order._id}
                    />
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
      <ModalOverlay isOpen={modalIsOpen} onClose={closeModal}>
        <OrderDetails orderId={orderId} onClose={closeModal} />
      </ModalOverlay>

      {confirm && (
        <ConfirmDelete
          onDelete={handleDelete}
          onClose={closeConfirm}
          isOpen={confirm}
        />
      )}
    </>
  );
};

export default OrderCollapse;
