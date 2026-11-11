import ItemLectura from './ItemLectura';

const ListaLecturas = () => {
  const lecturas = [
    { _id: '1', titulo: 'Rayuela', autor: 'Cortázar', genero: 'Novela', rating: 5 },
    { _id: '2', titulo: 'Ficciones', autor: 'Borges', genero: 'Cuento', rating: 4 },
    { _id: '3', titulo: '1984', autor: 'Orwell', genero: 'Distopía', rating: 5 },
  ];

  return (
    <div className="card p-3">
      <h5>Mis lecturas</h5>
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
          {lecturas.map((lectura) => (
            <ItemLectura key={lectura._id} lectura={lectura} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListaLecturas;