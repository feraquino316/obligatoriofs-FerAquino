import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { agregarLectura } from '../store/slices/lecturasSlice';
import { buscarLibrosApi, crearLecturaApi } from '../services/api';
const LIMITE = Number(import.meta.env.VITE_LIMITE_PLUS);

const BuscarLibros = ({ onElegir }) => {
    const [texto, setTexto] = useState('');
    const [resultados, setResultados] = useState([]);
    const [buscando, setBuscando] = useState(false);
    const [error, setError] = useState('');
    const [mensaje, setMensaje] = useState('');

    const token = useSelector((state) => state.auth.token);
    const usuario = useSelector((state) => state.auth.usuario);
    const lecturas = useSelector((state) => state.lecturas.lista);
    const dispatch = useDispatch();

    const llegoAlLimite = !usuario.premium && lecturas.length >= LIMITE;

    const buscar = async (e) => {
        e.preventDefault();
        setBuscando(true);
        setError('');
        setMensaje('');
        try {
            const libros = await buscarLibrosApi(texto.trim(), token);
            setResultados(libros);
            if (libros.length === 0) setMensaje('No se encontraron libros.');
        } catch (err) {
            setError(err.message);
        } finally {
            setBuscando(false);
        }
    };

    const agregar = async (libro) => {
        const nueva = {
            titulo: libro.titulo.slice(0, 200),
            autor: libro.autor || 'Autor desconocido',
            libroApiId: libro.libroApiId,
        };
        if (libro.año) nueva.año = libro.año;

        try {
            const creada = await crearLecturaApi(nueva, token);
            dispatch(agregarLectura(creada));
            setMensaje(`"${libro.titulo}" se agregó a tus lecturas.`);
            setError('');
        } catch (err) {
            setError(err.message);
        }
    };

    const yaLaTengo = (libro) => lecturas.some((l) => l.libroApiId === libro.libroApiId);

    return (
        <div className="card p-3 mb-3">
            <h5>Buscar libros</h5>
            <form onSubmit={buscar} className="input-group mb-2">
                <input className="form-control" placeholder="Título o autor..."
                    value={texto} onChange={(e) => setTexto(e.target.value)} />
                <button type="submit" className="btn btn-primary" disabled={texto.trim().length < 2 || buscando}>
                    {buscando ? 'Buscando...' : 'Buscar'}
                </button>
            </form>

            {error && <div className="alert alert-danger py-1">{error}</div>}
            {mensaje && <div className="alert alert-info py-1">{mensaje}</div>}

            <ul className="list-group">
                {resultados.map((libro) => (
                    <li key={libro.libroApiId} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                            <strong>{libro.titulo}</strong>
                            <div className="small text-muted">
                                {libro.autor || 'Autor desconocido'}{libro.año ? ` · ${libro.año}` : ''}
                            </div>
                        </div>
                        {yaLaTengo(libro) ? (
                            <span className="badge bg-success">Ya la tenés</span>
                        ) : (
                            <button className="btn btn-sm btn-outline-success"
                                disabled={llegoAlLimite} onClick={() => onElegir(libro)}>
                                Usar
                            </button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default BuscarLibros;