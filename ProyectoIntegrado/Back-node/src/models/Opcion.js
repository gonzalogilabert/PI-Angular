import mongoose from "mongoose";

const OpcionSchema = new mongoose.Schema({
  id_opcion: { type: Number, unique: true, required: true },
  texto_opcion: { type: String, required: true },
  es_correcta: { type: Boolean, required: true },
  id_pregunta: { type: mongoose.Schema.Types.ObjectId, ref: "Pregunta", required: true }
}, {
  collection: 'opciones'
});

export default mongoose.model("Opcion", OpcionSchema);