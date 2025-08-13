import { Route, Routes } from 'react-router-dom';

import HomePage from '../../pages/HomePage/HomePage.jsx';
import OrdersPage from '../../pages/OrdersPage/OrdersPage.jsx';
import ProfilePage from '../../pages/ProfilePage/ProfilePage.jsx';
import AuthPage from '../../pages/AuthPage/AuthPage.jsx';
import NotFoundPage from '../../pages/NotFoundPage/NotFoundPage.jsx';
import StatisticsPage from '../../pages/StatisticsPage/StatisticsPage.jsx';

import Layout from '../Layout/Layout.jsx';

import PrivateRoute from '../PrivateRoute.jsx';
import RestrictedRoute from '../RestrictedRoute.jsx';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route
          path="auth"
          element={
            <RestrictedRoute redirectTo="/orders" element={<AuthPage />} />
          }
        />
        <Route
          path="orders"
          element={<PrivateRoute element={<OrdersPage />} />}
        />
        <Route
          path="profile"
          element={<PrivateRoute element={<ProfilePage />} />}
        />
        <Route
          path="statistics"
          element={<PrivateRoute element={<StatisticsPage />} />}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export default App;
