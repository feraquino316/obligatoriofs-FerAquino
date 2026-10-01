const mongoose = require("mongoose");

const librosSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    titulo: { type: String, required: true },
    autor: { type: String, required: true },
    año: { type: Number },
    genero: { type: String },
    rating: { type: Number, min: 1, max: 5 }
},
{
    timestamps: true
}
);

module.exports = librosSchema;