import { Router } from 'express';
import { 
    crearPregunta, 
    listarPreguntas, 
    obtenerPregunta, 
    actualizarPregunta, 
    eliminarPregunta 
} from '../controllers/preguntas.controller.js';

const router = Router();

router.get('/', listarPreguntas);
router.post('/', crearPregunta);
router.get('/:id', obtenerPregunta);
router.put('/:id', actualizarPregunta); 
router.delete('/:id', eliminarPregunta);

export default router;