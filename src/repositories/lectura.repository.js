const Lectura = require("../models/lectura.model");
const connectToRedis = require("../services/redis.services");

const _getLecturasRedisKey = (userId, page, limit) =>
    `userId:${userId}-lecturas:page:${page}:limit:${limit}`;

// Borra del cache todas las páginas de lecturas de un usuario.
// Si no se pasa userId, borra las de todos (ej: al renombrar una categoría).
const invalidarCacheLecturas = async (userId = "*") => {
    try {
        const redisClient = connectToRedis();
        const keys = await redisClient.keys(`userId:${userId}-lecturas:*`);
        if (keys.length > 0) {
            await redisClient.del(...keys);
        }
    } catch (error) {
        console.error("No se pudo invalidar el cache de lecturas:", error.message);
    }
};

const getLecturas = async (userId) => {
    return await Lectura.find({ userId });
};

const findLectura = async (lecturaId, userId) => {
    return await Lectura.findOne({
        _id: lecturaId,
        userId: userId
    });
};

const createLectura = async (userId, datos) => {
    const { titulo, autor, año, genero, rating, imagenLibro, libroApiId } = datos;
    const nuevaLectura = new Lectura({
        titulo,
        autor,
        año,
        genero: genero ?? null,
        rating: rating ?? null,
        imagenLibro: imagenLibro ?? null,
        libroApiId: libroApiId ?? null,
        userId
    });
    await nuevaLectura.save();
    await invalidarCacheLecturas(userId);
    return nuevaLectura;
};

const deleteLectura = async (lecturaId, userId) => {
    const resultado = await Lectura.deleteOne({ _id: lecturaId, userId: userId });
    if (resultado.deletedCount > 0) {
        await invalidarCacheLecturas(userId);
    }
    return resultado;
};

const updateLectura = async (lecturaId, userId, payload) => {
    const lectura = await Lectura.findOne({
        _id: lecturaId,
        userId: userId
    });

    if (lectura) {
        Object.entries(payload).forEach(([key, value]) => {
            lectura[key] = value;
        });
        await lectura.save();
        await invalidarCacheLecturas(userId);
    }
    return lectura;
};

const getLecturasPaginated = async (userId, page = 1, limit = 5) => {
    const redisClient = connectToRedis();
    const lecturasRedisKey = _getLecturasRedisKey(userId, page, limit);

    const cached = await redisClient.get(lecturasRedisKey);
    if (cached) {
        console.log("Informacion obtenida de Redis...");
        return cached;
    }
    console.log("Buscando informacion en MongoDB...");
    const skip = (page - 1) * limit;

    const [lecturas, total] = await Promise.all([
        Lectura.find({ userId }).sort({ createdAt: -1 }).skip(skip).limit(limit),
        Lectura.countDocuments({ userId })
    ]);
    const result = {
        data: lecturas,
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
    };
    await redisClient.set(lecturasRedisKey, JSON.stringify(result), { ex: 3600 });
    return result;
};

const getLecturasPorCategoria = async (userId, categoria) => {
    return await Lectura.find({ userId, genero: categoria });
};

const countLecturas = async (userId) => {
    return await Lectura.countDocuments({ userId });
};

module.exports = {
    getLecturas,
    findLectura,
    createLectura,
    deleteLectura,
    updateLectura,
    getLecturasPaginated,
    getLecturasPorCategoria,
    countLecturas,
    invalidarCacheLecturas
};
