import { Link } from 'react-router-dom';
const Registro = () => {
  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card p-4 shadow" style={{ width: '22rem' }}>
        <h2 className="text-center mb-4">Crear cuenta</h2>

        <div className="mb-3">
          <label htmlFor="registro-username" className="form-label">Usuario</label>
          <input type="text" id="registro-username" className="form-control" />
        </div>

        <div className="mb-3">
          <label htmlFor="registro-email" className="form-label">Email</label>
          <input type="email" id="registro-email" className="form-control" />
        </div>

        <div className="mb-3">
          <label htmlFor="registro-password" className="form-label">Contraseña</label>
          <input type="password" id="registro-password" className="form-control" />
        </div>

        <div className="mb-3">
          <label htmlFor="registro-confirmar" className="form-label">Confirmar contraseña</label>
          <input type="password" id="registro-confirmar" className="form-control" />
        </div>

        <div className="alert alert-danger">El nombre de usuario ya está en uso</div>

        <button className="btn btn-primary w-100">Registrarme</button>

        <p className="text-center mt-3">
          ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
        </p>
      </div>
    </div>
  );
};

export default Registro;
