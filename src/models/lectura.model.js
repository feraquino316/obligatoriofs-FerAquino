const mongoose = require("mongoose");
const lecturasSchema = require("./schemas/lecturas.schemas");

const Lectura = mongoose.model("Lectura", lecturasSchema);

module.exports = Lectura;
