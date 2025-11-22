import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

import Loader from '../../components/Loader/Loader.jsx';

import {
  selectAllStats,
  selectIsStatsLoading,
} from '../../redux/stats/selectors.js';
import { getStats } from '../../redux/stats/operations.js';

import css from './StatisticsPage.module.css';

const StatisticsPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const allStats = useSelector(selectAllStats);

  const {
    createdOrdersToday = [],
    createdOrdersYesterday = [],
    createdOrdersThisMonth = [],
    createdOrdersLastMonth = [],
    completedOrdersToday = [],
    completedOrdersYesterday = [],
    completedOrdersThisMonth = [],
    completedOrdersLastMonth = [],

    createdItemsToday = 0,
    createdItemsYesterday = 0,
    createdItemsThisMonth = 0,
    createdItemsLastMonth = 0,
    completedItemsToday = 0,
    completedItemsYesterday = 0,
    completedItemsThisMonth = 0,
    completedItemsLastMonth = 0,

    activeOrdersByZone = {},
    activeItemsByZone = {},

    averageItemExecutionTime = { hours: 0, days: 0 },

    noCompletedItemsTotal = 0,
    noCompletedOrdersTotal = 0,
  } = allStats || {};

  const isStatsLoading = useSelector(selectIsStatsLoading);

  useEffect(() => {
    dispatch(getStats());
  }, [dispatch]);

  const zoneLabels = {
    LINE_1: t('LOCAL_LINE_1'),
    LINE_2: t('LOCAL_LINE_2'),
    LINE_3: t('LOCAL_LINE_3'),
    FURNACE: t('LOCAL_FURNACE'),
    LOGISTIC: t('LOCAL_LOGISTIC'),
    QUALITY: t('LOCAL_QUALITY'),
  };

  let maxZoneLabel = '';
  let maxOrdersCount = 0;

  if (activeOrdersByZone) {
    const maxEntry = Object.entries(activeOrdersByZone).reduce(
      (acc, [zone, count]) => {
        if (count > acc.count) {
          return { zone, count };
        }
        return acc;
      },
      { zone: '', count: 0 }
    );

    maxZoneLabel = zoneLabels[maxEntry.zone] || maxEntry.zone;
    maxOrdersCount = maxEntry.count;
  }
  if (!allStats || Object.keys(allStats).length === 0) {
    return (
      <div className={css.wrapper}>
        {isStatsLoading && <Loader />}
        <p className={css.noResults}>{t('STATS_NO_DATA')}</p>
      </div>
    );
  }

  return (
    <>
      {isStatsLoading && <Loader />}

      <div className={css.wrapper}>
        <h1 className={css.title}>{t('STATS_TITLE')}</h1>

        <div className={css.section}>
          <h2 className={css.sectionTitle}>{t('STATS_GENERAL')}</h2>
          <p className={css.text}>
            {`${t('STATS_TEXT_1')}
            ${noCompletedOrdersTotal}
            ${t('STATS_TEXT_2')}
            ${noCompletedItemsTotal} ${t('STATS_TEXT_3')}.`}
          </p>
          <p className={css.text}>
            {`${t('STATS_TEXT_4')} ${maxZoneLabel} (${maxOrdersCount} ${t(
              'STATS_TEXT_5'
            )}).`}
          </p>
        </div>

        <div className={css.section}>
          <h2 className={css.sectionTitle}>{t('STATS_ZONE')}</h2>
          <ul className={css.list}>
            {activeOrdersByZone &&
              Object.entries(activeOrdersByZone)
                .sort(([zoneA], [zoneB]) => zoneA.localeCompare(zoneB))
                .map(([zone, ordersCount]) => {
                  const itemsCount = activeItemsByZone[zone];
                  const label = zoneLabels[zone];

                  return (
                    <li key={zone} className={css.item}>
                      - <b>{label}</b>: {ordersCount} {t('STATS_TEXT_6')},{' '}
                      {itemsCount} {t('STATS_TEXT_7')}
                    </li>
                  );
                })}
          </ul>
        </div>

        <div className={css.section}>
          <h2 className={css.sectionTitle}>{t('STATS_TIME')}</h2>
          <ul className={css.list}>
            <li className={css.item}>
              <h3 className={css.subtitle}>{t('STATS_TEXT_8')}</h3>
              <p className={css.text}>
                {`${t('STATS_TEXT_9')} ${createdOrdersToday.length} ${
                  createdOrdersToday.length === 1
                    ? t('STATS_TEXT10')
                    : t('STATS_TEXT_11')
                } (${createdItemsToday} ${t('STATS_TEXT_12')} ${
                  completedOrdersToday.length
                } ${
                  completedOrdersToday.length === 1
                    ? t('STATS_TEXT10')
                    : t('STATS_TEXT_11')
                } (${completedItemsToday} ${t('STATS_TEXT_13')}).`}
              </p>
            </li>
            <li className={css.item}>
              <h3 className={css.subtitle}>{t('STATS_TEXT_14')}</h3>
              <p className={css.text}>
                {`${t('STATS_TEXT_9')} ${createdOrdersYesterday.length} ${
                  createdOrdersYesterday.length === 1
                    ? t('STATS_TEXT10')
                    : t('STATS_TEXT_11')
                } (${createdItemsYesterday} ${t('STATS_TEXT_12')} ${
                  completedOrdersYesterday.length
                } ${
                  completedOrdersYesterday.length === 1
                    ? t('STATS_TEXT10')
                    : t('STATS_TEXT_11')
                } (${completedItemsYesterday} ${t('STATS_TEXT_13')}).`}
              </p>
            </li>
            <li className={css.item}>
              <h3 className={css.subtitle}>{t('STATS_TEXT_15')}</h3>
              <p className={css.text}>
                {`${t('STATS_TEXT_9')} ${createdOrdersThisMonth.length} ${
                  createdOrdersThisMonth.length === 1
                    ? t('STATS_TEXT10')
                    : t('STATS_TEXT_11')
                } (${createdItemsThisMonth} ${t('STATS_TEXT_12')} ${
                  completedOrdersThisMonth.length
                } ${
                  completedOrdersThisMonth.length === 1
                    ? t('STATS_TEXT10')
                    : t('STATS_TEXT_11')
                } (${completedItemsThisMonth} ${t('STATS_TEXT_13')}).`}
              </p>
            </li>
            <li className={css.item}>
              <h3 className={css.subtitle}>{t('STATS_TEXT_16')}</h3>
              <p className={css.text}>
                {`${t('STATS_TEXT_9')} ${createdOrdersLastMonth.length} ${
                  createdOrdersLastMonth.length === 1
                    ? t('STATS_TEXT10')
                    : t('STATS_TEXT_11')
                } (${createdItemsLastMonth} ${t('STATS_TEXT_12')} ${
                  completedOrdersLastMonth.length
                } ${
                  completedOrdersLastMonth.length === 1
                    ? t('STATS_TEXT10')
                    : t('STATS_TEXT_11')
                } (${completedItemsLastMonth} ${t('STATS_TEXT_13')}).`}
              </p>
            </li>
            <li className={css.item}>
              <h3 className={css.subtitle}>{t('STATS_PROCESS_TIME')}</h3>
              <p className={css.text}>
                {`${t('STATS_TEXT_17')} ${averageItemExecutionTime.hours} ${t(
                  'STATS_TEXT_18'
                )} (${averageItemExecutionTime.days} ${t('STATS_TEXT_19')}`}
              </p>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default StatisticsPage;
