import express from "express";
import {
  crearCurso,
  listarCursos,
  obtenerCurso,
  actualizarCurso,
  eliminarCurso
} from "../controllers/cursos.controller.js";

const router = express.Router();

router.post("/", crearCurso);
router.get("/", listarCursos);
router.get("/:id", obtenerCurso);
router.put("/:id", actualizarCurso);
router.delete("/:id", eliminarCurso);

export default router;
