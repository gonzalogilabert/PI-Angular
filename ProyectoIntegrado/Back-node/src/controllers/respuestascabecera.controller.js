import RespuestaCabecera from "../models/RespuestaCabecera.js";
import RespuestaDetalle from "../models/RespuestaDetalle.js";
import Encuesta from "../models/Encuesta.js"; // <--- IMPORTANTE: Necesario para la validación

// ==========================================
// 1. CREAR (POST) - Con validación de Encuesta
// ==========================================
export const guardarEncuestaCompleta = async (req, res) => {
  try {
    const { cabecera, detalles } = req.body;

    // 1. Validar que lleguen datos básicos
    if (!cabecera || !detalles) {
      return res.status(400).json({ error: "Faltan datos obligatorios (cabecera o detalles)" });
    }

    // 2. VALIDACIÓN: ¿Existe la encuesta asociada?
    // Buscamos si existe una encuesta con el ID que nos envían en la cabecera
    const existeEncuesta = await Encuesta.findById(cabecera.id_encuesta);

    if (!existeEncuesta) {
      return res.status(404).json({ 
        error: "No se puede guardar la respuesta. La encuesta especificada no existe.",
        id_enviado: cabecera.id_encuesta
      });
    }

    // 3. Guardar la Cabecera
    const nuevaCabecera = new RespuestaCabecera(cabecera);
    const cabeceraGuardada = await nuevaCabecera.save();
    
    console.log("✅ Cabecera creada con ID:", cabeceraGuardada._id);

    // 4. Preparar los detalles (Asignarles el ID de la cabecera padre)
    const detallesFormateados = detalles.map((detalle) => ({
      ...detalle,
      id_respuesta: cabeceraGuardada._id, // Vinculamos con el padre
      id_pregunta: detalle.id_pregunta    // Mantenemos la pregunta
    }));

    // 5. Guardar todos los detalles de golpe
    const detallesGuardados = await RespuestaDetalle.insertMany(detallesFormateados);

    // 6. Responder éxito
    res.status(201).json({
      mensaje: "Encuesta guardada y validada correctamente",
      cabecera: cabeceraGuardada,
      detalles: detallesGuardados
    });

  } catch (error) {
    console.error("🔴 Error al guardar:", error);
    res.status(500).json({ 
      error: "Error interno al guardar la encuesta", 
      detalle: error.message,
      mongoError: error.code === 11000 ? "Error de duplicado: Ya existe un ID con ese número." : null
    });
  }
};

// ==========================================
// 2. LISTAR TODAS (GET)
// ==========================================
export const listarRespuestasCabecera = async (req, res) => {
  try {
    const respuestas = await RespuestaCabecera.find();
    res.json(respuestas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ==========================================
// 3. OBTENER UNA POR ID (GET /:id)
// ==========================================
export const obtenerRespuestaCabecera = async (req, res) => {
  try {
    const { id } = req.params;
    const respuesta = await RespuestaCabecera.findById(id);
    
    if (!respuesta) {
      return res.status(404).json({ message: "Respuesta no encontrada" });
    }
    
    res.json(respuesta);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ==========================================
// 4. ELIMINAR (DELETE /:id)
// ==========================================
export const eliminarRespuestaCabecera = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Opcional: Podrías borrar también los detalles asociados aquí
        const respuestaEliminada = await RespuestaCabecera.findByIdAndDelete(id);
        
        if (!respuestaEliminada) {
            return res.status(404).json({ message: "No encontrada para eliminar" });
        }
        
        // Borramos también los detalles hijos para no dejar basura (Opcional)
        await RespuestaDetalle.deleteMany({ id_respuesta: id });

        res.json({ message: "Cabecera y sus detalles eliminados correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};