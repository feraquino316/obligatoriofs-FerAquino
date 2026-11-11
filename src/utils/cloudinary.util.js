const { PassThrough } = require("stream");

function uploadBufferToCloudinary(cloudinaryinstance, buffer, options = {}){
    return new Promise((resolve, reject) => {
        const passThrough = new PassThrough();
        const stream = cloudinaryinstance.uploader.upload_stream(options, (error, result) => {
            if (error) {
                return reject(error);
            }
            resolve(result);
        });
        passThrough.end(buffer);
        passThrough.pipe(stream);
    });
}

// Saca el public_id de una URL de Cloudinary:
// https://res.cloudinary.com/<cloud>/image/upload/v123/lecturas/abc.jpg -> "lecturas/abc"
function getPublicIdFromUrl(url) {
    const match = url?.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-z0-9]+$/i);
    return match ? match[1] : null;
}

// Borra una imagen de Cloudinary a partir de su URL.
// Si falla no corta el flujo: solo queda una imagen huérfana en Cloudinary.
async function deleteImageFromCloudinary(cloudinaryinstance, url) {
    const publicId = getPublicIdFromUrl(url);
    if (!publicId) return;
    try {
        await cloudinaryinstance.uploader.destroy(publicId);
    } catch (error) {
        console.error("No se pudo borrar la imagen de Cloudinary:", error.message);
    }
}

module.exports = { uploadBufferToCloudinary, getPublicIdFromUrl, deleteImageFromCloudinary };
