import Pregunta from "../models/Pregunta.js";

// 1. CREAR UNA PREGUNTA SUELTA (POST)
export async function crearPregunta(req, res) {
  try {
    // req.body debe tener: { "texto_pregunta": "...", "id_encuesta": "ID_DEL_PADRE" }
    const nuevaPregunta = await Pregunta.create(req.body);
    
    res.status(201).json({
      mensaje: "Pregunta añadida correctamente",
      pregunta: nuevaPregunta
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// 2. LISTAR TODAS LAS PREGUNTAS (GET)
export async function listarPreguntas(req, res) {
  try {
    console.log("🔍 Buscando preguntas con filtro:", req.query); // CHIVATO

    const filtro = req.query.id_encuesta ? { id_encuesta: req.query.id_encuesta } : {};
    
    const preguntas = await Pregunta.find(filtro);
    
    res.json(preguntas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

// 3. OBTENER UNA PREGUNTA (GET /:id)
export async function obtenerPregunta(req, res) {
  try {
    const { id } = req.params;
    // Buscamos por el _id nativo de Mongo
    const pregunta = await Pregunta.findById(id);
    
    if (!pregunta) return res.status(404).json({ error: "No encontrada" });
    
    res.json(pregunta);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// 4. ACTUALIZAR PREGUNTA (PUT /:id)
export async function actualizarPregunta(req, res) {
  try {
    const { id } = req.params;
    
    const preguntaActualizada = await Pregunta.findByIdAndUpdate(id, req.body, { new: true });
    
    if (!preguntaActualizada) return res.status(404).json({ error: "No encontrada" });
    
    res.json(preguntaActualizada);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// 5. ELIMINAR PREGUNTA (DELETE /:id)
export async function eliminarPregunta(req, res) {
  try {
    const { id } = req.params;
    
    const borrada = await Pregunta.findByIdAndDelete(id);
    
    if (!borrada) return res.status(404).json({ error: "No encontrada" });
    
    res.json({ mensaje: "Pregunta eliminada", borrada });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

  
}