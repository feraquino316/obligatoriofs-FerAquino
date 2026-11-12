import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { agregarLectura } from '../store/slices/lecturasSlice';
import { crearLecturaApi } from '../services/api';

const FormLectura = () => {
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [anio, setAnio] = useState('');
  const [genero, setGenero] = useState('');
  const [rating, setRating] = useState('');
  const [error, setError] = useState('');

  const token = useSelector((state) => state.auth.token);
  const categorias = useSelector((state) => state.categorias.lista);
  const usuario = useSelector((state) => state.auth.usuario);
  const lecturas = useSelector((state) => state.lecturas.lista);
  const dispatch = useDispatch();

  const agregar = async () => {
    const nueva = { titulo, autor };
    if (anio) nueva.año = Number(anio);
    if (genero) nueva.genero = genero;
    if (rating) nueva.rating = Number(rating);

    try {
      const creada = await crearLecturaApi(nueva, token);
      dispatch(agregarLectura(creada));
      setTitulo(''); setAutor(''); setAnio(''); setGenero(''); setRating('');
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const llegoAlLimite = !usuario.premium && lecturas.length >= 4;

  if (llegoAlLimite) {
    return (
      <div className="card p-3 mb-3">
        <h5>Agregar lectura</h5>
        <div className="alert alert-warning mb-0">
          Llegaste al límite de 4 lecturas del plan Plus. Pasate a Premium para seguir agregando.
        </div>
      </div>
    );
  }

  return (
    <div className="card p-3 mb-3">
      <h5>Agregar lectura</h5>
      <div className="row g-2">
        <div className="col-md-6">
          <input type="text" className="form-control" placeholder="Título"
            value={titulo} onChange={(e) => setTitulo(e.target.value)} />
        </div>
        <div className="col-md-6">
          <input type="text" className="form-control" placeholder="Autor"
            value={autor} onChange={(e) => setAutor(e.target.value)} />
        </div>
        <div className="col-md-4">
          <input type="number" className="form-control" placeholder="Año"
            value={anio} onChange={(e) => setAnio(e.target.value)} />
        </div>
        <div className="col-md-4">
          <select className="form-select" value={genero} onChange={(e) => setGenero(e.target.value)}>
            <option value="">Género</option>
            {categorias.map((c) => (
              <option key={c._id} value={c.nombre}>{c.nombre}</option>
            ))}
          </select>
        </div>
        <div className="col-md-4">
          <input type="number" className="form-control" placeholder="Rating (1-5)" min="1" max="5"
            value={rating} onChange={(e) => setRating(e.target.value)} />
        </div>
        <div className="col-12">
          <input type="file" className="form-control" accept="image/*" />
        </div>

        <div className="col-12">
          {error && <div className="alert alert-danger">{error}</div>}
        </div>

        <div className="col-12">
          <button className="btn btn-primary w-100" disabled={!titulo || autor.length < 2} onClick={agregar}>
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormLectura;