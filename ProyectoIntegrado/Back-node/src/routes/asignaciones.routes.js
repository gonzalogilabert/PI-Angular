import express from "express";
import {
  crearAsignacion,
  listarAsignaciones,
  obtenerAsignacion,
  actualizarAsignacion,
  eliminarAsignacion
} from "../controllers/asignaciones.controller.js";

const router = express.Router();

router.post("/", crearAsignacion);
router.get("/", listarAsignaciones);
router.get("/:id", obtenerAsignacion);
router.put("/:id", actualizarAsignacion);
router.delete("/:id", eliminarAsignacion);

export default router;
