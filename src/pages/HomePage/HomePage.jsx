import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { selectIsLoggedIn, selectUser } from '../../redux/auth/selectors.js';

import css from './HomePage.module.css';
import { useEffect } from 'react';
import { getStats } from '../../redux/stats/operations.js';
import {
  selectAllStats,
  selectIsStatsLoading,
} from '../../redux/stats/selectors.js';
import StatsList from '../../components/StatsList/StatsList.jsx';
import Loader from '../../components/Loader/Loader.jsx';

const HomePage = () => {
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

  const overduesList = allStats.overdues ?? [];
  const overduesItemsList = overduesList.map(order =>
    order.items.reduce((sum, item) => sum + item.quantity, 0)
  );

  useEffect(() => {
    dispatch(getStats());
  }, [dispatch]);

  return !isLoggedIn ? (
    <div className={css.container}>
      <h1 className={css.title}>Bem-vindo à nossa aplicação!</h1>
      <p className={css.text}>
        Esta é a sua ferramenta ideal para gerir pedidos de produção de forma
        rápida, simples e organizada.
      </p>
      <p className={css.text}>Com a nossa aplicação, você pode:</p>
      <ul className={css.list}>
        <li className={css.item}>🧾 Criar e gerir pedidos de produção</li>
        <li className={css.item}>
          👥 Acompanhar o responsável e o estado de cada pedido
        </li>
        <li className={css.item}>
          📊 Ver estatísticas em tempo real por linha de produção
        </li>
        <li className={css.item}>
          🔐 Manter os seus dados seguros e acessíveis apenas a utilizadores
          autorizados
        </li>
      </ul>

      <p className={css.text}>
        Para começar, por favor
        <Link to="/auth" className={css.linkBtn}>
          Inicie sessão
        </Link>
        .
      </p>
      <p className={css.text}>
        Após autenticação, terá acesso total a todas as funcionalidades da
        aplicação.
      </p>
    </div>
  ) : (
    <div className={css.dashboard}>
      <h1 className={css.welcome}>Olá, {user.name}!</h1>
      <div className={css.stats}>
        <div className={css.statCard}>
          <h3 className={css.listTitle}>📦 Adicionados hoje:</h3>
          {isStatsLoading ? (
            <Loader />
          ) : createdOrdersTodayList.length > 0 ? (
            <StatsList
              orderList={createdOrdersTodayList}
              itemList={createdItemsTodayList}
            />
          ) : (
            <p>A lista está vazia</p>
          )}
        </div>
        <div className={css.statCard}>
          <h3 className={css.listTitle}>✅ Concluídos hoje:</h3>
          {isStatsLoading ? (
            <Loader />
          ) : completedOrdersTodayList.length > 0 ? (
            <StatsList
              orderList={completedOrdersTodayList}
              itemList={completedItemsTodayList}
            />
          ) : (
            <p>A lista está vazia</p>
          )}
        </div>
        <div className={css.statCard}>
          <h3 className={css.listTitle}>⏳ Atrasados:</h3>
          {isStatsLoading ? (
            <Loader />
          ) : overduesList.length > 0 ? (
            <StatsList
              orderList={overduesList}
              itemList={overduesItemsList}
              isOverdues={true}
            />
          ) : (
            <p>A lista está vazia</p>
          )}
        </div>
      </div>
      {/* <div className={css.actions}>
        <Link to="/orders" className={css.btn}>
          ➕ Novo Pedido
        </Link>
        <Link to="/orders" className={css.btn}>
          📋 Ver Pedidos
        </Link>
        <Link to="/statistics" className={css.btn}>
          📊 Estatísticas
        </Link>
      </div> */}
    </div>
  );
};

export default HomePage;
