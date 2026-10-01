const mongoose = require("mongoose");

let connectionPromise = null;

const connectMongoDb = async () => {

    if (mongoose.connection.readyState === 1) {
        console.log("Ya estabamos conectados a MongoDB");
        return mongoose.connection;
    }

    if (!connectionPromise) {
        const MONGODB_CONNECTION_STRING = process.env.MONGODB_CONNECTION_STRING;
        const MONGODB_DATABASE_NAME = process.env.MONGODB_DATABASE_NAME;
        const MONGODB_CONNECTION_TIMEOUT = process.env.MONGODB_CONNECTION_TIMEOUT

        connectionPromise = mongoose.connect(MONGODB_CONNECTION_STRING, {
            dbName: MONGODB_DATABASE_NAME,
            serverSelectionTimeoutMS: MONGODB_CONNECTION_TIMEOUT
        })
        .then((connection) => {
            console.log("Conectado a MongoDB correctamente");
            return connection;
        })
        .catch((error) => {
            console.log("Ocurrio un error al conectarse a MongoDB", error);
            connectionPromise = null;
            throw error;
        });
    }

    return connectionPromise;

}

module.exports = connectMongoDb;