const Categoria = require("../models/categoria.model");
const Libro = require("../models/libro.model");

const getCategorias = async () => {
    return await Categoria.find();
};

const findCategoriaById = async (id) => {
    return await Categoria.findById(id);
};

const findCategoriaByNombre = async (nombre) => {
    return await Categoria.findOne({ nombre });
};

const createCategoria = async (nombre) => {
    const nuevaCategoria = new Categoria({ nombre });
    await nuevaCategoria.save();
    return nuevaCategoria;
};

const updateCategoria = async (id, nombre) => {
    const categoria = await Categoria.findById(id);
    if (!categoria) {
        return null;
    }
    categoria.nombre = nombre;
    await categoria.save();
    return categoria;
};

const deleteCategoria = async (id) => {
    const categoria = await Categoria.findById(id);
    if (!categoria) {
        return { notFound: true };
    }

    const librosAsociados = await Libro.countDocuments({ genero: categoria.nombre });
    if (librosAsociados > 0) {
        return { conflict: true, cantidad: librosAsociados };
    }

    await Categoria.deleteOne({ _id: id });
    return { deleted: true };
};

module.exports = {
    getCategorias,
    findCategoriaById,
    findCategoriaByNombre,
    createCategoria,
    updateCategoria,
    deleteCategoria
};