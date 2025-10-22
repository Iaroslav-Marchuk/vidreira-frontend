import { Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { lazy, Suspense, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const HomePage = lazy(() => import('../../pages/HomePage/HomePage.jsx'));
const ArchivePage = lazy(() =>
  import('../../pages/ArchivePage/ArchivePage.jsx')
);
const OrdersPage = lazy(() => import('../../pages/OrdersPage/OrdersPage.jsx'));
const ProfilePage = lazy(() =>
  import('../../pages/ProfilePage/ProfilePage.jsx')
);
const AuthPage = lazy(() => import('../../pages/AuthPage/AuthPage.jsx'));
const NotFoundPage = lazy(() =>
  import('../../pages/NotFoundPage/NotFoundPage.jsx')
);
const StatisticsPage = lazy(() =>
  import('../../pages/StatisticsPage/StatisticsPage.jsx')
);

import Layout from '../Layout/Layout.jsx';
import Loader from '../Loader/Loader.jsx';

import PrivateRoute from '../PrivateRoute.jsx';
import RestrictedRoute from '../RestrictedRoute.jsx';

import { selectIsRefreshing } from '../../redux/auth/selectors.js';
import { getUser } from '../../redux/auth/operations.js';

const App = () => {
  const dispatch = useDispatch();
  const isRefreshing = useSelector(selectIsRefreshing);

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  return isRefreshing ? (
    <Loader loadingState={isRefreshing} />
  ) : (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Suspense fallback={<Loader loadingState={true} />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route
              path="auth"
              element={
                <RestrictedRoute redirectTo="/" element={<AuthPage />} />
              }
            />
            <Route
              path="archive"
              element={<PrivateRoute element={<ArchivePage />} />}
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
      </Suspense>
    </>
  );
};

export default App;
