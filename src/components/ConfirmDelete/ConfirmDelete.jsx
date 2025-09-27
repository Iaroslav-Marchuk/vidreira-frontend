import Button from '../Button/Button.jsx';

import css from './ConfirmDelete.module.css';

const ConfirmDelete = ({ onDelete, onClose }) => {
  return (
    <div className={css.wrapper}>
      <p className={css.text}>
        Tem a certeza de que deseja eliminar esta encomenda?
      </p>
      <div className={css.btns}>
        <Button className={css.btnY} onClick={onDelete}>
          Sim
        </Button>
        <Button className={css.btnN} onClick={onClose}>
          Não
        </Button>
      </div>
    </div>
  );
};

export default ConfirmDelete;
