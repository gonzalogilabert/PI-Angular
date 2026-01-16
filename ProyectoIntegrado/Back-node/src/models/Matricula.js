import mongoose from "mongoose";

const MatriculaSchema = new mongoose.Schema({
  id_matricula: { type: Number, unique: true, required: true },
  id_usuario: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true },
  id_curso: { type: mongoose.Schema.Types.ObjectId, ref: "Curso", required: true }
});

export default mongoose.model("Matricula", MatriculaSchema);
