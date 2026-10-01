require ('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();

const loggerMiddleware = require('./middlewares/logger.middleware');
const authMiddleware = require('./middlewares/auth.middleware');
const dbMiddleware = require('./middlewares/db.middleware');

const router = require('./routes/private.router');
const publicRouter = require('./routes/public.router');
const authRouter = require('./routes/auth.router');
const uploadsRouter = require('./routes/uploads.router');
const iaRouter = require('./routes/ia.router');
const { generalLimiter } = require("./middlewares/rateLimit.middleware");

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use(loggerMiddleware);

app.use(generalLimiter);

app.use('/public', publicRouter);

app.use(dbMiddleware);

app.use('/v1/auth', authRouter);

app.use(authMiddleware);

//privado
app.use('/v1', router);

app.use('/v1/uploads', uploadsRouter);

app.use('/v1/ia', iaRouter);

app.use((err, req, res, next) => {
    console.error("Error en el servidor:", err);
    res.status(err.status || 500).json({ message: 'Ocurrió un error en el servidor' });
});

module.exports = app;

if (require.main === module) {
    app.listen(process.env.PORT, () => {
        console.log(`Servidor escuchando en el puerto ${process.env.PORT}`);
    });
}