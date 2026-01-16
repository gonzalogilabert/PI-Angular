import Pregunta from "../models/Pregunta.js";
import Usuario from "../models/Usuario.js";
import { limpiarId, esObjectIdValido } from "../utils/validarIds.js";

export const validarUsuarioYPregunta = async (req, res, next) => {
  try {
    // Limpiar IDs
    const userId = limpiarId(req.body.userId);
    const preguntaId = limpiarId(req.params.preguntaId);

    // Validar ObjectIds
    if (!esObjectIdValido(userId)) return res.status(400).json({ error: "ID de usuario no válido" });
    if (!esObjectIdValido(preguntaId)) return res.status(400).json({ error: "ID de pregunta no válido" });

    // Verificar existencia en BD
    const usuario = await Usuario.findById(userId);
    if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });

    const pregunta = await Pregunta.findById(preguntaId);
    if (!pregunta) return res.status(404).json({ error: "Pregunta no encontrada" });

    // Guardar en req
    req.usuario = usuario;
    req.pregunta = pregunta;

    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
