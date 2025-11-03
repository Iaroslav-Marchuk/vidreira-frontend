import { useDispatch, useSelector } from 'react-redux';
import { TableCell, TableRow } from '@mui/material';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Pencil, Trash2, NotepadText } from 'lucide-react';

import ModalOverlay from '../ModalOverlay/ModalOverlay.jsx';
import ConfirmDelete from '../ConfirmDelete/ConfirmDelete.jsx';
import OrderItemSummary from '../OrderItemSummary/OrderItemSummary.jsx';
import EditItem from '../EditItem/EditItem.jsx';
import StatusButton from '../StatusButton/StatusButton.jsx';

import { roleCanDo } from '../../utils/roleCanDo.js';
import { formatText } from '../../utils/formatText.js';

import { selectRole, selectUser } from '../../redux/auth/selectors.js';

import { clearHistory } from '../../redux/orders/slice.js';

import {
  deleteOrderItem,
  getAllOrders,
  getOrderById,
  getOrderHistory,
  updateOrderItem,
} from '../../redux/orders/operations.js';

import {
  selectCurrentOrder,
  selectCurrentPage,
  selectPerPage,
  selectSearchQuery,
  selectSortBy,
  selectSortOrder,
} from '../../redux/orders/selectors.js';

import { selectGlassOptions } from '../../redux/glass/selectors.js';
import { selectRolesList } from '../../redux/roles/selectors.js';

import css from './OrderRow.module.css';

const OrderRow = ({ item, orderId, itemId, ownerId, isArchive }) => {
  const dispatch = useDispatch();
  const glassOptions = useSelector(selectGlassOptions);
  const currentPage = useSelector(selectCurrentPage);
  const currentOrder = useSelector(selectCurrentOrder);
  const currentUser = useSelector(selectUser);

  const perPage = useSelector(selectPerPage);
  const sortBy = useSelector(selectSortBy);
  const sortOrder = useSelector(selectSortOrder);
  const searchQuery = useSelector(selectSearchQuery);

  const role = useSelector(selectRole);
  const rolesList = useSelector(selectRolesList);
  const user = useSelector(selectUser);
  const userId = user._id;

  const canEdit =
    roleCanDo(rolesList, role, 'edit') &&
    ownerId === userId &&
    item.status === 'Criado';
  const canDelete =
    roleCanDo(rolesList, role, 'delete') &&
    ownerId === userId &&
    item.status === 'Criado';

  const [itemStatus, setItemStatus] = useState(item.status);

  const [historyIsOpen, setHistoryIsOpen] = useState(false);

  const openHistory = async () => {
    try {
      await dispatch(getOrderHistory(orderId)).unwrap();
      setHistoryIsOpen(true);
    } catch (error) {
      toast.error('Failed to load history ' + error);
    }
  };

  const closeHistory = () => {
    setHistoryIsOpen(false);
    dispatch(clearHistory());
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

  const handleStatusChange = newStatus => {
    setItemStatus(newStatus);

    if (newStatus === 'Concluído') {
      let filter = {};
      if (searchQuery) {
        if (!isNaN(Number(searchQuery))) {
          filter.EP = Number(searchQuery);
        } else {
          filter.client = searchQuery;
        }
      }

      dispatch(
        getAllOrders({
          page: currentPage,
          perPage,
          sortBy,
          sortOrder,
          filter,
        })
      );
    }
  };

  return (
    <>
      <TableRow
        sx={{
          backgroundColor: 'var(--color-btn-disabled-txt)',
          '& .MuiTableCell-root': {
            textAlign: 'center',
            verticalAlign: 'middle',
            color: item.status === 'Concluído' ? '#999' : 'inherit',
          },
        }}
      >
        <TableCell>{formatText(item, glassOptions)}</TableCell>
        <TableCell>{`${item.sizeX}x${item.sizeY}`}</TableCell>
        <TableCell>{item.quantity}</TableCell>
        <TableCell>{itemStatus}</TableCell>
        <TableCell>
          {new Date(isArchive ? item.updatedAt : item.createdAt).toLocaleString(
            'pt-PT',
            {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            }
          )}
        </TableCell>
        <TableCell>{item.reason}</TableCell>
        <TableCell>
          <div className={css.actions}>
            <button className={css.btn} onClick={openHistory}>
              <NotepadText size={20} color="#163259" strokeWidth={1} />
            </button>

            <button className={css.btn} onClick={openEdit} disabled={!canEdit}>
              <Pencil
                size={20}
                color={!canEdit ? '#999' : '#163259'}
                strokeWidth={1}
              />
            </button>

            <StatusButton
              orderId={orderId}
              itemId={item._id}
              currentStatus={itemStatus}
              userId={currentUser._id}
              onStatusChange={handleStatusChange}
            />

            <button
              className={css.btn}
              onClick={e => {
                e.stopPropagation();
                openConfirm();
              }}
              disabled={!canDelete}
            >
              <Trash2
                size={20}
                color={!canDelete ? '#999' : '#ff0000'}
                strokeWidth={1}
              />
            </button>
          </div>
        </TableCell>
      </TableRow>
      <ModalOverlay isOpen={historyIsOpen} onClose={closeHistory}>
        <OrderItemSummary item={item} itemId={itemId} onClose={closeHistory} />
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
