import { CirclePlus, CirclePlay, CircleCheck, Loader } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { updateItemStatus } from '../../redux/orders/operations.js';
import { selectRole } from '../../redux/auth/selectors.js';
import { selectRolesList } from '../../redux/roles/selectors.js';

import { roleCanDo } from '../../utils/roleCanDo.js';

import css from './StatusButton.module.css';

const statusMap = {
  CREATED: { icon: CirclePlus, color: '#69cd71ff', next: 'IN_PROGRESS' },
  IN_PROGRESS: { icon: CirclePlay, color: '#e89126ff', next: 'FINISHED' },
  FINISHED: { icon: CircleCheck, color: '#3319c7ff', next: null },
};

const StatusButton = ({
  orderId,
  itemId,
  currentStatus,
  userId,
  onStatusChange,
}) => {
  const { t } = useTranslation();
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

      if (updatedItem.status === 'FINISHED') {
        const allCompleted = updatedOrder.items.every(
          item => item.status === 'FINISHED'
        );

        if (allCompleted) {
          toast.success(t('STATUS_TO_ARCHIVE'));
        }
        toast.success(
          `${t('STATUS_CHANGED')} "${t(`STATUS_${updatedItem.status}`)}"`
        );
      } else {
        toast.success(
          `${t('STATUS_CHANGED')} "${t(`STATUS_${updatedItem.status}`)}"`
        );
      }
    } catch (error) {
      setStatus(status);
      onStatusChange?.(status);
      toast.error(t('STATUS_FAILED') + error);
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
      title={
        next
          ? `${t('STATUS_TEXT_1')} "${t(`STATUS_${next}`)}"`
          : t('STATUS_TEXT_2')
      }
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
