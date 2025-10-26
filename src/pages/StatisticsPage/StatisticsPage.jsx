import { useDispatch, useSelector } from 'react-redux';
import css from './StatisticsPage.module.css';
import {
  selectAllStats,
  selectIsStatsLoading,
} from '../../redux/stats/selectors.js';
import { useEffect } from 'react';
import { getStats } from '../../redux/stats/operations.js';
import Loader from '../../components/Loader/Loader.jsx';

const StatisticsPage = () => {
  const dispatch = useDispatch();

  const allStats = useSelector(selectAllStats);

  const {
    activeOrdersByZone,
    activeItemsByZone,
    averageItemExecutionTime,
    completedItemsLastMonth,
    completedItemsThisMonth,
    completedItemsToday,
    completedItemsYesterday,
    completedOrdersLastMonth,
    completedOrdersThisMonth,
    completedOrdersToday,
    completedOrdersYesterday,
    createdItemsLastMonth,
    createdItemsThisMonth,
    createdItemsToday,
    createdItemsYesterday,
    createdOrdersLastMonth,
    createdOrdersThisMonth,
    createdOrdersToday,
    createdOrdersYesterday,
    noCompletedItemsTotal,
    noCompletedOrdersTotal,
  } = allStats;

  const isStatsLoading = useSelector(selectIsStatsLoading);

  useEffect(() => {
    dispatch(getStats());
  }, [dispatch]);

  const zoneLabels = {
    L1: 'Linha 1',
    L2: 'Linha 2',
    L3: 'Linha 3',
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

  return (
    <>
      {isStatsLoading && <Loader />}

      <div className={css.wrapper}>
        <h1 className={css.title}>
          A estatística do registo de produtos não conformes
        </h1>

        <div className={css.section}>
          <h2 className={css.sectionTitle}>Informação geral</h2>
          <p className={css.text}>
            {`Neste momento, na fábrica Vidreira Algarvia, encontram-se
            ${noCompletedOrdersTotal}
            encomendas por finalizar, correspondendo a um total de
            ${noCompletedItemsTotal} vidros ainda em produção.`}
          </p>
          <p className={css.text}>
            {`O maior número de encomendas por concluir encontra-se na ${maxZoneLabel} (${maxOrdersCount} encomendas).`}
          </p>
        </div>

        <div className={css.section}>
          <h2 className={css.sectionTitle}>Estatístca pela zona:</h2>
          <ul className={css.list}>
            {activeOrdersByZone &&
              Object.entries(activeOrdersByZone)
                .sort(([zoneA], [zoneB]) => zoneA.localeCompare(zoneB))
                .map(([zone, ordersCount]) => {
                  const itemsCount = activeItemsByZone[zone];
                  const label = zoneLabels[zone];

                  return (
                    <li key={zone} className={css.item}>
                      {`- ${label}: ${ordersCount} encomendas em curso, ${itemsCount} vidros no total`}
                    </li>
                  );
                })}
          </ul>
        </div>

        <div className={css.section}>
          <h2 className={css.sectionTitle}>
            Estatísticas por período de tempo:
          </h2>
          <ul className={css.list}>
            <li className={css.item}>
              <h3 className={css.subtitle}>Hoje</h3>
              <p className={css.text}>
                {`Foram adicionadas ${createdOrdersToday.length} ${
                  createdOrdersToday.length === 1 ? 'encomenda' : 'encomendas'
                } (${createdItemsToday} vidros) e concluídas ${
                  completedOrdersToday.length
                } ${
                  completedOrdersToday.length === 1 ? 'encomenda' : 'encomendas'
                } (${completedItemsToday} vidros).`}
              </p>
            </li>
            <li className={css.item}>
              <h3 className={css.subtitle}>Ontem</h3>
              <p className={css.text}>
                {`Foram adicionadas ${createdOrdersYesterday.length} ${
                  createdOrdersYesterday.length === 1
                    ? 'encomenda'
                    : 'encomendas'
                } (${createdItemsYesterday} vidros) e concluídas ${
                  completedOrdersYesterday.length
                } ${
                  completedOrdersYesterday.length === 1
                    ? 'encomenda'
                    : 'encomendas'
                } (${completedItemsYesterday} vidros).`}
              </p>
            </li>
            <li className={css.item}>
              <h3 className={css.subtitle}>Este mês</h3>
              <p className={css.text}>
                {`Foram adicionadas ${createdOrdersThisMonth.length} ${
                  createdOrdersThisMonth.length === 1
                    ? 'encomenda'
                    : 'encomendas'
                } (${createdItemsThisMonth} vidros) e concluídas ${
                  completedOrdersThisMonth.length
                } ${
                  completedOrdersThisMonth.length === 1
                    ? 'encomenda'
                    : 'encomendas'
                } (${completedItemsThisMonth} vidros).`}
              </p>
            </li>
            <li className={css.item}>
              <h3 className={css.subtitle}>Mês passado</h3>
              <p className={css.text}>
                {`Foram adicionadas ${createdOrdersLastMonth.length} ${
                  createdOrdersLastMonth.length === 1
                    ? 'encomenda'
                    : 'encomendas'
                } (${createdItemsLastMonth} vidros) e concluídas ${
                  completedOrdersLastMonth.length
                } ${
                  completedOrdersLastMonth.length === 1
                    ? 'encomenda'
                    : 'encomendas'
                } (${completedItemsLastMonth} vidros).`}
              </p>
            </li>
            <li className={css.item}>
              <h3 className={css.subtitle}>Tempo médio de execução</h3>
              <p className={css.text}>
                {`Em média, cada vidro demora ${averageItemExecutionTime.hours} horas (${averageItemExecutionTime.days} dias) para ser concluído.`}
              </p>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default StatisticsPage;
