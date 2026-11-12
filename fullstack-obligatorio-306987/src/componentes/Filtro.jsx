import { useSelector } from 'react-redux';

const Filtro = ({ genero, setGenero }) => {
  const categorias = useSelector((state) => state.categorias.lista);

  return (
    <div className="card p-3 mb-3">
      <label htmlFor="filtro-genero" className="form-label">Filtrar por género</label>
      <select id="filtro-genero" className="form-select"
        value={genero} onChange={(e) => setGenero(e.target.value)}>
        <option value="">Todos</option>
        {categorias.map((c) => (
          <option key={c._id} value={c.nombre}>{c.nombre}</option>
        ))}
      </select>
    </div>
  );
};

export default Filtro;