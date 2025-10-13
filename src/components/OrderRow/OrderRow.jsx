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
  getOrderById,
  updateOrderItem,
} from '../../redux/orders/operations.js';
import toast from 'react-hot-toast';
import ConfirmDelete from '../ConfirmDelete/ConfirmDelete.jsx';
import {
  selectCurrentOrder,
  selectCurrentPage,
} from '../../redux/orders/selectors.js';
import EditItem from '../EditItem/EditItem.jsx';
import { selectUser } from '../../redux/auth/selectors.js';
import StatusButton from '../StatusButton/StatusButton.jsx';

const OrderRow = ({ item, orderId, itemId }) => {
  const dispatch = useDispatch();
  const currentPage = useSelector(selectCurrentPage);
  const currentOrder = useSelector(selectCurrentOrder);
  const currentUser = useSelector(selectUser);

  const [itemStatus, setItemStatus] = useState(item.status);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const openModal = () => setModalIsOpen(true);
  const closeModal = () => {
    setModalIsOpen(false);
    dispatch(clearCurrentOrder());
  };

  const [confirmIsOpen, setConfirmIsOpen] = useState(false);
  const openConfirm = () => setConfirmIsOpen(true);
  const closeConfirm = () => setConfirmIsOpen(false);

  const [editIsOpen, setEditisOpen] = useState(false);
  const openEdit = async () => {
    try {
      await dispatch(getOrderById(orderId)).unwrap();
      setEditisOpen(true);
    } catch (error) {
      toast.error(error);
    }
  };

  const closeEdit = () => setEditisOpen(false);

  const handleEdit = async values => {
    const currentItemData = {
      category: item.category,
      type: item.type,
      temper: item.temper,
      sizeX: item.sizeX,
      sizeY: item.sizeY,
      sizeZ: item.sizeZ,
      quantity: item.quantity,
      reason: item.reason,
    };

    const duplicate = currentOrder.items.some(
      i =>
        i._id !== item._id &&
        i.category === values.category &&
        i.type === values.type &&
        i.temper === values.temper &&
        i.sizeX === values.sizeX &&
        i.sizeY === values.sizeY &&
        i.sizeZ === values.sizeZ &&
        i.quantity === values.quantity &&
        i.reason === values.reason
    );

    if (duplicate) {
      toast.error(`Item with the same data already exists!`);
      return;
    }

    const isUnchanged =
      values.category === currentItemData.category &&
      values.type === currentItemData.type &&
      values.temper === currentItemData.temper &&
      values.sizeX === currentItemData.sizeX &&
      values.sizeY === currentItemData.sizeY &&
      values.sizeZ === currentItemData.sizeZ &&
      values.quantity === currentItemData.quantity &&
      values.reason === currentItemData.reason;

    if (isUnchanged) {
      toast.error('Item unchanged.');
      return;
    }

    const payload = {
      category: values.category,
      type: values.type,
      temper: values.temper,
      sizeX: values.sizeX,
      sizeY: values.sizeY,
      sizeZ: values.sizeZ,
      quantity: values.quantity,
      reason: values.reason,
    };

    try {
      await dispatch(
        updateOrderItem({ orderId, itemId, values: payload })
      ).unwrap();
      toast.success('Item updated successfully!');
      closeEdit();
    } catch (error) {
      toast.error('Failed to update Item: ' + error);
    }
  };

  const handleDelete = () => {
    dispatch(deleteOrderItem({ orderId, itemId }))
      .unwrap()
      .then(response => {
        if (!response.updatedOrder) {
          toast.success('Order deleted successfully!');
          dispatch(getAllOrders({ page: currentPage, perPage: 10 }));
        } else {
          toast.success('Order item deleted successfully!');
        }
        closeConfirm();
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
        <TableCell>{`${item.category} ${item.type} ${item.sizeZ}`}</TableCell>
        <TableCell>{`${item.sizeX}x${item.sizeY}`}</TableCell>
        <TableCell>{item.quantity}</TableCell>
        <TableCell>{item.status}</TableCell>
        <TableCell>
          {new Date(item.createdAt).toLocaleString('pt-PT', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </TableCell>
        <TableCell>
          <div className={css.actions}>
            <button className={css.btn} onClick={openModal}>
              <NotepadText size={20} color="#163259" strokeWidth={1} />
            </button>
            <button className={css.btn} onClick={openEdit}>
              <Pencil size={20} color="#163259" strokeWidth={1} />
            </button>

            <StatusButton
              orderId={orderId}
              itemId={item._id}
              currentStatus={itemStatus}
              userId={currentUser._id}
              onStatusChange={setItemStatus}
            />

            <button
              className={css.btn}
              onClick={e => {
                e.stopPropagation();
                openConfirm();
              }}
            >
              <Trash2 size={20} color="#ff0000" strokeWidth={1} />
            </button>
          </div>
        </TableCell>
      </TableRow>
      <ModalOverlay isOpen={modalIsOpen} onClose={closeModal}>
        <OrderItemSummary item={item} onClose={closeModal} />
      </ModalOverlay>

      <ModalOverlay isOpen={confirmIsOpen} onClose={closeConfirm}>
        <ConfirmDelete
          onDelete={handleDelete}
          onClose={closeConfirm}
          text={'Tem a certeza de que deseja eliminar este artigo?'}
        />
      </ModalOverlay>

      <ModalOverlay isOpen={editIsOpen} onClose={closeEdit}>
        <EditItem item={item} onSubmit={handleEdit} />
      </ModalOverlay>
    </>
  );
};

export default OrderRow;
