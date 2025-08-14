import clsx from 'clsx';

import css from './Button.module.css';

const Button = ({
  children,
  onClick,
  disabled = false,
  type = 'button',
  className = '',
  ariaLabel,
}) => {
  return (
    <button
      className={clsx(css.btn, className)}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      type={type}
    >
      {children}
    </button>
  );
};
export default Button;
