// "Libros" = catálogo externo (API de libros). Las "lecturas" son la biblioteca personal del usuario.
const { buscarLibros, obtenerLibroPorId } = require("../services/librosApi.services");

const _responderError = (res, error) => {
    const status = error.response?.status;
    if (status === 404) {
        return res.status(404).json({ message: "Libro no encontrado en la API" });
    }
    if (status === 429 || status === 403) {
        console.error("Google Books rechazó la consulta (cuota o API key):", error.response.data?.error?.message);
        return res.status(503).json({ message: "La API de libros no está disponible (revisar GOOGLE_BOOKS_API_KEY o la cuota)" });
    }
    console.error("Error al consultar la API de libros:", error.message);
    res.status(502).json({ message: "No se pudo consultar la API de libros" });
};

const buscarLibrosController = async (req, res) => {
    const texto = req.query.q?.trim();
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 10, 40); // Google Books permite hasta 40

    if (!texto) {
        return res.status(400).json({ message: "Falta el parámetro de búsqueda 'q'" });
    }

    try {
        const { libros, total } = await buscarLibros(texto, page, limit);
        res.status(200).json({
            data: libros,
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        });
    } catch (error) {
        _responderError(res, error);
    }
};

const getLibroApiByIdController = async (req, res) => {
    // Los IDs de Google Books tienen 12 caracteres. Con un ID mal formado Google responde 503
    // en lugar de 404, así que lo cortamos antes.
    if (!/^[A-Za-z0-9_-]{12}$/.test(req.params.libroApiId)) {
        return res.status(404).json({ message: "Libro no encontrado en la API" });
    }

    try {
        const libro = await obtenerLibroPorId(req.params.libroApiId);
        res.status(200).json(libro);
    } catch (error) {
        _responderError(res, error);
    }
};

module.exports = {
    buscarLibrosController,
    getLibroApiByIdController
};
