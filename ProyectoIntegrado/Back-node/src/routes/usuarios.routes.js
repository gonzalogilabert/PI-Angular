import express from "express";
import {
  crearUsuario,
  listarUsuarios,
  obtenerUsuario,
  actualizarUsuario,
  eliminarUsuario
} from "../controllers/usuarios.controller.js";

const router = express.Router();

//   RUTAS CRUD DE USUARIOS

// Crear usuario
router.post("/", crearUsuario);

// Listar todos los usuarios
router.get("/", listarUsuarios);

// Obtener un usuario por ID
router.get("/:id", obtenerUsuario);

// Actualizar un usuario por ID
router.put("/:id", actualizarUsuario);

// Eliminar un usuario por ID
router.delete("/:id", eliminarUsuario);

export default router;
