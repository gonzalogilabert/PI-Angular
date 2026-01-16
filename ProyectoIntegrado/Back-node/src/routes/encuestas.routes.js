import express from "express";
import {
  crearEncuesta,
  listarEncuestas,
  obtenerEncuesta,
  actualizarEncuesta,
  eliminarEncuesta
} from "../controllers/encuestas.controller.js";

const router = express.Router();

router.post("/", crearEncuesta);      
router.get("/", listarEncuestas);     
router.get("/:id", obtenerEncuesta);  
router.put("/:id", actualizarEncuesta); 
router.delete("/:id", eliminarEncuesta); 

export default router;
