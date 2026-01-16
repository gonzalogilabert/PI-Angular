import mongoose from "mongoose";

const AsignacionEncuestaSchema = new mongoose.Schema({

  id_asignacion: { type: Number, unique: true, required: true },

  // A qué encuesta corresponde
  id_encuesta: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Encuesta", 
    required: true 
  },

  // QUIÉN recibe la encuesta (usuario directo)
  id_usuario: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Usuario",
    required: false
  },

  // O a qué curso se asigna (todos los matriculados)
  id_curso: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Curso",
    required: false
  },

  // Estados de asignación
  fecha_asignacion: { type: Date, default: Date.now },
  fecha_limite: { type: Date },

  estado: { 
    type: String, 
    enum: ["pendiente", "respondida", "expirada"], 
    default: "pendiente" 
  }
});

export default mongoose.model("AsignacionEncuesta", AsignacionEncuestaSchema);
