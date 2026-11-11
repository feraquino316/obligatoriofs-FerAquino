const InformeUso = () => {
  return (
    <div className="card p-3 mb-3">
      <h5>Uso del plan</h5>
      <p className="mb-2">3 de 4 lecturas (75%)</p>
      <div className="progress">
        <div className="progress-bar" style={{ width: '75%' }}></div>
      </div>
    </div>
  );
};

export default InformeUso;