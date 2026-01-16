import express from "express";
import {
  crearRespuestaDetalle,
  listarRespuestasDetalle,
  obtenerRespuestaDetalle,
  actualizarRespuestaDetalle,
  eliminarRespuestaDetalle
} from "../controllers/respuestasdetalle.controller.js";

const router = express.Router();

router.post("/", crearRespuestaDetalle);
router.get("/", listarRespuestasDetalle);
router.get("/:id", obtenerRespuestaDetalle);
router.put("/:id", actualizarRespuestaDetalle);
router.delete("/:id", eliminarRespuestaDetalle);

export default router; 