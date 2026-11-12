import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../store/slices/authSlice';
import { loginApi } from '../services/api';

const schema = yup.object({
  username: yup.string().required('Ingresá tu usuario'),
  password: yup.string().required('Ingresá tu contraseña'),
});

const Login = () => {
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { isValid } } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const ingresar = async ({ username, password }) => {
    try {
      const data = await loginApi(username, password);
      dispatch(login(data));
      localStorage.setItem('token', data.token);
      localStorage.setItem('usuario', JSON.stringify(data.usuario));
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(ingresar)}>
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card p-4 shadow" style={{ width: '22rem' }}>
        <h2 className="text-center mb-4">Iniciar sesión</h2>

        <div className="mb-3">
          <label htmlFor="username" className="form-label">Usuario</label>
          <input type="text" id="username" className="form-control" {...register('username')} />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">Contraseña</label>
          <input type="password" id="password" className="form-control" {...register('password')} />
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <button type="submit" className="btn btn-primary w-100" disabled={!isValid}>Ingresar</button>

        <p className="text-center mt-3">
          ¿No tenés cuenta? <Link to="/registro">Registrate</Link>
        </p>
      </div>
    </div>
    </form>
  );
};

export default Login;