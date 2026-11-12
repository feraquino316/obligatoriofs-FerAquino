import { useSelector } from 'react-redux';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const Grafico = () => {
  const lecturas = useSelector((state) => state.lecturas.lista);

  // contar cuántas lecturas hay de cada género
  const conteo = {};
  lecturas.forEach((l) => {
    const genero = l.genero || 'Sin género';
    conteo[genero] = (conteo[genero] || 0) + 1;
  });

  const data = {
    labels: Object.keys(conteo),
    datasets: [
      {
        data: Object.values(conteo),
        backgroundColor: ['#0d6efd', '#ffc107', '#198754', '#dc3545', '#6f42c1', '#fd7e14', '#20c997'],
      },
    ],
  };

  return (
    <div className="card p-3 mb-3">
      <h5>Lecturas por género</h5>
      {lecturas.length === 0
        ? <p className="text-muted mb-0">Agregá lecturas para ver el gráfico.</p>
        : <Pie data={data} />}
    </div>
  );
};

export default Grafico;