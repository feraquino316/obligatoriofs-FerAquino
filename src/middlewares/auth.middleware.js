const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    // Acepta tanto "Bearer <token>" como el token solo
    const token = req.headers['authorization']?.replace(/^Bearer\s+/i, '');

    if (!token) {
        return res.status(401).json({ 
            message: 'Unauthorized - invalid token provided',
        });
    }
    try {
        const verified = jwt.verify(token, process.env.AUTH_SECRET_KEY);
        req.user = verified;
        next();
    }
    catch (error){
        res.status(403).json({message: 'Token invalido'});
    }
};

module.exports = authMiddleware;