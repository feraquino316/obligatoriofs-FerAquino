const joi = require("joi");

const categoriaValidation = joi.object({
    nombre: joi.string().min(2).max(30).required()
});

module.exports = categoriaValidation;