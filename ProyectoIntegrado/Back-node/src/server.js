// 1. CARGA DE VARIABLES DE ENTORNO
import "dotenv/config";

// 2. IMPORTS LIBRERÍAS
import express from "express";
import cors from "cors";
// import mongoose from "mongoose"; // <-- YA NO LO NECESITAS AQUÍ, LO USAS EN DB.JS

// 3. IMPORTAR LA CONEXIÓN (AQUÍ ESTÁ LA CLAVE)
import { connectDB } from "./db.js";


// IMPORTS RUTAS
import usuariosRoutes from "./routes/usuarios.routes.js";
import testRoutes from "./routes/test.routes.js";
import asignacionesRoutes from "./routes/asignaciones.routes.js";
import cursosRoutes from "./routes/cursos.routes.js";
import matriculasRoutes from "./routes/matriculas.routes.js";
import encuestasRoutes from "./routes/encuestas.routes.js";
import opcionesRoutes from "./routes/opciones.routes.js";
import preguntasRoutes from "./routes/preguntas.routes.js";
import respuestascabeceraRoutes from "./routes/respuestascabecera.routes.js";
import respuestasdetalleRoutes from "./routes/respuestasdetalle.routes.js";
import respuestasRoutes from "./routes/respuestas.routes.js";



// 4. CONFIGURACIÓN APP
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 5. RUTAS API
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/test", testRoutes);
app.use("/api/asignaciones", asignacionesRoutes);
app.use("/api/cursos", cursosRoutes);
app.use("/api/matriculas", matriculasRoutes);
app.use("/api/encuestas", encuestasRoutes);
app.use("/api/opciones", opcionesRoutes);
app.use("/api/preguntas", preguntasRoutes);
app.use("/api/cabecera", respuestascabeceraRoutes);
app.use("/api/detalle", respuestasdetalleRoutes);
app.use("/api/respuestas", respuestasRoutes);



// RUTA HOME 
app.get("/", (req, res) => {
  res.json({ mensaje: "API funcionando correctamente" });
});

// 6. MANEJO DE 404
app.use((req, res) => {
  res.status(404).json({
    error: "Ruta no encontrada",
    mensaje: `La ruta ${req.method} ${req.url} no existe en este servidor`
  });
});

// 7. ERROR GLOBAL
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

// 8. CONEXIÓN BASE DE DATOS Y ARRANQUE SERVIDOR
console.log("Iniciando conexión...");

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(` Servidor corriendo en http://localhost:${PORT}`);
  });
});