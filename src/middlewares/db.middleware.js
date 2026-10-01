const connectMongoDb = require("../models/mongo.client");

const dbMiddleware = async (req, res, next) => {
    try {
        await connectMongoDb();
        next();
    } catch (error) {
        console.error("Error al conectar a la base de datos:", error);
        res.status(500).json({ error: "Error al conectar a la base de datos" });
    }
};

module.exports = dbMiddleware;