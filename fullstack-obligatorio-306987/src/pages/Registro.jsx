import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../store/slices/authSlice';
import { registroApi, loginApi } from '../services/api';

const Registro = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [error, setError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const registrar = async () => {
    try {
      await registroApi(username, email, password);
      const data = await loginApi(username, password);
      dispatch(login(data));
      localStorage.setItem('token', data.token);
      localStorage.setItem('usuario', JSON.stringify(data.usuario));
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  const usernameValido = username.length >= 2 && username.length <= 30;
  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const passwordValida = password.length >= 6 && password.length <= 30;
  const coinciden = password === confirmarPassword;

  const formValido = usernameValido && emailValido && passwordValida && coinciden;

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card p-4 shadow" style={{ width: '22rem' }}>
        <h2 className="text-center mb-4">Crear cuenta</h2>

        <div className="mb-3">
          <label htmlFor="registro-username" className="form-label">Usuario</label>
          <input type="text" id="registro-username" className="form-control"
            value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>

        <div className="mb-3">
          <label htmlFor="registro-email" className="form-label">Email</label>
          <input type="email" id="registro-email" className="form-control"
            value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div className="mb-3">
          <label htmlFor="registro-password" className="form-label">Contraseña</label>
          <input type="password" id="registro-password" className="form-control"
            value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>

        <div className="mb-3">
          <label htmlFor="registro-confirmar" className="form-label">Confirmar contraseña</label>
          <input type="password" id="registro-confirmar" className="form-control"
            value={confirmarPassword} onChange={(e) => setConfirmarPassword(e.target.value)} />
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <button className="btn btn-primary w-100" disabled={!formValido} onClick={registrar}>
          Registrarme
        </button>

        <p className="text-center mt-3">
          ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
        </p>
      </div>
    </div>
  );
};

export default Registro;
