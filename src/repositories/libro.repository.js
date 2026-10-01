const Libro = require("../models/libro.model");
const connectToRedis = require("../services/redis.services");

const _getLibrosRedisKey = (userId, page, limit, filtros) =>
    `userId:${userId}-libros:page:${page}:limit:${limit}:filtros:${JSON.stringify(filtros)}`;

const getLibros = async (userId) => {
    return await Libro.find({ userId });
};

const findLibro = async (libroId, userId) => {
    return await Libro.findOne({
        _id: libroId,
        userId: userId
    });
};
const createLibro = async (titulo, autor, año, userId, genero, rating) => {
    const newLibro = new Libro({
        titulo,
        autor,
        año,
        genero: genero ?? null,
        rating: rating ?? null,
        userId
    });
    await newLibro.save();
    return newLibro;
};

const deleteLibro = async (libroId, userId) => {
    return await Libro.deleteOne({ _id: libroId, userId: userId });
};

const updateLibro = async (libroId, userId, payload) => {
    const libro = await Libro.findOne({
        _id: libroId,
        userId: userId
    });

    if (libro) {
        Object.entries(payload).forEach(([key, value]) => {
            libro[key] = value;
        });
        await libro.save();
    }
    return libro;
};

const getLibrosPaginated = async (userId, page = 1, limit = 5) => {
    const redisClient = connectToRedis();
    const librosRedisKey = _getLibrosRedisKey(userId, page, limit);

    const cached = await redisClient.get(librosRedisKey);
    if (cached) {
        console.log("Informacion obtenida de Redis...");
        return cached; 
    }
    console.log("Buscando informacion en MongoDB...");
    const skip = (page - 1) * limit;

    const [libros, total] = await Promise.all([
        Libro.find({ userId }).skip(skip).limit(limit),
        Libro.countDocuments({ userId })
    ]);
    const result = {
        data: libros,
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
    };
    await redisClient.set(librosRedisKey, JSON.stringify(result), { ex: 3600 });
    return result;
};

const countLibros = async (userId) => {
    return await Libro.countDocuments({ userId });
}

module.exports = {
    getLibros,
    findLibro,
    createLibro,
    deleteLibro,
    updateLibro,
    getLibrosPaginated,
    countLibros
};