import clsx from 'clsx';

import css from './Footer.module.css';

const Footer = ({ className }) => {
  return (
    <div className={clsx(css.footer, className)}>
      <p className={css.text}>© Copyright 2025 Vidreira Algarvia</p>
    </div>
  );
};

export default Footer;
