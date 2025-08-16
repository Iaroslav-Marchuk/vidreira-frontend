import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { selectIsLoggedIn, selectUser } from '../../redux/auth/selectors.js';

import css from './HomePage.module.css';

const HomePage = () => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const user = useSelector(selectUser);

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
          {' '}
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
          📦 Em produção: <strong>INPROGRESS</strong>
        </div>
        <div className={css.statCard}>
          ✅ Concluídos hoje: <strong>COMPLETED</strong>
        </div>
        <div className={css.statCard}>
          ⏳ Atrasados: <strong>ATRASADOS</strong>
        </div>
      </div>
      <div className={css.actions}>
        <Link to="/orders" className={css.btn}>
          ➕ Novo Pedido
        </Link>
        <Link to="/orders" className={css.btn}>
          📋 Ver Pedidos
        </Link>
        <Link to="/statistics" className={css.btn}>
          📊 Estatísticas
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
