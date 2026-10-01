const express = require('express');
const privateRouter = express.Router();
const {
    getLibrosController,
    getLibrosControllerById,
    postLibrosController,
    putLibrosController,
    deleteLibrosController,
    getLibrosPorCategoriaController
} = require('../controllers/libros.controller');

const {
    getCategoriasController,
    getCategoriaByIdController,
    postCategoriaController,
    putCategoriaController,
    deleteCategoriaController
} = require('../controllers/categorias.controller');

const { upgradeUserToPremium } = require('../controllers/usuarios.controller');

const payloadMiddleware = require('../middlewares/payload.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');
const librosValidation = require('./validations/libro.validation');
const categoriaValidation = require('./validations/categoria.validation');

privateRouter.put("/usuarios/plan", upgradeUserToPremium);
privateRouter.get("/libros", getLibrosController);
privateRouter.get("/libros/:id", getLibrosControllerById);
privateRouter.get("/libros/categoria/:categoria", getLibrosPorCategoriaController);
privateRouter.post("/libros", payloadMiddleware(librosValidation), postLibrosController);
privateRouter.delete("/libros/:id", deleteLibrosController);
privateRouter.put("/libros/:id", putLibrosController);

privateRouter.get("/categorias", getCategoriasController);
privateRouter.get("/categorias/:id", getCategoriaByIdController);
privateRouter.post("/categorias", adminMiddleware, payloadMiddleware(categoriaValidation), postCategoriaController);
privateRouter.put("/categorias/:id", adminMiddleware, payloadMiddleware(categoriaValidation), putCategoriaController);
privateRouter.delete("/categorias/:id", adminMiddleware, deleteCategoriaController);

module.exports = privateRouter;