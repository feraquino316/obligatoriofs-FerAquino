import Header from '../componentes/Header';
import ListaLecturas from '../componentes/ListaLecturas';
import InformeUso from '../componentes/InformeUso';
import CambioPlan from '../componentes/CambioPlan';
import Grafico from '../componentes/Grafico';
import FormLectura from '../componentes/FormLectura';
import Filtro from '../componentes/Filtro';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const Dashboard = () => {
  const usuario = useSelector((state) => state.auth.usuario);
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
          </div>
          <div className="col-md-8">
            <FormLectura />
            <Filtro />
            <ListaLecturas />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;