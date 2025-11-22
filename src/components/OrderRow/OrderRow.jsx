import { useDispatch, useSelector } from 'react-redux';
import { TableCell, TableRow } from '@mui/material';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Pencil, Trash2, NotepadText } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import ModalOverlay from '../ModalOverlay/ModalOverlay.jsx';
import ConfirmDelete from '../ConfirmDelete/ConfirmDelete.jsx';
import OrderItemSummary from '../OrderItemSummary/OrderItemSummary.jsx';
import EditItem from '../EditItem/EditItem.jsx';
import StatusButton from '../StatusButton/StatusButton.jsx';

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

import { roleCanDo } from '../../utils/roleCanDo.js';
import { formatText } from '../../utils/formatText.js';

import css from './OrderRow.module.css';

const OrderRow = ({ item, orderId, itemId, ownerId, isArchive }) => {
  const { t } = useTranslation();
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
    item.status === 'CREATED';
  const canDelete =
    roleCanDo(rolesList, role, 'delete') &&
    ownerId === userId &&
    item.status === 'CREATED';

  const [itemStatus, setItemStatus] = useState(item.status);

  const [historyIsOpen, setHistoryIsOpen] = useState(false);

  const openHistory = async () => {
    try {
      await dispatch(getOrderHistory(orderId)).unwrap();
      setHistoryIsOpen(true);
    } catch (error) {
      toast.error(t('HISTORY_FAILED') + error);
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
      toast.error(t('ITEM_DUPLICATE'));
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
      toast.error(t('ITEM_UNCHANGED'));
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
      toast.success(t('ITEM_UPDATE_SUCCESS'));
      closeEdit();
    } catch (error) {
      toast.error(t('ITEM_UPDATE_FAILED') + error);
    }
  };

  const handleDelete = () => {
    dispatch(deleteOrderItem({ orderId, itemId }))
      .unwrap()
      .then(response => {
        if (!response.updatedOrder) {
          toast.success(t('ORDER_DELETED_SUCCESS'));
          dispatch(getAllOrders({ page: currentPage, perPage: 10 }));
        } else {
          toast.success(t('ITEM_DELETED_SUCCESS'));
        }
        closeConfirm();
      })
      .catch(() => {
        toast.error(t('ITEM_DELETED_FAILED'));
      });
  };

  const handleStatusChange = newStatus => {
    setItemStatus(newStatus);

    if (newStatus === 'FINISHED') {
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
            fontSize: '12px',
            padding: '4px',
          },

          '@media (min-width: 1240px)': {
            '& .MuiTableCell-root': {
              fontSize: '16px',
              padding: '12px',
            },
          },
        }}
      >
        <TableCell>{formatText(item, glassOptions)}</TableCell>
        <TableCell>{`${item.sizeX}x${item.sizeY}`}</TableCell>
        <TableCell>{item.quantity}</TableCell>
        <TableCell>{t(`STATUS_${itemStatus}`)}</TableCell>
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
          text={t('ITEM_CONFIRM')}
        />
      </ModalOverlay>

      <ModalOverlay isOpen={editIsOpen} onClose={closeEdit}>
        <EditItem item={item} onSubmit={handleEdit} />
      </ModalOverlay>
    </>
  );
};

export default OrderRow;
