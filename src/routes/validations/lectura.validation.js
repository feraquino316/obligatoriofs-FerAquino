const joi = require('joi');

const lecturaValidation = joi.object({
    titulo: joi.string().min(1).max(200).required(),
    autor: joi.string().min(2).max(150).required(),
    año: joi.number().integer().min(0).optional(),
    genero: joi.string().min(2).max(30).optional(),
    rating: joi.number().integer().min(1).max(5).optional(),
    // imagenLibro no se acepta en el body: la portada solo se carga por Cloudinary (PUT /lecturas/:id/imagen)
    libroApiId: joi.string().allow(null).optional()
});

// En el PUT todos los campos son opcionales, pero tiene que venir al menos uno.
// Como no se permiten campos desconocidos, no se puede modificar userId ni _id.
const lecturaUpdateValidation = lecturaValidation
    .fork(["titulo", "autor"], (campo) => campo.optional())
    .min(1);

module.exports = {
    lecturaValidation,
    lecturaUpdateValidation
};
