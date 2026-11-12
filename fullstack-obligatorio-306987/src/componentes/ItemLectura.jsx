import { useSelector, useDispatch } from 'react-redux';
import { eliminarLectura } from '../store/slices/lecturasSlice';
import { eliminarLecturaApi } from '../services/api';

const ItemLectura = ({ lectura }) => {
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();

  const eliminar = async () => {
    if (!confirm(`¿Eliminar "${lectura.titulo}"?`)) return;
    try {
      await eliminarLecturaApi(lectura._id, token);
      dispatch(eliminarLectura(lectura._id));
    } catch (err) {
      alert(err.message);
    }
  };
  
  return (
    <tr>
      <td>{lectura.titulo}</td>
      <td>{lectura.autor}</td>
      <td>{lectura.genero}</td>
      <td>{lectura.rating}</td>
      <td>
        <button className="btn btn-sm btn-outline-primary me-2">Editar</button>
        <button className="btn btn-sm btn-outline-danger" onClick={eliminar}>Eliminar</button>
      </td>
    </tr>
  );
};

export default ItemLectura;