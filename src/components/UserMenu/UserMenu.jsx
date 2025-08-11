import { NavLink } from 'react-router-dom';

const UserMenu = () => {
  return (
    <nav>
      <NavLink to="/orders">Pedidos</NavLink>
      <NavLink to="/statistics">Estatísticas</NavLink>
    </nav>
  );
};

export default UserMenu;
