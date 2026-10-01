const sendMail = require('../services/mailjet.services');
const { findLibro, createLibro, deleteLibro, updateLibro, getLibrosPaginated, countLibros } = require("../repositories/libro.repository");
const { findCategoriaByNombre } = require("../repositories/categoria.repository");

const getLibrosController = async (req, res) => {
  const { id } = req.user;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;

  try {
    const result = await getLibrosPaginated(id, page, limit);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Ha ocurrido un error: ", error: error.message });
  }
};

const getLibrosControllerById = async (req, res) => {
  const libroId = req.params.id;
  const { id } = req.user;
  try {
    const libro = await findLibro(libroId, id);
    if (libro) {
      res.status(200).json(libro);
    } else {
      res.status(404).json({ message: "Libro no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Ha ocurrido un error: ", error: error.message });
  }
};

const getLibrosPorCategoriaController = async (req, res) => {
  const { categoria } = req.params;
  const { id } = req.user;
  try {
    const categoriaExistente = await findCategoriaByNombre(categoria);
    if (!categoriaExistente) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }
    const libros = await getLibrosPorCategoria(id, categoria);
    res.status(200).json(libros);
  }
  catch (error) {
    res.status(500).json({ message: "Ha ocurrido un error: ", error: error.message });
  }
};

const postLibrosController = async (req, res) => {
  const { body, user } = req;

  try {
    if (!user.premium) {
      const librosCount = await countLibros(user.id);
      if (librosCount >= parseInt(process.env.LIMITE_LIBROS_USUARIO_PLUS)) {
        return res.status(400).json({
          message: `Alcanzaste el límite de ${process.env.LIMITE_LIBROS_USUARIO_PLUS} libros del plan plus. Cambiá a premium para seguir agregando.`
        });
      }
    }

    if (body.genero) {
      const categoria = await findCategoriaByNombre(body.genero);
      if (!categoria) {
        return res.status(400).json({
          message: "La categoría (género) no existe"
        });
      }
    }

    const nuevoLibro = await createLibro(body.titulo, body.autor, body.año, user.id, body.genero, body.rating);

    try {
      await sendMail(nuevoLibro, user.email, user.username);
    } catch (mailError) {
      console.error("No se pudo enviar el mail de notificación:", mailError.message);
    }

    res.status(201).json({
      message: "Libro creado correctamente",
      libro: nuevoLibro
    });
  } catch (error) {
    res.status(500).json({ message: "Ha ocurrido un error: ", error: error.message });
  }
};

const putLibrosController = async (req, res) => {
  const libroId = req.params.id;
  const { body } = req;
  const { id } = req.user;
  try {
    const libro = await updateLibro(libroId, id, body);
    if (libro) {
      res.status(200).json(libro);
    } else {
      res.status(404).json({ message: "Libro no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Ha ocurrido un error: ", error: error.message });
  }
};

const deleteLibrosController = async (req, res) => {
  const libroId = req.params.id;
  const { id } = req.user;

  try {
    const resultado = await deleteLibro(libroId, id);
    if (resultado.deletedCount > 0) {
      res.status(200).json({ message: "Libro eliminado correctamente" });
    } else {
      res.status(404).json({ message: "Libro no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Ha ocurrido un error: ", error: error.message });
  }
};

module.exports = {
    getLibrosController,
    getLibrosControllerById,
    postLibrosController,
    putLibrosController,
    deleteLibrosController,
    getLibrosPorCategoriaController
};