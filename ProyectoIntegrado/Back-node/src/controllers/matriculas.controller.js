import Matricula from "../models/Matricula.js";

export async function crearMatricula(req, res) {
  try {
    const nueva = await Matricula.create(req.body);
    res.status(201).json(nueva);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

export async function listarMatriculas(req, res) {
  res.json(await Matricula.find());
}

export async function obtenerMatricula(req, res) {
  const m = await Matricula.findOne({ id_matricula: Number(req.params.id) });
  if (!m) return res.status(404).json({ error: "No encontrada" });
  res.json(m);
}

export async function actualizarMatricula(req, res) {
  const m = await Matricula.findOneAndUpdate(
    { id_matricula: Number(req.params.id) },
    req.body,
    { new: true }
  );
  if (!m) return res.status(404).json({ error: "No encontrada" });
  res.json(m);
}

export async function eliminarMatricula(req, res) {
  const m = await Matricula.findOneAndDelete({
    id_matricula: Number(req.params.id)
  });
  if (!m) return res.status(404).json({ error: "No encontrada" });
  res.json({ mensaje: "Eliminado", m });
}
