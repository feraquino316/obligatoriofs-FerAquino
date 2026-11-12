import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useSelector, useDispatch } from 'react-redux';
import { agregarLectura } from '../store/slices/lecturasSlice';
import { crearLecturaApi, subirImagenApi } from '../services/api';

const anioActual = new Date().getFullYear();

const schema = yup.object({
  titulo: yup.string().required('El título es obligatorio').max(200, 'Máximo 200 caracteres'),
  autor: yup.string().required('El autor es obligatorio').min(2, 'Mínimo 2 caracteres').max(150, 'Máximo 150 caracteres'),
  anio: yup.number()
    .transform((v, original) => (original === '' ? undefined : v))
    .integer('Tiene que ser un año entero')
    .min(0, 'Año inválido')
    .max(anioActual, `No puede ser mayor a ${anioActual}`)
    .optional(),
  genero: yup.string().optional(),
  rating: yup.number()
    .transform((v, original) => (original === '' ? undefined : v))
    .integer('Tiene que ser un número entero')
    .min(1, 'Mínimo 1')
    .max(5, 'Máximo 5')
    .optional(),
});

const FormLectura = () => {
  const [error, setError] = useState('');
  const [archivo, setArchivo] = useState(null);
  const [guardando, setGuardando] = useState(false);

  const token = useSelector((state) => state.auth.token);
  const usuario = useSelector((state) => state.auth.usuario);
  const lecturas = useSelector((state) => state.lecturas.lista);
  const categorias = useSelector((state) => state.categorias.lista);
  const dispatch = useDispatch();

  const { register, handleSubmit, reset, watch, formState: { errors, isValid } } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const genero = watch('genero');

  const agregar = async (datos) => {
    const nueva = { titulo: datos.titulo, autor: datos.autor };
    if (datos.anio !== undefined) nueva.año = datos.anio;
    if (datos.genero) nueva.genero = datos.genero;
    if (datos.rating !== undefined) nueva.rating = datos.rating;

    setGuardando(true);
    try {
      let creada = await crearLecturaApi(nueva, token);
      if (archivo) {
        creada = await subirImagenApi(creada._id, archivo, token);
      }
      dispatch(agregarLectura(creada));
      reset();
      setArchivo(null);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setGuardando(false);
    }
  };

  const llegoAlLimite = !usuario.premium && lecturas.length >= 4;

  if (llegoAlLimite) {
    return (
      <div className="card p-3 mb-3">
        <h5>Agregar lectura</h5>
        <div className="alert alert-warning mb-0">
          Llegaste al límite de 4 lecturas del plan Plus. Pasate a Premium para seguir agregando.
        </div>
      </div>
    );
  }

  return (
    <div className="card p-3 mb-3">
      <h5>Agregar lectura</h5>
      <form onSubmit={handleSubmit(agregar)} className="row g-2">
        <div className="col-md-6">
          <input type="text" placeholder="Título"
            className={`form-control ${errors.titulo ? 'is-invalid' : ''}`}
            {...register('titulo')} />
          {errors.titulo && <div className="invalid-feedback">{errors.titulo.message}</div>}
        </div>
        <div className="col-md-6">
          <input type="text" placeholder="Autor"
            className={`form-control ${errors.autor ? 'is-invalid' : ''}`}
            {...register('autor')} />
          {errors.autor && <div className="invalid-feedback">{errors.autor.message}</div>}
        </div>
        <div className="col-md-4">
          <input type="number" placeholder="Año"
            className={`form-control ${errors.anio ? 'is-invalid' : ''}`}
            {...register('anio')} />
          {errors.anio && <div className="invalid-feedback">{errors.anio.message}</div>}
        </div>
        <div className="col-md-4">
          <select className={`form-select ${genero ? '' : 'text-muted'}`} defaultValue="" {...register('genero')}>
            <option value="" disabled hidden>Género</option>
            <option value="">Sin género</option>
            {categorias.map((c) => (
              <option key={c._id} value={c.nombre}>{c.nombre}</option>
            ))}
          </select>
        </div>
        <div className="col-md-4">
          <input type="number" placeholder="Rating (1-5)"
            className={`form-control ${errors.rating ? 'is-invalid' : ''}`}
            {...register('rating')} />
          {errors.rating && <div className="invalid-feedback">{errors.rating.message}</div>}
        </div>
        <div className="col-12">
          <label className="form-label small text-muted mb-1">Portada (opcional)</label>
          <input type="file" className="form-control" accept="image/*"
            onChange={(e) => setArchivo(e.target.files[0])} />
        </div>

        {error && <div className="col-12"><div className="alert alert-danger mb-0">{error}</div></div>}

        <div className="col-12">
          <button type="submit" className="btn btn-primary w-100" disabled={!isValid || guardando}>
            {guardando ? 'Guardando...' : 'Agregar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormLectura;