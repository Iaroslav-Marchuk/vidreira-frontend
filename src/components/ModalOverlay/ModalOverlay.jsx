import Modal from 'react-modal';
import { CircleX } from 'lucide-react';

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
        <CircleX size={26} strokeWidth={1} />
      </button>
      {children}
    </Modal>
  );
};

export default ModalOverlay;
