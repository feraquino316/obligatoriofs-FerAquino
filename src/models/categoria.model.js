const mongoose = require("mongoose");
const categoriaSchema = require("./schemas/categoria.schemas");

const Categoria = mongoose.model("Categoria", categoriaSchema);

module.exports = Categoria;