import mongoose from "mongoose";
import RespuestaCabecera from "../models/RespuestaCabecera.js";
import RespuestaDetalle from "../models/RespuestaDetalle.js";
import Pregunta from "../models/Pregunta.js";
import Usuario from "../models/Usuario.js";
import Encuesta from "../models/Encuesta.js";

// ==========================================
// ENVIAR RESPUESTA INDIVIDUAL (POST)
// ==========================================
export const enviarRespuesta = async (req, res) => {
    try {
        // 1. Obtener y limpiar IDs
        const encuestaIdRaw = req.params.encuestaId;
        const preguntaIdRaw = req.params.preguntaId;
        const userIdRaw = req.body.userId;

        if (!userIdRaw || !encuestaIdRaw || !preguntaIdRaw) {
            return res.status(400).json({ error: "Faltan IDs obligatorios (userId, encuestaId, preguntaId)" });
        }

        const userId = userIdRaw.trim();
        const encuestaId = encuestaIdRaw.trim();
        const preguntaId = preguntaIdRaw.trim();

        // 2. Validar formato de IDs
        if (!mongoose.Types.ObjectId.isValid(userId)) return res.status(400).json({ error: "ID de usuario inválido" });
        if (!mongoose.Types.ObjectId.isValid(encuestaId)) return res.status(400).json({ error: "ID de encuesta inválido" });
        if (!mongoose.Types.ObjectId.isValid(preguntaId)) return res.status(400).json({ error: "ID de pregunta inválido" });

        // 3. Buscar entidades
        const usuario = await Usuario.findById(userId);
        if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });

        const encuesta = await Encuesta.findById(encuestaId);
        if (!encuesta) return res.status(404).json({ error: "Encuesta no encontrada" });

        const pregunta = await Pregunta.findById(preguntaId);
        if (!pregunta) return res.status(404).json({ error: "Pregunta no encontrada" });

        // 4. Validar relación Encuesta-Pregunta
        // Nota: Asumimos que la Pregunta tiene un campo id_encuesta o similar.
        // El modelo Pregunta.js tiene 'id_encuesta'.
        if (pregunta.id_encuesta.toString() !== encuestaId) {
            return res.status(400).json({
                error: "Conflicto: La pregunta no pertenece a la encuesta especificada"
            });
        }

        // 5. Buscar o Crear Cabecera de Respuesta (Para agrupar respuestas de un mismo usuario en una misma encuesta)
        let cabecera = await RespuestaCabecera.findOne({
            id_usuario: usuario._id,
            id_encuesta: encuesta._id
        });

        if (!cabecera) {
            cabecera = await RespuestaCabecera.create({
                id_respuesta: Date.now(), // ID numérico simple basado en timestamp
                id_usuario: usuario._id,
                id_encuesta: encuesta._id
            });
        }

        // 6. Crear Detalle de Respuesta (La respuesta específica a la pregunta)
        // Verificamos conflicto de respuestas duplicadas para la misma pregunta si fuera necesario,
        // pero por ahora permitimos re-responder o múltiples entradas (según lógica original).
        // Si se quisiera evitar duplicados: 
        // const respuestaExistente = await RespuestaDetalle.findOne({ id_respuesta: cabecera._id, id_pregunta: pregunta._id });
        // if (respuestaExistente) ...

        const id_respuesta_detalle = Date.now(); // ID numérico simple

        const detalleData = {
            id_respuesta_detalle,
            id_respuesta: cabecera._id,
            id_pregunta: pregunta._id,
            respuesta_texto: req.body.respuesta_texto || null,
            respuesta_numero: req.body.respuesta_numero ?? null,
            opciones_seleccionadas: (req.body.opciones_seleccionadas || [])
                .filter(id => mongoose.Types.ObjectId.isValid(id))
                .map(id => new mongoose.Types.ObjectId(id))
        };

        console.log("📝 Guardando respuesta detalle:", detalleData);

        const detalle = await RespuestaDetalle.create(detalleData);

        res.status(201).json({
            mensaje: "Respuesta guardada correctamente",
            cabecera_id: cabecera._id,
            detalle
        });

    } catch (err) {
        console.error("🔴 Error al enviar respuesta:", err);
        res.status(500).json({ error: "Error interno del servidor", detalle: err.message });
    }
};

// ==========================================
// LISTAR RESPUESTAS DE UNA ENCUESTA (GET)
// ==========================================
export const listarRespuestasPorEncuesta = async (req, res) => {
    try {
        const encuestaIdRaw = req.params.encuestaId;
        const encuestaId = encuestaIdRaw.trim();

        // Validar ObjectId
        if (!mongoose.Types.ObjectId.isValid(encuestaId)) {
            return res.status(400).json({ error: "ID de encuesta no válido" });
        }

        // Buscar todas las cabeceras de respuestas de esa encuesta
        const cabeceras = await RespuestaCabecera.find({ id_encuesta: encuestaId })
            .populate("id_usuario", "nombre_completo email") // poblar usuario
            .populate("id_encuesta", "titulo descripcion") // poblar encuesta
            .lean(); // lean() devuelve objetos JS puros

        // Para cada cabecera, traer sus detalles
        const resultados = await Promise.all(
            cabeceras.map(async (cab) => {
                const detalles = await RespuestaDetalle.find({ id_respuesta: cab._id })
                    .populate("id_pregunta", "texto tipo") // poblar pregunta
                    .populate("opciones_seleccionadas", "texto") // poblar opciones si existen
                    .lean();

                return {
                    cabecera: cab,
                    detalles
                };
            })
        );

        res.json({ encuestaId, respuestas: resultados });

    } catch (err) {
        console.error("🔴 Error al listar respuestas:", err);
        res.status(500).json({ error: err.message });
    }
};
