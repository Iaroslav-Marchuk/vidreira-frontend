import { Outlet } from 'react-router-dom';

import Header from '../Header/Header.jsx';
import Footer from '../Footer/Footer.jsx';

import css from './Layout.module.css';

const Layout = () => {
  return (
    <div className={css.container}>
      <Header className={css.header} />
      <main className={css.main}>
        <Outlet />
      </main>
      <Footer className={css.footer} />
    </div>
  );
};

export default Layout;
