const axios = require('axios');

/*
 * Servicio para consultar la API de Open Library (https://openlibrary.org/developers/api).
 * No requiere API key.
 *
 * El resto del backend (controller, rutas, frontend) trabaja siempre con el
 * formato que devuelven las funciones mapear*, así que si algún día se cambia
 * de API solo hay que modificar este archivo.
 */

const BASE_URL = process.env.LIBROS_API_URL || "https://openlibrary.org";
const COVERS_URL = "https://covers.openlibrary.org/b/id";

const cliente = axios.create({
    baseURL: BASE_URL,
    timeout: 8000,
    // Open Library pide identificar la aplicación en el User-Agent
    headers: { 'User-Agent': 'ObligatorioFullStack/1.0' }
});

const _urlPortada = (coverId) => (coverId ? `${COVERS_URL}/${coverId}-L.jpg` : null);

// "/works/OL45804W" -> "OL45804W"
const _limpiarKey = (key) => key?.split("/").pop();

// La descripción a veces viene como string y a veces como { type, value }
const _descripcion = (desc) => (typeof desc === "string" ? desc : desc?.value ?? null);

// "August 1965" -> 1965
const _año = (fecha) => {
    const match = String(fecha ?? "").match(/\d{4}/);
    return match ? parseInt(match[0]) : null;
};

// Resultado de /search.json
const mapearResultadoBusqueda = (doc) => ({
    libroApiId: _limpiarKey(doc.key),
    titulo: doc.title ?? null,
    autor: doc.author_name?.join(", ") ?? null,
    año: doc.first_publish_year ?? null,
    imagenLibro: _urlPortada(doc.cover_i),
    descripcion: null
});

const buscarLibros = async (texto, page = 1, limit = 10) => {
    const { data } = await cliente.get('/search.json', {
        params: {
            q: texto,
            page,
            limit,
            fields: "key,title,author_name,first_publish_year,cover_i"
        }
    });
    return {
        libros: data.docs.map(mapearResultadoBusqueda),
        total: data.numFound
    };
};

// Detalle de una obra: /works/{id}.json
// Los autores vienen solo como referencia, así que se busca el nombre de cada uno.
const obtenerLibroPorId = async (libroApiId) => {
    const { data: obra } = await cliente.get(`/works/${encodeURIComponent(libroApiId)}.json`);

    const autoresKeys = (obra.authors ?? [])
        .map((a) => a.author?.key)
        .filter(Boolean)
        .slice(0, 3);

    const autores = await Promise.all(
        autoresKeys.map((key) =>
            cliente.get(`${key}.json`)
                .then((res) => res.data.name)
                .catch(() => null)
        )
    );

    // Muchas obras no traen first_publish_date en este endpoint, pero el buscador sí lo tiene
    let año = _año(obra.first_publish_date);
    if (!año) {
        año = await cliente.get('/search.json', { params: { q: `key:${obra.key}`, fields: "first_publish_year" } })
            .then((res) => res.data.docs[0]?.first_publish_year ?? null)
            .catch(() => null);
    }

    return {
        libroApiId: _limpiarKey(obra.key),
        titulo: obra.title ?? null,
        autor: autores.filter(Boolean).join(", ") || null,
        año,
        imagenLibro: _urlPortada(obra.covers?.find((id) => id > 0)),
        descripcion: _descripcion(obra.description)
    };
};

module.exports = {
    buscarLibros,
    obtenerLibroPorId
};
