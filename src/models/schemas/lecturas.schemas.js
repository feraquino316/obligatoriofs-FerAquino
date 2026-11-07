const mongoose = require("mongoose");

const lecturasSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    titulo: { type: String, required: true },
    autor: { type: String, required: true },
    año: { type: Number },
    genero: { type: String },
    rating: { type: Number, min: 1, max: 5 },
    imagenLibro: { type: String, default: null }, // URL de Cloudinary (o de la API de libros)
    libroApiId: { type: String, default: null }   // ID del libro en la API externa, si se importó desde ahí
},
{
    timestamps: true
}
);

module.exports = lecturasSchema;
