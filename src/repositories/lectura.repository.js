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
    // imagenLibro no se recibe acá: se asigna después subiendo la imagen a Cloudinary
    const { titulo, autor, año, genero, rating, libroApiId } = datos;
    const nuevaLectura = new Lectura({
        titulo,
        autor,
        año,
        genero: genero ?? null,
        rating: rating ?? null,
        libroApiId: libroApiId ?? null,
        userId
    });
    await nuevaLectura.save();
    await invalidarCacheLecturas(userId);
    return nuevaLectura;
};

// Devuelve la lectura borrada (o null si no existía), así el controller puede borrar su imagen
const deleteLectura = async (lecturaId, userId) => {
    const lecturaBorrada = await Lectura.findOneAndDelete({ _id: lecturaId, userId: userId });
    if (lecturaBorrada) {
        await invalidarCacheLecturas(userId);
    }
    return lecturaBorrada;
};

const findLecturaByLibroApiId = async (userId, libroApiId) => {
    return await Lectura.findOne({ userId, libroApiId });
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

// Si Redis no responde, se sigue con MongoDB: el cache es una mejora, no puede tirar abajo la app
const getLecturasPaginated = async (userId, page = 1, limit = 5) => {
    const redisClient = connectToRedis();
    const lecturasRedisKey = _getLecturasRedisKey(userId, page, limit);

    try {
        const cached = await redisClient.get(lecturasRedisKey);
        if (cached) {
            console.log("Informacion obtenida de Redis...");
            return cached;
        }
    } catch (error) {
        console.error("Redis no disponible, se consulta MongoDB:", error.message);
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
    try {
        await redisClient.set(lecturasRedisKey, JSON.stringify(result), { ex: 3600 });
    } catch (error) {
        console.error("No se pudo guardar en Redis:", error.message);
    }
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
    findLecturaByLibroApiId,
    createLectura,
    deleteLectura,
    updateLectura,
    getLecturasPaginated,
    getLecturasPorCategoria,
    countLecturas,
    invalidarCacheLecturas
};
