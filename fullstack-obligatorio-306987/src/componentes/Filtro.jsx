const Filtro = () => {
  return (
    <div className="card p-3 mb-3">
      <label htmlFor="filtro-genero" className="form-label">Filtrar por género</label>
      <select id="filtro-genero" className="form-select">
        <option value="">Todos</option>
        <option value="Novela">Novela</option>
        <option value="Cuento">Cuento</option>
      </select>
    </div>
  );
};

export default Filtro;
