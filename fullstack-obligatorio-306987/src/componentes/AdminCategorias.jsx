import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { agregarCategoria, actualizarCategoria, eliminarCategoria } from '../store/slices/categoriasSlice';
import { crearCategoriaApi, editarCategoriaApi, eliminarCategoriaApi } from '../services/api';

const AdminCategorias = () => {
  const categorias = useSelector((state) => state.categorias.lista);
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();

  const [nueva, setNueva] = useState('');
  const [editandoId, setEditandoId] = useState(null);
  const [nombreEditado, setNombreEditado] = useState('');
  const [error, setError] = useState('');

  const nombreValido = (n) => n.trim().length >= 2 && n.trim().length <= 30;

  const crear = async () => {
    try {
      const creada = await crearCategoriaApi(nueva.trim(), token);
      dispatch(agregarCategoria(creada));
      setNueva('');
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const guardar = async (id) => {
    try {
      const editada = await editarCategoriaApi(id, nombreEditado.trim(), token);
      dispatch(actualizarCategoria(editada));
      setEditandoId(null);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const eliminar = async (c) => {
    if (!confirm(`¿Eliminar la categoría "${c.nombre}"?`)) return;
    try {
      await eliminarCategoriaApi(c._id, token);
      dispatch(eliminarCategoria(c._id));
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="card p-3 mb-3 border-danger">
      <h5>Categorías <span className="badge bg-danger">Admin</span></h5>

      <div className="input-group mb-2">
        <input className="form-control" placeholder="Nueva categoría"
          value={nueva} onChange={(e) => setNueva(e.target.value)} />
        <button className="btn btn-success" disabled={!nombreValido(nueva)} onClick={crear}>Agregar</button>
      </div>

      {error && <div className="alert alert-danger py-1">{error}</div>}

      <ul className="list-group">
        {categorias.map((c) => (
          <li key={c._id} className="list-group-item d-flex align-items-center gap-2">
            {editandoId === c._id ? (
              <>
                <input className="form-control form-control-sm" value={nombreEditado}
                  onChange={(e) => setNombreEditado(e.target.value)} />
                <button className="btn btn-sm btn-success" disabled={!nombreValido(nombreEditado)}
                  onClick={() => guardar(c._id)}>✓</button>
                <button className="btn btn-sm btn-secondary" onClick={() => setEditandoId(null)}>✕</button>
              </>
            ) : (
              <>
                <span className="flex-grow-1">{c.nombre}</span>
                <button className="btn btn-sm btn-outline-primary"
                  onClick={() => { setEditandoId(c._id); setNombreEditado(c.nombre); }}>Editar</button>
                <button className="btn btn-sm btn-outline-danger" onClick={() => eliminar(c)}>Borrar</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminCategorias;