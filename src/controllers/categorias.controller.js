const {
    getCategorias,
    findCategoriaById,
    findCategoriaByNombre,
    createCategoria,
    updateCategoria,
    deleteCategoria
} = require("../repositories/categoria.repository");

const getCategoriasController = async (req, res) => {
    try {
        const categorias = await getCategorias();
        res.status(200).json(categorias);
    } catch (error) {
        res.status(500).json({ message: "Ha ocurrido un error", error: error.message });
    }
};

const getCategoriaByIdController = async (req, res) => {
    try {
        const categoria = await findCategoriaById(req.params.id);
        if (categoria) {
            res.status(200).json(categoria);
        } else {
            res.status(404).json({ message: "Categoría no encontrada" });
        }
    } catch (error) {
        res.status(500).json({ message: "Ha ocurrido un error", error: error.message });
    }
};

const postCategoriaController = async (req, res) => {
    try {
        const existente = await findCategoriaByNombre(req.body.nombre);
        if (existente) {
            return res.status(400).json({ message: "Ya existe una categoría con ese nombre" });
        }

        const nuevaCategoria = await createCategoria(req.body.nombre);
        res.status(201).json({
            message: "Categoría creada exitosamente",
            categoria: nuevaCategoria
        });
    } catch (error) {
        res.status(500).json({ message: "Ha ocurrido un error", error: error.message });
    }
};

const putCategoriaController = async (req, res) => {
    try {
        const existente = await findCategoriaByNombre(req.body.nombre);
        if (existente && existente._id.toString() !== req.params.id) {
            return res.status(400).json({ message: "Ya existe una categoría con ese nombre" });
        }

        const categoriaActualizada = await updateCategoria(req.params.id, req.body.nombre);
        if (categoriaActualizada) {
            res.status(200).json(categoriaActualizada);
        } else {
            res.status(404).json({ message: "Categoría no encontrada" });
        }
    } catch (error) {
        res.status(500).json({ message: "Ha ocurrido un error", error: error.message });
    }
};

const deleteCategoriaController = async (req, res) => {
    try {
        const resultado = await deleteCategoria(req.params.id);

        if (resultado.notFound) {
            return res.status(404).json({ message: "Categoría no encontrada" });
        }
        if (resultado.conflict) {
            return res.status(400).json({
                message: `No se puede borrar: hay ${resultado.cantidad} libro(s) con esta categoría asignada`
            });
        }
        res.status(200).json({ message: "Categoría eliminada exitosamente" });
    } catch (error) {
        res.status(500).json({ message: "Ha ocurrido un error", error: error.message });
    }
};

module.exports = {
    getCategoriasController,
    getCategoriaByIdController,
    postCategoriaController,
    putCategoriaController,
    deleteCategoriaController
};