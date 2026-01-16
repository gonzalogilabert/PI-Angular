import { Router } from "express";
import { 
    guardarEncuestaCompleta, 
    listarRespuestasCabecera,
    obtenerRespuestaCabecera
} from "../controllers/respuestascabecera.controller.js";

const router = Router();

// Ruta POST para guardar todo junto
router.post("/", guardarEncuestaCompleta);

// Rutas GET
router.get("/", listarRespuestasCabecera);
router.get("/:id", obtenerRespuestaCabecera);

export default router;