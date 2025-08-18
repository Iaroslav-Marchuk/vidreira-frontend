import Modal from 'react-modal';

import { CgClose } from 'react-icons/cg';

import css from './ModalOverlay.module.css';

const ModalOverlay = ({ children, isOpen, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className={css.modal}
      overlayClassName={css.overlay}
    >
      <button type="button" onClick={onClose} className={css.btn}>
        <CgClose />
      </button>
      {children}
    </Modal>
  );
};

export default ModalOverlay;
