import { CirclePlus, CirclePlay, CircleCheck, Loader } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import css from './StatusButton.module.css';
import { useDispatch } from 'react-redux';
import { updateItemStatus } from '../../redux/orders/operations.js';

const statusMap = {
  Criado: { icon: CirclePlus, color: '#cdc769ff', next: 'Em produção' },
  'Em produção': { icon: CirclePlay, color: '#288328ff', next: 'Concluído' },
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

  const { icon: Icon, color, next } = statusMap[status];

  const handleChangeStatus = async () => {
    if (!next || loading) return;

    setLoading(true);

    try {
      await dispatch(
        updateItemStatus({ orderId, itemId, status: next, userId })
      ).unwrap();
      setStatus(next);
      onStatusChange?.(next);
      toast.success(`Status updated to "${next}"`);
    } catch (error) {
      setStatus(status);
      onStatusChange?.(status);
      toast.error('Failed to update status: ' + error);
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
      title={next ? `Change status to "${next}"` : 'Status final'}
      disabled={loading || !next}
    >
      {loading ? (
        <Loader size={20} className={css.loader} />
      ) : (
        <Icon size={20} color={color} strokeWidth={1} />
      )}
    </button>
  );
};

export default StatusButton;
