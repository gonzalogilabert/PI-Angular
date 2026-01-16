import mongoose from "mongoose";

const EncuestaSchema = new mongoose.Schema({
  // Título: OBLIGATORIO
  titulo: { 
    type: String, 
    required: [true, "El título es obligatorio"] 
  },
  
  
  descripcion: { 
    type: String 
  }, 
  
  // Fecha: AUTOMÁTICA
  fecha_creacion: { 
    type: Date, 
    default: Date.now 
  },
  
  es_anonima: { 
    type: Boolean, 
    default: false 
  }
}, { 
  collection: 'encuestas',
  versionKey: false 
});

export default mongoose.model("Encuesta", EncuestaSchema);