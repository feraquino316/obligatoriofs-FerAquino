import Header from '../componentes/Header';
import ListaLecturas from '../componentes/ListaLecturas';
import InformeUso from '../componentes/InformeUso';
import CambioPlan from '../componentes/CambioPlan';
import Grafico from '../componentes/Grafico';
import FormLectura from '../componentes/FormLectura';
import Filtro from '../componentes/Filtro';
import AdminCategorias from '../componentes/AdminCategorias';
import BuscarLibros from '../componentes/BuscarLibros';
import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getLecturasApi, getCategoriasApi } from '../services/api';
import { setLecturas } from '../store/slices/lecturasSlice';
import { setCategorias } from '../store/slices/categoriasSlice';


const Dashboard = () => {
  const usuario = useSelector((state) => state.auth.usuario);
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const [generoFiltro, setGeneroFiltro] = useState('');
  const [libroSeleccionado, setLibroSeleccionado] = useState(null);

  useEffect(() => {
    if (!token) return;
    getLecturasApi(token)
      .then((lecturas) => dispatch(setLecturas(lecturas)))
      .catch((err) => console.log(err.message));

    getCategoriasApi(token)
      .then((categorias) => dispatch(setCategorias(categorias)))
      .catch((err) => console.log(err.message));
  }, [token]);

  if (!usuario) return <Navigate to="/login" />;

  return (
    <>
      <Header />
      <div className="container mt-4">
        <div className="row">
          <div className="col-md-4">
            <InformeUso />
            <CambioPlan />
            <Grafico />
            {usuario.admin && <AdminCategorias />}
          </div>
          <div className="col-md-8">
            <FormLectura libro={libroSeleccionado} limpiarLibro={() => setLibroSeleccionado(null)} />
            <BuscarLibros onElegir={setLibroSeleccionado} />
            <Filtro genero={generoFiltro} setGenero={setGeneroFiltro} />
            <ListaLecturas generoFiltro={generoFiltro} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;