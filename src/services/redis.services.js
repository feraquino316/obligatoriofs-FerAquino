const { Redis } = require("@upstash/redis");

const REDIS_URL = process.env.REDIS_URL;
const REDIS_TOKEN = process.env.REDIS_TOKEN;

let redisClient = null;

const connectToRedis = () => {
    if (!redisClient) {
        const connectionOptions = {
            url: REDIS_URL,
            token: REDIS_TOKEN,
        };
        redisClient = new Redis(connectionOptions);
    }
    return redisClient;
}

module.exports = connectToRedis;