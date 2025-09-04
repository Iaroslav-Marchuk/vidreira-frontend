import { Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import HomePage from '../../pages/HomePage/HomePage.jsx';
import OrdersPage from '../../pages/OrdersPage/OrdersPage.jsx';
import ProfilePage from '../../pages/ProfilePage/ProfilePage.jsx';
import AuthPage from '../../pages/AuthPage/AuthPage.jsx';
import NotFoundPage from '../../pages/NotFoundPage/NotFoundPage.jsx';
import StatisticsPage from '../../pages/StatisticsPage/StatisticsPage.jsx';

import Layout from '../Layout/Layout.jsx';

import Loader from '../Loader/Loader.jsx';
import PrivateRoute from '../PrivateRoute.jsx';
import RestrictedRoute from '../RestrictedRoute.jsx';
import { selectIsRefreshing, selectUser } from '../../redux/auth/selectors.js';
import { getUser } from '../../redux/auth/operations.js';

const App = () => {
  const dispatch = useDispatch();
  const isRefreshing = useSelector(selectIsRefreshing);
  const user = useSelector(selectUser);

  useEffect(() => {
    if (!user.name) {
      dispatch(getUser());
    }
  }, [user, dispatch]);

  return isRefreshing ? (
    <Loader loadingState={isRefreshing} />
  ) : (
    <>
      <Toaster position="top-right" reverseOrder={false} />

      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route
            path="auth"
            element={<RestrictedRoute redirectTo="/" element={<AuthPage />} />}
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
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
};

export default App;
