import mongoose from "mongoose";
import Pregunta from "../models/Pregunta.js";

export async function validarPregunta(req, res, next) {
  try {
    let { encuestaId, preguntaId } = req.params;

    // Limpiar posibles espacios o saltos de línea
    encuestaId = encuestaId.trim();
    preguntaId = preguntaId.trim();

    //  Validar que sean ObjectId válidos
    if (!mongoose.Types.ObjectId.isValid(encuestaId)) {
      return res.status(400).json({ error: "ID de encuesta no válido" });
    }
    if (!mongoose.Types.ObjectId.isValid(preguntaId)) {
      return res.status(400).json({ error: "ID de pregunta no válido" });
    }

    //  Buscar la pregunta
    const pregunta = await Pregunta.findById(preguntaId);
    if (!pregunta) return res.status(404).json({ error: "Pregunta no encontrada" });

    // Validar que la pregunta pertenece a la encuesta
    if (pregunta.id_encuesta.toString() !== encuestaId) {
      return res.status(400).json({ error: "Pregunta no pertenece a esta encuesta" });
    }

    //  Guardar información útil en req
    req.tipoPregunta = pregunta.tipo; // 'texto', 'numero', 'opcion'
    req.pregunta = pregunta;

    next(); // todo correcto, pasa al siguiente middleware/route handler

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
