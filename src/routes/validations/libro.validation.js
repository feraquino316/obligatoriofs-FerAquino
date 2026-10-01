const joi = require('joi');

const librosValidation = joi.object({
    titulo: joi.string().min(2).max(30).required(),
    autor: joi.string().min(5).max(30).required(),
    año: joi.number().integer().min(0).optional(),
    genero: joi.string().min(2).max(30).optional(),
    rating: joi.number().integer().min(1).max(5).optional()
});

module.exports = librosValidation;