import { useSelector } from 'react-redux';

const InformeUso = () => {
  const usuario = useSelector((state) => state.auth.usuario);
  const cantidad = useSelector((state) => state.lecturas.lista.length);
  const LIMITE = 4;

  if (usuario.premium) {
    return (
      <div className="card p-3 mb-3">
        <h5>Uso del plan</h5>
        <p className="mb-0">Plan Premium: tenés <strong>{cantidad}</strong> lecturas guardadas</p>
      </div>
    );
  }

  const porcentaje = Math.round((cantidad / LIMITE) * 100);

  return (
    <div className="card p-3 mb-3">
      <h5>Uso del plan</h5>
      <p className="mb-2">{cantidad} de {LIMITE} lecturas ({porcentaje}%)</p>
      <div className="progress">
        <div className="progress-bar" style={{ width: `${porcentaje}%` }}></div>
      </div>
    </div>
  );
};

export default InformeUso;