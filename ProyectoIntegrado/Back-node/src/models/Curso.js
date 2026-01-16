import mongoose from "mongoose";

const CursoSchema = new mongoose.Schema({
  id_curso: { type: Number, unique: true, required: true },
  nombre_curso: { type: String, required: true },
  descripción: { type: String },
  anio: { type: Number, required: true }
});

export default mongoose.model("Curso", CursoSchema);
