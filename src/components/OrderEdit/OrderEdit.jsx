import ModalOverlay from '../ModalOverlay/ModalOverlay.jsx';
import toast from 'react-hot-toast';
import { useId } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import css from './OrderEdit.module.css';

const OrderEdit = ({ order, onClose }) => {
  const localFieldId = useId();
  const EPFieldId = useId();
  const clienteFieldId = useId();
  const categoryFieldId = useId();
  const typeFieldId = useId();
  const sizeXFieldId = useId();
  const sizeYFieldId = useId();
  const sizeZFieldId = useId();
  const quantityFieldId = useId();
  const reasonFieldId = useId();

  const dispatch = useDispatch();
  const contacts = useSelector(selectContacts);

  const handleSave = async (values, actions) => {
    if (
      values.name.trim() === contact.name.trim() &&
      values.number.trim() === contact.number.trim()
    ) {
      toast.error('Contact unchanged.');
      actions.setSubmitting(false);
      return;
    }

    const isDuplicate = contacts.some(
      cont =>
        cont.id !== contact.id &&
        cont.name.toLowerCase() === values.name.toLowerCase() &&
        cont.number === values.number
    );

    if (isDuplicate) {
      toast.error('This contact already exists!');
      actions.setSubmitting(false);
      return;
    }

    try {
      await dispatch(
        editContact({
          id: contact.id,
          updatedContact: { name: values.name, number: values.number },
        })
      ).unwrap();

      toast.success('Contact saved succesfully!');
      actions.resetForm();
      onClose();
    } catch (error) {
      toast.error('Failed to add contact.' + error);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return <ModalOverlay onClose={onClose}></ModalOverlay>;
};
export default OrderEdit;
