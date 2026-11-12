import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { pasarAPremium } from '../store/slices/authSlice';
import { cambiarPlanApi } from '../services/api';

const CambioPlan = () => {
  const usuario = useSelector((state) => state.auth.usuario);
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const [error, setError] = useState('');

  const cambiar = async () => {
    if (!confirm('¿Querés pasarte al plan Premium?')) return;
    try {
      const data = await cambiarPlanApi(token);
      dispatch(pasarAPremium(data.token));
      localStorage.setItem('token', data.token);
      localStorage.setItem('usuario', JSON.stringify({ ...usuario, premium: true }));
    } catch (err) {
      setError(err.message);
    }
  };

  if (usuario.premium) {
    return (
      <div className="card p-3 mb-3 border-warning">
        <h5>Plan Premium ⭐</h5>
        <p className="mb-0">Tenés lecturas ilimitadas.</p>
      </div>
    );
  }

  return (
    <div className="card p-3 mb-3">
      <h5>Plan Plus</h5>
      <p>Pasate a Premium para guardar lecturas ilimitadas</p>
      {error && <div className="alert alert-danger">{error}</div>}
      <button className="btn btn-warning w-100" onClick={cambiar}>Pasar a Premium</button>
    </div>
  );
};

export default CambioPlan;