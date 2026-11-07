// "Libros" = catálogo externo (API de libros). Las "lecturas" son la biblioteca personal del usuario.
const { buscarLibros, obtenerLibroPorId } = require("../services/librosApi.services");

const _responderError = (res, error) => {
    if (error.response?.status === 404) {
        return res.status(404).json({ message: "Libro no encontrado en la API" });
    }
    console.error("Error al consultar la API de libros:", error.message);
    res.status(502).json({ message: "No se pudo consultar la API de libros" });
};

const buscarLibrosController = async (req, res) => {
    const texto = req.query.q?.trim();
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);

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
