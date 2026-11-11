const FormLectura = () => {
  return (
    <div className="card p-3 mb-3">
      <h5>Agregar lectura</h5>
      <div className="row g-2">
        <div className="col-md-6">
          <input type="text" className="form-control" placeholder="Título" />
        </div>
        <div className="col-md-6">
          <input type="text" className="form-control" placeholder="Autor" />
        </div>
        <div className="col-md-4">
          <input type="number" className="form-control" placeholder="Año" />
        </div>
        <div className="col-md-4">
          <select className="form-select">
            <option value="">Género</option>
            <option>Novela</option>
            <option>Cuento</option>
          </select>
        </div>
        <div className="col-md-4">
          <input type="number" className="form-control" placeholder="Rating (1-5)" min="1" max="5" />
        </div>
        <div className="col-12">
          <input type="file" className="form-control" accept="image/*" />
        </div>
        <div className="col-12">
          <button className="btn btn-primary w-100">Agregar</button>
        </div>
      </div>
    </div>
  );
};

export default FormLectura;