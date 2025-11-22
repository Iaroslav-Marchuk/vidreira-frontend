import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

import StatsList from '../../components/StatsList/StatsList.jsx';
import Loader from '../../components/Loader/Loader.jsx';

import { selectIsLoggedIn, selectUser } from '../../redux/auth/selectors.js';
import { getStats } from '../../redux/stats/operations.js';
import {
  selectAllStats,
  selectIsStatsLoading,
} from '../../redux/stats/selectors.js';

import css from './HomePage.module.css';

const HomePage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const isLoggedIn = useSelector(selectIsLoggedIn);
  const user = useSelector(selectUser);

  const allStats = useSelector(selectAllStats);
  const isStatsLoading = useSelector(selectIsStatsLoading);

  const createdOrdersTodayList = allStats.createdOrdersToday ?? [];
  const createdItemsTodayList = createdOrdersTodayList.map(order =>
    order.items.reduce((sum, item) => sum + item.quantity, 0)
  );

  const completedOrdersTodayList = allStats.completedOrdersToday ?? [];
  const completedItemsTodayList = completedOrdersTodayList.map(order =>
    order.items.reduce((sum, item) => sum + item.quantity, 0)
  );

  const delayedList = allStats.delayed ?? [];
  const delayedItemsList = delayedList.map(order =>
    order.items.reduce((sum, item) => sum + item.quantity, 0)
  );

  const pendingList = allStats.partiallyCompletedOrdersToday ?? [];

  useEffect(() => {
    dispatch(getStats());
  }, [dispatch]);

  return (
    <>
      {!isLoggedIn && (
        <div className={css.container}>
          <h1 className={css.title}>{t('WELCOME_TITLE')}</h1>
          <p className={css.text}>{t('WELCOME_TEXT_1')}</p>
          <p className={css.text}>{t('WELCOME_LIST')}</p>
          <ul className={css.list}>
            <li className={css.item}>{t('CREATE')}</li>
            <li className={css.item}>{t('TRACK')}</li>
            <li className={css.item}>{t('STATS')}</li>
            <li className={css.item}>{t('SECURE')}</li>
          </ul>

          <p className={css.text}>
            {t('WELCOME_TEXT_2')}
            <Link to="/auth" className={css.linkBtn}>
              {t('WELCOME_LOGIN')}
            </Link>
            .
          </p>
          <p className={css.text}>{t('WELCOME_TEXT_3')}</p>
        </div>
      )}

      {isStatsLoading && <Loader loadingState={isStatsLoading} />}

      {isLoggedIn && (
        <div className={css.dashboard}>
          <h1 className={css.welcome}>{`${t('DASHBOARD_WELCOME')} ${
            user.name
          }!`}</h1>
          <div className={css.stats}>
            <div className={css.statCard}>
              <h3 className={css.listTitle}>{t('DASHBOARD_ADDED_TITLE')}</h3>
              {createdOrdersTodayList.length > 0 ? (
                <StatsList
                  orderList={createdOrdersTodayList}
                  itemList={createdItemsTodayList}
                  type="created"
                />
              ) : (
                <p className={css.noResults}>{t('DASHBOARD_EMPTY')}</p>
              )}
            </div>
            <div className={css.statCard}>
              <h3 className={css.listTitle}>{t('DASHBOARD_FINISHED_TITLE')}</h3>
              {completedOrdersTodayList.length > 0 ? (
                <>
                  <StatsList
                    orderList={completedOrdersTodayList}
                    itemList={completedItemsTodayList}
                    type="completed"
                  />
                  <StatsList orderList={pendingList} type="pending" />
                </>
              ) : (
                <p className={css.noResults}>{t('DASHBOARD_EMPTY')}</p>
              )}
            </div>
            <div className={css.statCard}>
              <h3 className={css.listTitle}>{t('DASHBOARD_DELAYED_TITLE')}</h3>

              {delayedList.length > 0 ? (
                <StatsList
                  orderList={delayedList}
                  itemList={delayedItemsList}
                  type="delayed"
                />
              ) : (
                <p className={css.noResults}>{t('DASHBOARD_EMPTY')}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HomePage;
