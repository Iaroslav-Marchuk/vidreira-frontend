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
  getOrderHistory,
  updateOrder,
} from '../../redux/orders/operations.js';
import { clearCurrentOrder } from '../../redux/orders/slice.js';

import css from './OrderCollapse.module.css';
import OrderSummary from '../OrderSummary/OrderSummary.jsx';
import {
  selectAllOrders,
  selectCurrentPage,
  selectPerPage,
  selectRolesList,
  selectSearchQuery,
  selectSortBy,
  selectSortOrder,
} from '../../redux/orders/selectors.js';
import EditOrder from '../EditOrder/EditOrder.jsx';
import { selectRole, selectUser } from '../../redux/auth/selectors.js';
import { roleCanDo } from '../../utils/roleCanDo.js';

const OrderCollapse = ({
  order,
  orderId,
  isOpen,
  toggleCollapse,
  isArchive,
}) => {
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

  const isEditableStatus = order.status === 'Criado';
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
        toast.error('Order not found!');
        return;
      }
      openModal();
    } catch (error) {
      console.error('Failed to fetch order:', error);
      toast.error('Failed to load order');
    }
  };

  const handleEdit = async values => {
    const currentOrderData = {
      EP: order.EP,
      client: order.client.name,
      local: { zona: order.local.zona },
    };

    const duplicateEPInSameZone = allOrders.some(
      o =>
        o._id !== order._id &&
        o.EP === Number(values.EP) &&
        o.local.zona === values.local.zona
    );

    if (duplicateEPInSameZone) {
      toast.error(
        `Order with EP ${values.EP} already exists in zone ${values.local.zona}!`
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
        `Order with EP ${values.EP} already exists with a different client: "${differentClientForSameEP.client.name}".`
      );
      return;
    }

    const isUnchanged =
      values.EP === currentOrderData.EP &&
      values.client === currentOrderData.client &&
      values.local.zona === currentOrderData.local.zona &&
      JSON.stringify(values.items || []) === JSON.stringify(order.items || []);
    if (isUnchanged) {
      toast.error('Order unchanged.');
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
      toast.success('Order updated successfully!');
      closeEdit();
    } catch (error) {
      toast.error('Failed to update order: ' + error);
    }
  };

  const handleDelete = () => {
    dispatch(deleteOrder(orderId))
      .unwrap()
      .then(() => {
        toast.success('Order deleted successfully!');

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
        toast.error('Failed to delete order.');
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
              .filter(item => item.status !== 'Concluído')
              .reduce((total, item) => total + item.quantity, 0)}
          </TableCell>
        )}

        <TableCell>{order.status}</TableCell>
        <TableCell>{order.local.zona}</TableCell>
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
                      },
                    }}
                  >
                    <TableCell>Vidro</TableCell>
                    <TableCell>Medida</TableCell>
                    <TableCell>Qtde</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell>
                      {isArchive ? 'Data de Conclusão' : 'Data de Criação'}
                    </TableCell>
                    <TableCell>Ações</TableCell>
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
          text={'Tem a certeza de que deseja eliminar esta encomenda?'}
        />
      </ModalOverlay>

      <ModalOverlay isOpen={editIsOpen} onClose={closeEdit}>
        <EditOrder order={order} onSubmit={handleEdit} />
      </ModalOverlay>
    </>
  );
};

export default OrderCollapse;
