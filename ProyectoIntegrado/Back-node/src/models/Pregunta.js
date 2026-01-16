import mongoose from "mongoose";

const PreguntaSchema = new mongoose.Schema({
  // Texto: OBLIGATORIO
  texto_pregunta: { 
    type: String, 
    required: [true, "La pregunta no puede estar vacía"] 
  },
  
  tipo: { 
    type: String, 
    default: 'texto' 
  },
  
  // Relación: OBLIGATORIA (ObjectId)
  id_encuesta: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Encuesta", 
    required: true 
  }
}, { 
  collection: 'preguntas',
  versionKey: false
});

export default mongoose.model("Pregunta", PreguntaSchema);