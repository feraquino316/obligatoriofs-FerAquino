import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../store/slices/authSlice';
import { loginApi } from '../services/api';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const ingresar = async () => {
    try {
      const data = await loginApi(username, password);
      dispatch(login(data));
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };
  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card p-4 shadow" style={{ width: '22rem' }}>
        <h2 className="text-center mb-4">Iniciar sesión</h2>

        <div className="mb-3">
          <label htmlFor="username" className="form-label">Usuario</label>
          <input type="text" id="username" className="form-control"
            value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">Contraseña</label>
          <input type="password" id="password" className="form-control"
            value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        
        {error && <div className="alert alert-danger">{error}</div>}

        <button className="btn btn-primary w-100"
          disabled={!username || !password} onClick={ingresar}>
          Ingresar
        </button>

        <p className="text-center mt-3">
          ¿No tenés cuenta? <Link to="/registro">Registrate</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;