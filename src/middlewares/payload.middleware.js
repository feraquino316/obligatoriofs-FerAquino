const payloadMiddleware = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
        return res.status(400).json({
            error: "Error de validación",
            message: error.details.map((e) => e.message),
        })
    }    
    next();
    }
};

module.exports = payloadMiddleware;