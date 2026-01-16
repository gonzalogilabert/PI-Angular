import express from "express";
import {
  crearOpcion,
  listarOpciones,
  obtenerOpcion,
  actualizarOpcion,
  eliminarOpcion
} from "../controllers/opciones.controller.js";

const router = express.Router();

router.post("/", crearOpcion);
router.get("/", listarOpciones);
router.get("/:id", obtenerOpcion);
router.put("/:id", actualizarOpcion);
router.delete("/:id", eliminarOpcion);

export default router;
