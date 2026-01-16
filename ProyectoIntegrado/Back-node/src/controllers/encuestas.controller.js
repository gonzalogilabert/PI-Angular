import Encuesta from "../models/Encuesta.js";
import Pregunta from "../models/Pregunta.js";

// 1. CREAR ENCUESTA (POST)
export async function crearEncuesta(req, res) {
  try {
    const { preguntas, ...datosEncuesta } = req.body;

    console.log(" Creando encuesta:", datosEncuesta.titulo);

    // Guardar Encuesta
    const nuevaEncuesta = await Encuesta.create(datosEncuesta);

    // Guardar Preguntas (si las hay)
    if (preguntas && preguntas.length > 0) {
      const preguntasConId = preguntas.map(pregunta => ({
        texto_pregunta: pregunta.texto_pregunta, 
        tipo: 'texto', 
        id_encuesta: nuevaEncuesta._id 
      }));

      await Pregunta.insertMany(preguntasConId);
    }

    res.status(201).json({
      mensaje: "Encuesta guardada correctamente",
      encuesta: nuevaEncuesta
    });

  } catch (error) {
    console.error(" Error:", error.message);
    res.status(400).json({ error: error.message });
  }
}

// 2. LISTAR ENCUESTAS (GET)
export async function listarEncuestas(req, res) {
  try {
    const encuestas = await Encuesta.find().sort({ fecha_creacion: -1 });
    res.json(encuestas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// 3. OBTENER UNA ENCUESTA (GET /:id)
export async function obtenerEncuesta(req, res) {
  try {
    const { id } = req.params;
    const encuesta = await Encuesta.findById(id);

    if (!encuesta) return res.status(404).json({ error: "No encontrada" });

    res.json(encuesta);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// 4. ACTUALIZAR ENCUESTA (PUT /:id) 
export async function actualizarEncuesta(req, res) {
  try {
    const { id } = req.params;
    
    const encuestaActualizada = await Encuesta.findByIdAndUpdate(id, req.body, { new: true });

    if (!encuestaActualizada) return res.status(404).json({ error: "No encontrada" });

    res.json(encuestaActualizada);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// 5. ELIMINAR ENCUESTA (DELETE /:id)
    export async function eliminarEncuesta(req, res) {
  try {
    const { id } = req.params;
    
    const borrada = await Encuesta.findByIdAndDelete(id);
    
    if (!borrada) return res.status(404).json({ error: "No encontrada" });

    // Limpiamos también las preguntas
    await Pregunta.deleteMany({ id_encuesta: id });

    res.json({ mensaje: "Encuesta y sus preguntas eliminadas" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}