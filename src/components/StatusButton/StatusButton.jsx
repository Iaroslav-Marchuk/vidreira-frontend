import { CirclePlus, CirclePlay, CircleCheck, Loader } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import css from './StatusButton.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { updateItemStatus } from '../../redux/orders/operations.js';
import { roleCanDo } from '../../utils/roleCanDo.js';
import { selectRole } from '../../redux/auth/selectors.js';
import { selectRolesList } from '../../redux/roles/selectors.js';

const statusMap = {
  Criado: { icon: CirclePlus, color: '#69cd71ff', next: 'Em produção' },
  'Em produção': { icon: CirclePlay, color: '#e89126ff', next: 'Concluído' },
  Concluído: { icon: CircleCheck, color: '#3319c7ff', next: null },
};

const StatusButton = ({
  orderId,
  itemId,
  currentStatus,
  userId,
  onStatusChange,
}) => {
  const dispatch = useDispatch();
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setStatus(currentStatus);
  }, [currentStatus]);

  const { icon: Icon, color, next } = statusMap[status];

  const role = useSelector(selectRole);
  const rolesList = useSelector(selectRolesList);
  const canChange = next
    ? roleCanDo(rolesList, role, `changeStatus:${next}`)
    : false;

  const handleChangeStatus = async () => {
    if (!next || loading) return;

    setLoading(true);

    try {
      const updatedOrder = await dispatch(
        updateItemStatus({ orderId, itemId, status: next, userId })
      ).unwrap();

      const updatedItem = updatedOrder.items.find(i => i._id === itemId);
      setStatus(updatedItem.status);

      onStatusChange?.(updatedItem.status);

      if (updatedItem.status === 'Concluído') {
        toast.success('Pedido movido para o arquivo!');
        toast.success(`Status atualizado para "${updatedItem.status}"`);
      } else {
        toast.success(`Status atualizado para "${updatedItem.status}"`);
      }
    } catch (error) {
      setStatus(status);
      onStatusChange?.(status);
      toast.error('Falha ao atualizar o status: ' + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className={css.btn}
      onClick={e => {
        e.stopPropagation();
        handleChangeStatus();
      }}
      title={next ? `Alterar estado para "${next}"` : 'Estado final'}
      disabled={loading || !next || !canChange}
    >
      {loading ? (
        <Loader size={20} className={css.loader} />
      ) : (
        <Icon size={20} color={!canChange ? '#999' : color} strokeWidth={2} />
      )}
    </button>
  );
};

export default StatusButton;
