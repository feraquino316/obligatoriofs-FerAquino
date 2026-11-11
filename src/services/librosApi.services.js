const axios = require('axios');

/*
 * Servicio para consultar la API de Google Books (https://developers.google.com/books/docs/v1/using).
 * Requiere GOOGLE_BOOKS_API_KEY en el .env (sin key, Google rechaza las consultas por cuota).
 *
 * El resto del backend (controller, rutas, frontend) trabaja siempre con el
 * formato que devuelve mapearVolumen, así que si algún día se cambia de API
 * solo hay que modificar este archivo.
 *
 * La portada NO se toma de la API: la imagen de una lectura solo se carga por Cloudinary.
 */

const cliente = axios.create({
    baseURL: "https://www.googleapis.com/books/v1",
    timeout: 8000
});

// Agrega la API key a los parámetros de cada consulta
const _params = (params = {}) => ({ ...params, key: process.env.GOOGLE_BOOKS_API_KEY });

// "1965-08-01" -> 1965
const _año = (fecha) => {
    const match = String(fecha ?? "").match(/\d{4}/);
    return match ? parseInt(match[0]) : null;
};

// Google devuelve la descripción con HTML (<p>, <b>, <br>...), se lo sacamos
const _textoPlano = (html) => html?.replace(/<[^>]*>/g, "").trim() || null;

const mapearVolumen = (volumen) => {
    const info = volumen.volumeInfo ?? {};
    return {
        libroApiId: volumen.id,
        titulo: info.title ?? null,
        autor: info.authors?.join(", ") ?? null,
        año: _año(info.publishedDate),
        descripcion: _textoPlano(info.description)
    };
};

const buscarLibros = async (texto, page = 1, limit = 10) => {
    const { data } = await cliente.get('/volumes', {
        params: _params({
            q: texto,
            startIndex: (page - 1) * limit,
            maxResults: limit,
            printType: "books"
        })
    });
    return {
        libros: (data.items ?? []).map(mapearVolumen),
        total: data.totalItems ?? 0
    };
};

const obtenerLibroPorId = async (libroApiId) => {
    const { data } = await cliente.get(`/volumes/${encodeURIComponent(libroApiId)}`, {
        params: _params()
    });
    return mapearVolumen(data);
};

module.exports = {
    buscarLibros,
    obtenerLibroPorId
};
