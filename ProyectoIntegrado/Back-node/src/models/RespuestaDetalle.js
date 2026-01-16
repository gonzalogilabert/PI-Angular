import mongoose from "mongoose";

const RespuestaDetalleSchema = new mongoose.Schema({
id_respuesta_detalle: { type: Number, required: true },

  id_respuesta: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "RespuestaCabecera", 
    required: true 
  },

  id_pregunta: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Pregunta", 
    required: true 
  },

  // Para preguntas de opción (unica o múltiple)
  opciones_seleccionadas: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Opcion"
  }],

  // Para preguntas de texto
  respuesta_texto: { type: String },

  // Para preguntas numéricas
  respuesta_numero: { type: Number }
});

export default mongoose.model(
  "RespuestaDetalle",
  RespuestaDetalleSchema,
  "respuestasdetalle"  
);