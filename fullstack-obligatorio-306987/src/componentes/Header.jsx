import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const usuario = useSelector((state) => state.auth.usuario);
  const dispatch = useDispatch();
  const navigate = useNavigate();

const cerrarSesion = () => {
  dispatch(logout());
  navigate('/login');
};


  return (
    <nav className="navbar navbar-dark bg-dark px-3">
      <span className="navbar-brand">Mis Lecturas</span>
      <div>
        <span className="text-white me-3">Hola, {usuario?.username}</span>
        <button className="btn btn-outline-light btn-sm" onClick={cerrarSesion}>
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
};

export default Header;  