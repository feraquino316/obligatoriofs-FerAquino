const express = require('express');
const privateRouter = express.Router();
const {
    getLecturasController,
    getLecturaByIdController,
    postLecturaController,
    putLecturaController,
    putImagenLecturaController,
    deleteLecturaController,
    getLecturasPorCategoriaController
} = require('../controllers/lecturas.controller');

const {
    buscarLibrosController,
    getLibroApiByIdController
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
const objectIdMiddleware = require('../middlewares/objectId.middleware');
const { upload } = require('../middlewares/multer.middleware');
const { lecturaValidation, lecturaUpdateValidation } = require('./validations/lectura.validation');
const categoriaValidation = require('./validations/categoria.validation');

privateRouter.put("/usuarios/plan", upgradeUserToPremium);

// Lecturas (biblioteca personal del usuario)
privateRouter.get("/lecturas", getLecturasController);
privateRouter.get("/lecturas/categoria/:categoria", getLecturasPorCategoriaController);
privateRouter.get("/lecturas/:id", objectIdMiddleware, getLecturaByIdController);
privateRouter.post("/lecturas", payloadMiddleware(lecturaValidation), postLecturaController);
privateRouter.put("/lecturas/:id", objectIdMiddleware, payloadMiddleware(lecturaUpdateValidation), putLecturaController);
privateRouter.put("/lecturas/:id/imagen", objectIdMiddleware, upload.single("imagen"), putImagenLecturaController);
privateRouter.delete("/lecturas/:id", objectIdMiddleware, deleteLecturaController);

// Libros (catálogo de la API externa)
privateRouter.get("/libros/buscar", buscarLibrosController);
privateRouter.get("/libros/:libroApiId", getLibroApiByIdController);

// Categorías
privateRouter.get("/categorias", getCategoriasController);
privateRouter.get("/categorias/:id", objectIdMiddleware, getCategoriaByIdController);
privateRouter.post("/categorias", adminMiddleware, payloadMiddleware(categoriaValidation), postCategoriaController);
privateRouter.put("/categorias/:id", adminMiddleware, objectIdMiddleware, payloadMiddleware(categoriaValidation), putCategoriaController);
privateRouter.delete("/categorias/:id", adminMiddleware, objectIdMiddleware, deleteCategoriaController);

module.exports = privateRouter;
