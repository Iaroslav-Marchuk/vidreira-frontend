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
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';

import OrderRow from '../OrderRow/OrderRow.jsx';
import ConfirmDelete from '../ConfirmDelete/ConfirmDelete.jsx';
import ModalOverlay from '../ModalOverlay/ModalOverlay.jsx';
import OrderSummary from '../OrderSummary/OrderSummary.jsx';
import EditOrder from '../EditOrder/EditOrder.jsx';

import {
  deleteOrder,
  getAllOrders,
  getOrderById,
  getOrderHistory,
  updateOrder,
} from '../../redux/orders/operations.js';
import { clearCurrentOrder } from '../../redux/orders/slice.js';

import {
  selectAllOrders,
  selectCurrentPage,
  selectPerPage,
  selectSearchQuery,
  selectSortBy,
  selectSortOrder,
} from '../../redux/orders/selectors.js';
import { selectRole, selectUser } from '../../redux/auth/selectors.js';
import { selectRolesList } from '../../redux/roles/selectors.js';

import { roleCanDo } from '../../utils/roleCanDo.js';

import css from './OrderCollapse.module.css';

const OrderCollapse = ({
  order,
  orderId,
  isOpen,
  toggleCollapse,
  isArchive,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const allOrders = useSelector(selectAllOrders);

  const currentPage = useSelector(selectCurrentPage);
  const perPage = useSelector(selectPerPage);
  const sortBy = useSelector(selectSortBy);
  const sortOrder = useSelector(selectSortOrder);
  const searchQuery = useSelector(selectSearchQuery);

  const role = useSelector(selectRole);
  const rolesList = useSelector(selectRolesList);
  const user = useSelector(selectUser);
  const userId = user._id;

  const isEditableStatus = order.status === 'CREATED';
  const canEdit =
    isEditableStatus &&
    roleCanDo(rolesList, role, 'edit') &&
    order.owner === userId;

  const canDelete =
    isEditableStatus &&
    roleCanDo(rolesList, role, 'delete') &&
    order.owner === userId;

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

  const handleMore = async () => {
    try {
      const order = await dispatch(getOrderById(orderId)).unwrap();
      await dispatch(getOrderHistory(orderId)).unwrap();
      if (!order) {
        toast.error(t('ORDER_NOT_FOUND'));
        return;
      }
      openModal();
    } catch (error) {
      toast.error(t('ORDER_NO_LOAD'), error);
    }
  };

  const handleEdit = async values => {
    const currentOrderData = {
      EP: order.EP,
      client: order.client.name,
      local: order.local.zona,
    };

    const newOrderData = {
      EP: Number(values.EP),
      client: values.client,
      local: values.local.zona,
    };

    const duplicateEPInSameZone = allOrders.some(
      o =>
        o._id !== order._id &&
        o.EP === Number(values.EP) &&
        o.local.zona === values.local.zona
    );

    if (duplicateEPInSameZone) {
      toast.error(
        `${t('ORDER_DUPLICATE_1')} ${values.EP} ${t('ORDER_DUPLICATE_2')} ${
          values.local.zona
        }!`
      );
      return;
    }

    const differentClientForSameEP = allOrders.find(
      o =>
        o._id !== order._id &&
        o.EP === Number(values.EP) &&
        o.client.name !== values.client
    );

    if (differentClientForSameEP) {
      toast.error(
        `${t('ORDER_DUPLICATE_1')}P ${values.EP} ${t('ORDER_DUPLICATE_3')}: "${
          differentClientForSameEP.client.name
        }".`
      );
      return;
    }

    const hasNewItems = Array.isArray(values.items) && values.items.length > 0;

    const isUnchanged =
      currentOrderData.EP === newOrderData.EP &&
      currentOrderData.client === newOrderData.client &&
      currentOrderData.local === newOrderData.local &&
      !hasNewItems;

    if (isUnchanged) {
      toast.error(t('ORDER_UNCHANGED'));
      return;
    }

    const payload = {
      EP: Number(values.EP),
      client: values.client,
      local: { zona: values.local.zona },
      items: values.items.map(item => ({
        category: item.category,
        type: item.type,
        temper: Boolean(item.temper),
        sizeX: Number(item.sizeX),
        sizeY: Number(item.sizeY),
        sizeZ: String(item.sizeZ),
        quantity: Number(item.quantity),
        reason: item.reason,
      })),
    };

    try {
      await dispatch(updateOrder({ orderId, values: payload })).unwrap();
      toast.success(t('ORDER_UPDATE_SUCCESS'));
      closeEdit();
    } catch (error) {
      toast.error(t('ORDER_UPDATE_FAILED') + error);
    }
  };

  const handleDelete = () => {
    dispatch(deleteOrder(orderId))
      .unwrap()
      .then(() => {
        toast.success(t('ORDER_DELETED_SUCCESS'));

        dispatch(
          getAllOrders({
            page: currentPage,
            perPage,
            sortBy,
            sortOrder,
            filter: searchQuery ? { client: searchQuery } : {},
          })
        );
      })
      .catch(() => {
        toast.error(t('ORDER_DELETED_FAILED'));
      })
      .finally(() => {
        closeConfirm();
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
            fontSize: '12px',
            padding: '4px',
          },

          '@media (min-width: 1240px)': {
            '& .MuiTableCell-root': {
              fontSize: '16px',
              padding: '8px',
            },
          },
        }}
      >
        <TableCell>
          <IconButton size="small" onClick={toggleCollapse}>
            {isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{order.EP}</TableCell>
        <TableCell>{order.client.name}</TableCell>
        {!isArchive && (
          <TableCell>
            {order.items
              .filter(item => item.status !== 'FINISHED')
              .reduce((total, item) => total + item.quantity, 0)}
          </TableCell>
        )}

        <TableCell>{t(`STATUS_${order.status}`)}</TableCell>
        <TableCell>{t(`LOCAL_${order.local.zona}`)}</TableCell>
        <TableCell>
          {isArchive
            ? new Date(order.updatedAt).toLocaleDateString('pt-PT')
            : new Date(order.createdAt).toLocaleDateString('pt-PT')}
        </TableCell>
        <TableCell>
          <div className={css.actions}>
            <button className={css.btn} onClick={handleMore}>
              <NotepadText size={20} color="#163259" strokeWidth={1} />
            </button>

            {!isArchive && (
              <>
                <button
                  className={css.btn}
                  onClick={openEdit}
                  disabled={!canEdit}
                >
                  <Pencil
                    size={20}
                    color={!canEdit ? '#999' : '#163259'}
                    strokeWidth={1}
                  />
                </button>

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
              </>
            )}
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
                        fontSize: '12px',
                        padding: '4px',
                      },

                      '@media (min-width: 1240px)': {
                        '& .MuiTableCell-root': {
                          fontSize: '16px',
                          padding: '16px',
                        },
                      },
                    }}
                  >
                    <TableCell>{t('TABLE_HEAD_TYPE')}</TableCell>
                    <TableCell>{t('TABLE_HEAD_SIZE')}</TableCell>
                    <TableCell>{t('TABLE_HEAD_QUANTITY')}</TableCell>
                    <TableCell>{t('TABLE_HEAD_STATUS')}</TableCell>
                    <TableCell>
                      {isArchive
                        ? t('TABLE_HEAD_FINISH_DATA')
                        : t('TABLE_HEAD_CREATE_DATA')}
                    </TableCell>
                    <TableCell>{t('TABLE_HEAD_REASON')}</TableCell>
                    <TableCell>{t('TABLE_HEAD_ACTIONS')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.items.map((item, i) => (
                    <OrderRow
                      key={item._id}
                      item={item}
                      index={i}
                      itemId={item._id}
                      orderId={order._id}
                      ownerId={order.owner}
                      isArchive={isArchive}
                    />
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
      <ModalOverlay isOpen={modalIsOpen} onClose={closeModal}>
        <OrderSummary history={history} onClose={closeModal} />
      </ModalOverlay>

      <ModalOverlay isOpen={confirmIsOpen} onClose={closeConfirm}>
        <ConfirmDelete
          onDelete={handleDelete}
          onClose={closeConfirm}
          text={t('ORDER_CONFIRM')}
        />
      </ModalOverlay>

      <ModalOverlay isOpen={editIsOpen} onClose={closeEdit}>
        <EditOrder order={order} onSubmit={handleEdit} />
      </ModalOverlay>
    </>
  );
};

export default OrderCollapse;
