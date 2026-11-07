const express = require('express');
const iaRouter = express.Router();

const { generarResenaController } = require("../controllers/ia.controller");
const objectIdMiddleware = require('../middlewares/objectId.middleware');

iaRouter.post("/lecturas/:id/resena", objectIdMiddleware, generarResenaController);

module.exports = iaRouter;
