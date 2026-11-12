import ItemLectura from './ItemLectura';
import { useSelector } from 'react-redux';

const ListaLecturas = ({ generoFiltro }) => {
  const lecturas = useSelector((state) => state.lecturas.lista);
  const filtradas = generoFiltro
    ? lecturas.filter((l) => l.genero === generoFiltro)
    : lecturas;

  return (
    <div className="card p-3">
      <h5>Mis lecturas</h5>

      {lecturas.length === 0 && <p className="text-muted">Todavía no agregaste lecturas.</p>}

      <table className="table table-hover">
        <thead>
          <tr>
            <th>Título</th>
            <th>Autor</th>
            <th>Género</th>
            <th>Rating</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filtradas.map((lectura) => (
            <ItemLectura key={lectura._id} lectura={lectura} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListaLecturas;