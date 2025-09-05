import { CiEdit } from 'react-icons/ci';
import { BsClockHistory } from 'react-icons/bs';
import { MdDeleteForever } from 'react-icons/md';

import css from './Order.module.css';

const Order = () => {
  return (
    <tr className={css.row}>
      <td>100</td>
      <td>12345</td>
      <td>Rodruigues e Almeida</td>
      <td>
        <div className={css.vidroTop}>SKN 183 II</div>
        <div className={css.vidroBottom}>8 mm</div>
      </td>
      <td>9999x9999</td>
      <td>10</td>
      <td>Partido no robô </td>
      <td>Pedido concluido</td>
      <td>L1</td>
      <td>Iaroslav</td>
      <td>22.12.25</td>
      <td>
        <button>
          <MdDeleteForever />
        </button>
        <button>
          <CiEdit />
        </button>
        <button>
          <BsClockHistory />
        </button>
      </td>
    </tr>
  );
};

export default Order;
