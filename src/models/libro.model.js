const mongoose = require("mongoose");
const librosSchema = require("./schemas/libros.schemas");

const Libro = mongoose.model("Libro", librosSchema);

module.exports = Libro;

