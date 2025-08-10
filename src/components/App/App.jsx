import { Route, Routes } from 'react-router-dom';

import HomePage from '../../pages/HomePage/HomePage.jsx';
import OrdersPage from '../../pages/OrdersPage/OrdersPage.jsx';
import ProfilePage from '../../pages/ProfilePage/ProfilePage.jsx';
import Layout from '../Layout/Layout.jsx';
import AuthPage from '../../pages/AuthPage/AuthPage.jsx';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="auth" element={<AuthPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
    </Routes>
  );
};

export default App;
