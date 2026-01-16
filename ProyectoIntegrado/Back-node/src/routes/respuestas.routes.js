import express from "express";
import {
  enviarRespuesta,
  listarRespuestasPorEncuesta
} from "../controllers/respuestas.controller.js";

const router = express.Router();

// POST: enviar respuesta a una pregunta
// URL: /api/respuestas/:encuestaId/pregunta/:preguntaId
router.post("/:encuestaId/pregunta/:preguntaId", enviarRespuesta);

// GET: obtener respuestas de una encuesta
// URL: /api/respuestas/encuesta/:encuestaId
router.get("/encuesta/:encuestaId", listarRespuestasPorEncuesta);

export default router;
