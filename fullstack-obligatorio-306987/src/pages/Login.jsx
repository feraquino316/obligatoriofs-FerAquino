const Login = () => {
  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card p-4 shadow" style={{ width: '22rem' }}>
        <h2 className="text-center mb-4">Iniciar sesión</h2>

        <div className="mb-3">
          <label htmlFor="username" className="form-label">Usuario</label>
          <input type="text" id="username" className="form-control" />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">Contraseña</label>
          <input type="password" id="password" className="form-control" />
        </div>

        <button className="btn btn-primary w-100">Ingresar</button>

        <p className="text-center mt-3">
          ¿No tenés cuenta? <a href="#">Registrate</a>
        </p>
      </div>
    </div>
  );
};

export default Login;