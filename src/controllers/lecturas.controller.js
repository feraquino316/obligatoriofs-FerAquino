const sendMail = require('../services/mailjet.services');
const cloudinary = require("../config/cloudinary.config");
const { uploadBufferToCloudinary } = require("../utils/cloudinary.util");
const {
  findLectura,
  createLectura,
  deleteLectura,
  updateLectura,
  getLecturasPaginated,
  countLecturas,
  getLecturasPorCategoria
} = require("../repositories/lectura.repository");
const { findCategoriaByNombre } = require("../repositories/categoria.repository");

const getLecturasController = async (req, res) => {
  const { id } = req.user;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;

  try {
    const result = await getLecturasPaginated(id, page, limit);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Ha ocurrido un error", error: error.message });
  }
};

const getLecturaByIdController = async (req, res) => {
  const lecturaId = req.params.id;
  const { id } = req.user;
  try {
    const lectura = await findLectura(lecturaId, id);
    if (lectura) {
      res.status(200).json(lectura);
    } else {
      res.status(404).json({ message: "Lectura no encontrada" });
    }
  } catch (error) {
    res.status(500).json({ message: "Ha ocurrido un error", error: error.message });
  }
};

const getLecturasPorCategoriaController = async (req, res) => {
  const { categoria } = req.params;
  const { id } = req.user;
  try {
    const categoriaExistente = await findCategoriaByNombre(categoria);
    if (!categoriaExistente) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }
    const lecturas = await getLecturasPorCategoria(id, categoria);
    res.status(200).json(lecturas);
  }
  catch (error) {
    res.status(500).json({ message: "Ha ocurrido un error", error: error.message });
  }
};

const postLecturaController = async (req, res) => {
  const { body, user } = req;
  const limite = parseInt(process.env.LIMITE_LECTURAS_USUARIO_PLUS);

  try {
    if (!user.premium) {
      const lecturasCount = await countLecturas(user.id);
      if (lecturasCount >= limite) {
        return res.status(400).json({
          message: `Alcanzaste el límite de ${limite} lecturas del plan plus. Cambiá a premium para seguir agregando.`
        });
      }
    }

    if (body.genero) {
      const categoria = await findCategoriaByNombre(body.genero);
      if (!categoria) {
        return res.status(400).json({ message: "La categoría (género) no existe" });
      }
    }

    const nuevaLectura = await createLectura(user.id, body);

    try {
      await sendMail(nuevaLectura, user.email, user.username);
    } catch (mailError) {
      console.error("No se pudo enviar el mail de notificación:", mailError.message);
    }

    res.status(201).json({
      message: "Lectura creada correctamente",
      lectura: nuevaLectura
    });
  } catch (error) {
    res.status(500).json({ message: "Ha ocurrido un error", error: error.message });
  }
};

const putLecturaController = async (req, res) => {
  const lecturaId = req.params.id;
  const { body } = req;
  const { id } = req.user;
  try {
    if (body.genero) {
      const categoria = await findCategoriaByNombre(body.genero);
      if (!categoria) {
        return res.status(400).json({ message: "La categoría (género) no existe" });
      }
    }

    const lectura = await updateLectura(lecturaId, id, body);
    if (lectura) {
      res.status(200).json(lectura);
    } else {
      res.status(404).json({ message: "Lectura no encontrada" });
    }
  } catch (error) {
    res.status(500).json({ message: "Ha ocurrido un error", error: error.message });
  }
};

// Sube la imagen a Cloudinary y la guarda en el campo imagenLibro de la lectura.
// Se envía como multipart/form-data con el campo "imagen".
const putImagenLecturaController = async (req, res) => {
  const lecturaId = req.params.id;
  const { id } = req.user;

  if (!req.file) {
    return res.status(400).json({ message: "No se ha proporcionado ningún archivo" });
  }

  try {
    const lectura = await findLectura(lecturaId, id);
    if (!lectura) {
      return res.status(404).json({ message: "Lectura no encontrada" });
    }

    const result = await uploadBufferToCloudinary(cloudinary, req.file.buffer, {
      resource_type: "image",
      folder: "lecturas"
    });

    const lecturaActualizada = await updateLectura(lecturaId, id, { imagenLibro: result.secure_url });
    res.status(200).json({
      message: "Imagen asignada correctamente",
      lectura: lecturaActualizada
    });
  } catch (error) {
    console.error("Error al subir la imagen de la lectura:", error);
    res.status(500).json({ message: "Error al subir la imagen", error: error.message });
  }
};

const deleteLecturaController = async (req, res) => {
  const lecturaId = req.params.id;
  const { id } = req.user;

  try {
    const resultado = await deleteLectura(lecturaId, id);
    if (resultado.deletedCount > 0) {
      res.status(200).json({ message: "Lectura eliminada correctamente" });
    } else {
      res.status(404).json({ message: "Lectura no encontrada" });
    }
  } catch (error) {
    res.status(500).json({ message: "Ha ocurrido un error", error: error.message });
  }
};

module.exports = {
  getLecturasController,
  getLecturaByIdController,
  postLecturaController,
  putLecturaController,
  putImagenLecturaController,
  deleteLecturaController,
  getLecturasPorCategoriaController
};
