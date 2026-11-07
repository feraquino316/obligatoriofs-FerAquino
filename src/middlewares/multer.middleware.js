const multer = require('multer');

const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith("image/")) {
            const error = new Error("Solo se permiten archivos de imagen");
            error.status = 400;
            return cb(error);
        }
        cb(null, true);
    }
});

module.exports = { upload };
