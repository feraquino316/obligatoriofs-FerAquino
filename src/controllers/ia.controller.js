const { askGeminiFlash } = require("../services/gemini.services");
const { findLectura } = require("../repositories/lectura.repository");

const generarResenaController = async (req, res) => {
    const lecturaId = req.params.id;
    const { id: userId } = req.user;

    try {
        const lectura = await findLectura(lecturaId, userId);
        if (!lectura) {
            return res.status(404).json({ message: "Lectura no encontrada" });
        }

        const prompt = `Escribí una reseña breve (máximo 3 oraciones, en español) para el libro "${lectura.titulo}" de ${lectura.autor}, género ${lectura.genero || "no especificado"}.`;

        try {
            const data = await askGeminiFlash(prompt);
            const parts = data.candidates?.[0]?.content?.parts || [];
            const resena = parts.find((p) => p.text)?.text || null;

            res.status(200).json({
                lectura: lectura.titulo,
                resena: resena || "No se pudo generar la reseña en este momento."
            });
        } catch (iaError) {
            console.error("Gemini no disponible:", iaError.message);
            res.status(200).json({
                lectura: lectura.titulo,
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