const App = () => {
      let personas = [
        { id: 1, nombre: 'Juan', edad: 25 },
        { id: 2, nombre: 'María', edad: 30 },
        { id: 3, nombre: 'Pedro', edad: 20 },
      ];

        <div>
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
    </div>
}

export default App