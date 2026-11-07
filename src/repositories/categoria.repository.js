const Categoria = require("../models/categoria.model");
const Lectura = require("../models/lectura.model");
const { invalidarCacheLecturas } = require("./lectura.repository");

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
    const nombreAnterior = categoria.nombre;
    categoria.nombre = nombre;
    await categoria.save();

    // Las lecturas guardan el género por nombre, así que hay que renombrarlo también ahí
    if (nombreAnterior !== nombre) {
        await Lectura.updateMany({ genero: nombreAnterior }, { genero: nombre });
        await invalidarCacheLecturas();
    }
    return categoria;
};

const deleteCategoria = async (id) => {
    const categoria = await Categoria.findById(id);
    if (!categoria) {
        return { notFound: true };
    }

    const lecturasAsociadas = await Lectura.countDocuments({ genero: categoria.nombre });
    if (lecturasAsociadas > 0) {
        return { conflict: true, cantidad: lecturasAsociadas };
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
