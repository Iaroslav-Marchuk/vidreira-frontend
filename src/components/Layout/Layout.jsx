import { Outlet } from 'react-router-dom';

import Header from '../Header/Header.jsx';
import Footer from '../Footer/Footer.jsx';

import css from './Layout.module.css';

const Layout = () => {
  return (
    <div className={css.container}>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
