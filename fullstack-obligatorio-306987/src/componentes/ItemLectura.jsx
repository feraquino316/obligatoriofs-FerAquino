const ItemLectura = ({ lectura }) => {
  return (
    <tr>
      <td>{lectura.titulo}</td>
      <td>{lectura.autor}</td>
      <td>{lectura.genero}</td>
      <td>{lectura.rating}</td>
      <td>
        <button className="btn btn-sm btn-outline-primary me-2">Editar</button>
        <button className="btn btn-sm btn-outline-danger">Eliminar</button>
      </td>
    </tr>
  );
};

export default ItemLectura;