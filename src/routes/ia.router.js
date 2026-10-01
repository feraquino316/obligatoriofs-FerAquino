const express = require('express');
const iaRouter = express.Router();

const { generarResenaController } = require("../controllers/ia.controller");

iaRouter.post("/libros/:id/resena", generarResenaController);

module.exports = iaRouter;