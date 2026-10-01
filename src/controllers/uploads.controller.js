const cloudinary = require("../config/cloudinary.config");
const { uploadBufferToCloudinary } = require("../utils/cloudinary.util");

const subirImagen = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No se ha proporcionado ningún archivo" });
        }
        const folder = req.body?.folder || "uploads"; // Carpeta por defecto si no se proporciona
        const result = await uploadBufferToCloudinary(cloudinary, req.file.buffer, { 
            resource_type: "image",
            folder
         });
        res.status(200).json({ url: result.secure_url });
    } catch (error) {
        console.error("Error al subir la imagen:", error);
        return res.status(500).json({ error: "Error al subir la imagen" });
    }
};

module.exports = {
    subirImagen
};