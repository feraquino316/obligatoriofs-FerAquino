const { askGeminiFlash } = require("../services/gemini.services");
const { findLibro } = require("../repositories/libro.repository");

const generarResenaController = async (req, res) => {
    const libroId = req.params.id;
    const { id: userId } = req.user;

    try {
        const libro = await findLibro(libroId, userId);
        if (!libro) {
            return res.status(404).json({ message: "Libro no encontrado" });
        }

        const prompt = `Escribí una reseña breve (máximo 3 oraciones, en español) para el libro "${libro.titulo}" de ${libro.autor}, género ${libro.genero || "no especificado"}.`;

        try {
            const data = await askGeminiFlash(prompt);
            const parts = data.candidates?.[0]?.content?.parts || [];
            const resena = parts.find((p) => p.text)?.text || null;

            res.status(200).json({
                libro: libro.titulo,
                resena: resena || "No se pudo generar la reseña en este momento."
            });
        } catch (iaError) {
            console.error("Gemini no disponible:", iaError.message);
            res.status(200).json({
                libro: libro.titulo,
                resena: "El servicio de IA no está disponible en este momento."
            });
        }
    } catch (error) {
        res.status(500).json({ message: "Ha ocurrido un error", error: error.message });
    }
};

module.exports = {
    generarResenaController
};