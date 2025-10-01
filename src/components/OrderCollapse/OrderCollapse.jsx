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
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';

import OrderRow from '../OrderRow/OrderRow.jsx';
import ConfirmDelete from '../ConfirmDelete/ConfirmDelete.jsx';
import ModalOverlay from '../ModalOverlay/ModalOverlay.jsx';

import {
  deleteOrder,
  getAllOrders,
  getOrderById,
} from '../../redux/orders/operations.js';
import { clearCurrentOrder } from '../../redux/orders/slice.js';

import css from './OrderCollapse.module.css';
import OrderSummary from '../OrderSummary/OrderSummary.jsx';
import { selectCurrentPage } from '../../redux/orders/selectors.js';

const OrderCollapse = ({ order, orderId, isOpen, toggleCollapse }) => {
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

  const handleMore = async () => {
    try {
      const order = await dispatch(getOrderById(orderId)).unwrap();
      if (!order) {
        toast.error('Order not found!');
        return;
      }
      openModal();
    } catch (error) {
      console.error('Failed to fetch order:', error);
      toast.error('Failed to load order');
    }
  };

  const handleEdit = () => {};

  const handleDelete = () => {
    dispatch(deleteOrder(orderId))
      .unwrap()
      .then(() => {
        toast.success('Order deleted successfully!');
        closeConfirm();
        dispatch(getAllOrders({ page: currentPage, perPage: 10 }));
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
          <IconButton size="small" onClick={toggleCollapse}>
            {isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{order.EP}</TableCell>
        <TableCell>{order.cliente}</TableCell>
        <TableCell>
          {order.items
            .filter(item => item.status !== 'Concluído')
            .reduce((total, item) => total + item.quantity, 0)}
        </TableCell>

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
          <Collapse in={isOpen} timeout="auto" unmountOnExit>
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
        <OrderSummary onClose={closeModal} />
      </ModalOverlay>

      <ModalOverlay isOpen={confirmIsOpen} onClose={closeConfirm}>
        <ConfirmDelete
          onDelete={handleDelete}
          onClose={closeConfirm}
          text={'Tem a certeza de que deseja eliminar esta encomenda?'}
        />
      </ModalOverlay>
    </>
  );
};

export default OrderCollapse;
