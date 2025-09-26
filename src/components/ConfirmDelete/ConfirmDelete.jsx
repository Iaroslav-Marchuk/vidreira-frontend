import ModalOverlay from '../ModalOverlay/ModalOverlay.jsx';

import css from './ConfirmDelete.module.css';

const ConfirmDelete = ({ isOpen, onDelete, onClose }) => {
  return (
    <ModalOverlay isOpen={isOpen} onClose={onClose}>
      <div className={css.wrapper}>
        <p className={css.text}>Do you really want to delete this contact?</p>
        <div className={css.btns}>
          <button className={css.btnY} onClick={onDelete}>
            Yes
          </button>
          <button className={css.btnN} onClick={onClose}>
            No
          </button>
        </div>
      </div>
    </ModalOverlay>
  );
};

export default ConfirmDelete;
