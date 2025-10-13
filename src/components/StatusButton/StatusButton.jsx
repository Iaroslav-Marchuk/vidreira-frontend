import { CirclePlus, CirclePlay, CircleCheck } from 'lucide-react';
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

  const { icon: Icon, color, next } = statusMap[status];

  const handleChangeStatus = async () => {
    if (!next) return;

    // Миттєво оновлюємо стан кнопки
    setStatus(next);
    onStatusChange?.(next);

    try {
      await dispatch(
        updateItemStatus({ orderId, itemId, status: next, userId })
      ).unwrap();
      toast.success(`Status updated to "${next}"`);
    } catch (error) {
      setStatus(status);
      onStatusChange?.(status);
      toast.error('Failed to update status: ' + error);
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
    >
      <Icon size={20} color={color} strokeWidth={1} />
    </button>
  );
};

export default StatusButton;
