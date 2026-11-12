import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { eliminarLectura, actualizarLectura } from '../store/slices/lecturasSlice';
import { eliminarLecturaApi, editarLecturaApi, generarResenaApi } from '../services/api';

const ItemLectura = ({ lectura }) => {
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();

  const [editando, setEditando] = useState(false);
  const [titulo, setTitulo] = useState(lectura.titulo);
  const [autor, setAutor] = useState(lectura.autor);
  const [rating, setRating] = useState(lectura.rating || '');
  const [borrando, setBorrando] = useState(false);
  const [resena, setResena] = useState('');
  const [generando, setGenerando] = useState(false);

  const eliminar = async () => {
    if (!confirm(`¿Eliminar "${lectura.titulo}"?`)) return;
    setBorrando(true);
    try {
      await eliminarLecturaApi(lectura._id, token);
      dispatch(eliminarLectura(lectura._id));
    } catch (err) {
      alert(err.message);
      setBorrando(false);
    }
  };

  const guardar = async () => {
    const cambios = { titulo, autor };
    if (rating) cambios.rating = Number(rating);
    try {
      await editarLecturaApi(lectura._id, cambios, token);
      dispatch(actualizarLectura({ ...lectura, ...cambios }));
      setEditando(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const cancelar = () => {
    setTitulo(lectura.titulo);
    setAutor(lectura.autor);
    setRating(lectura.rating || '');
    setEditando(false);
  };

  const pedirResena = async () => {
    setGenerando(true);
    try {
      const texto = await generarResenaApi(lectura._id, token);
      setResena(texto);
    } catch (err) {
      setResena(err.message);
    } finally {
      setGenerando(false);
    }
  };

  if (editando) {
    return (
      <tr>
        <td><input className="form-control form-control-sm" value={titulo} onChange={(e) => setTitulo(e.target.value)} /></td>
        <td><input className="form-control form-control-sm" value={autor} onChange={(e) => setAutor(e.target.value)} /></td>
        <td>{lectura.genero}</td>
        <td><input type="number" min="1" max="5" className="form-control form-control-sm" value={rating} onChange={(e) => setRating(e.target.value)} /></td>
        <td>
          <button className="btn btn-sm btn-success me-2" onClick={guardar} disabled={!titulo || autor.length < 2}>Guardar</button>
          <button className="btn btn-sm btn-secondary" onClick={cancelar}>Cancelar</button>
        </td>
      </tr>
    );
  }

  return (
    <>
      <tr>
        <td>
          {lectura.imagenLibro && (
            <img src={lectura.imagenLibro} alt="" style={{ width: 32, height: 48, objectFit: 'cover' }} className="me-2 rounded" />
          )}
          {lectura.titulo}
        </td>
        <td>{lectura.autor}</td>
        <td>{lectura.genero}</td>
        <td>{lectura.rating}</td>
        <td>
          <button className="btn btn-sm btn-outline-secondary me-2" onClick={pedirResena} disabled={generando}>
            {generando ? 'Generando...' : '✨ Reseña'}
          </button>
          <button className="btn btn-sm btn-outline-primary me-2" onClick={() => setEditando(true)}>Editar</button>
          <button className="btn btn-sm btn-outline-danger" onClick={eliminar} disabled={borrando}>
            {borrando ? 'Eliminando...' : 'Eliminar'}
          </button>
        </td>
      </tr>

      {resena && (
        <tr>
          <td colSpan="5" className="bg-light">
            <div className="d-flex justify-content-between align-items-start">
              <em className="small">{resena}</em>
              <button type="button" className="btn-close btn-sm ms-2" onClick={() => setResena('')}></button>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

export default ItemLectura;