import mongoose from "mongoose";

const RespuestaCabeceraSchema = new mongoose.Schema({
  // Antes: id_respuesta: { type: Number, unique: true, required: true }
  id_respuesta: { 
    type: Number, 
    required: true 
  },

  // Asegúrate de que los tipos coincidan con lo que envías (ObjectId vs String)
  id_usuario: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Usuario', // O el nombre de tu modelo de usuarios
    required: true 
  },
  
  id_encuesta: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Encuesta', // O el nombre de tu modelo de encuestas
    required: true 
  },

  fecha_envio: { 
    type: Date, 
    default: Date.now,
    required: true
  }
}, {
  timestamps: true, // Esto añade createdAt y updatedAt automáticamente
  versionKey: false
});

export default mongoose.model(
  "RespuestaCabecera",
  RespuestaCabeceraSchema,
  "respuestacabeceras" 
);