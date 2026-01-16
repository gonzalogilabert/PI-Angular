import express from "express";
import {
  crearMatricula,
  listarMatriculas,
  obtenerMatricula,
  actualizarMatricula,
  eliminarMatricula
} from "../controllers/matriculas.controller.js";

const router = express.Router();

router.post("/", crearMatricula);
router.get("/", listarMatriculas);
router.get("/:id", obtenerMatricula);
router.put("/:id", actualizarMatricula);
router.delete("/:id", eliminarMatricula);

export default router;