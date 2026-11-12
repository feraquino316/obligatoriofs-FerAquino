import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';

const Header = () => {
  const usuario = useSelector((state) => state.auth.usuario);
  const dispatch = useDispatch();

  return (
    <nav className="navbar navbar-dark bg-dark px-3">
      <span className="navbar-brand">Mis Lecturas</span>
      <div>
        <span className="text-white me-3">Hola, {usuario?.username}</span>
        <button className="btn btn-outline-light btn-sm" onClick={() => dispatch(logout())}>
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
};

export default Header;  