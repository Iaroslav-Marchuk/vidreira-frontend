import { useTranslation } from 'react-i18next';

import Button from '../Button/Button.jsx';

import css from './ConfirmDelete.module.css';

const ConfirmDelete = ({ text, onDelete, onClose }) => {
  const { t } = useTranslation();

  return (
    <div className={css.wrapper}>
      <p className={css.text}>{text}</p>
      <div className={css.btns}>
        <Button className={css.btnY} onClick={onDelete}>
          {t('YES')}
        </Button>
        <Button className={css.btnN} onClick={onClose}>
          {t('NO')}
        </Button>
      </div>
    </div>
  );
};

export default ConfirmDelete;
