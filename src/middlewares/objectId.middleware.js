const mongoose = require("mongoose");

// Valida que req.params.id sea un ObjectId de Mongo válido (evita errores 500 por CastError).
const objectIdMiddleware = (req, res, next) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ message: "El id proporcionado no es válido" });
    }
    next();
};

module.exports = objectIdMiddleware;
