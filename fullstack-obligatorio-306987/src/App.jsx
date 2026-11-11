import Login from './pages/Login';
import Registro from './pages/Registro';
import Dashboard from './pages/Dashboard';

const App = () => {
      let personas = [
        { id: 1, nombre: 'Juan', edad: 25 },
        { id: 2, nombre: 'María', edad: 30 },
        { id: 3, nombre: 'Pedro', edad: 20 },
      ];

      return (
        <div>
          <h1>Lista de Personas</h1>
          <ul>
            {personas.map((persona, index) => (
              <li key={index}>
                {persona.nombre} - {persona.edad} años
              </li>
            ))}
          </ul>
        </div>
      );
}

export default App