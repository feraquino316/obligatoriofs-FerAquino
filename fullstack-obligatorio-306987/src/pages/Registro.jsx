import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../store/slices/authSlice';
import { registroApi, loginApi } from '../services/api';

const schema = yup.object({
  username: yup.string()
    .required('Ingresá un usuario')
    .min(2, 'Mínimo 2 caracteres')
    .max(30, 'Máximo 30 caracteres'),
  email: yup.string()
    .required('Ingresá un email')
    .email('Email inválido'),
  password: yup.string()
    .required('Ingresá una contraseña')
    .min(6, 'Mínimo 6 caracteres')
    .max(30, 'Máximo 30 caracteres'),
  confirmar: yup.string()
    .required('Repetí la contraseña')
    .oneOf([yup.ref('password')], 'Las contraseñas no coinciden'),
});

const Registro = () => {
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isValid } } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const registrar = async ({ username, email, password }) => {
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

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card p-4 shadow" style={{ width: '22rem' }}>
        <h2 className="text-center mb-4">Crear cuenta</h2>

        <form onSubmit={handleSubmit(registrar)}>
          <div className="mb-3">
            <label htmlFor="registro-username" className="form-label">Usuario</label>
            <input type="text" id="registro-username"
              className={`form-control ${errors.username ? 'is-invalid' : ''}`}
              {...register('username')} />
            {errors.username && <div className="invalid-feedback">{errors.username.message}</div>}
          </div>

          <div className="mb-3">
            <label htmlFor="registro-email" className="form-label">Email</label>
            <input type="email" id="registro-email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              {...register('email')} />
            {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
          </div>

          <div className="mb-3">
            <label htmlFor="registro-password" className="form-label">Contraseña</label>
            <input type="password" id="registro-password"
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
              {...register('password')} />
            {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
          </div>

          <div className="mb-3">
            <label htmlFor="registro-confirmar" className="form-label">Confirmar contraseña</label>
            <input type="password" id="registro-confirmar"
              className={`form-control ${errors.confirmar ? 'is-invalid' : ''}`}
              {...register('confirmar')} />
            {errors.confirmar && <div className="invalid-feedback">{errors.confirmar.message}</div>}
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <button type="submit" className="btn btn-primary w-100" disabled={!isValid}>
            Registrarme
          </button>
        </form>

        <p className="text-center mt-3">
          ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
        </p>
      </div>
    </div>
  );
};

export default Registro;