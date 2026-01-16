import Curso from "../models/Curso.js";

export async function crearCurso(req, res) {
  try {
    const nuevo = await Curso.create(req.body);
    res.status(201).json(nuevo);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

export async function listarCursos(req, res) {
  res.json(await Curso.find());
}

export async function obtenerCurso(req, res) {
  const c = await Curso.findOne({ id_curso: Number(req.params.id) });
  if (!c) return res.status(404).json({ error: "No encontrado" });
  res.json(c);
}

export const actualizarCurso = async (req, res) => {
  try {
    const { id } = req.params;
    const datos = req.body;
    
    
    res.json({ mensaje: 'Curso actualizado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export async function eliminarCurso(req, res) {
  const c = await Curso.findOneAndDelete({
    id_curso: Number(req.params.id)
  });
  if (!c) return res.status(404).json({ error: "No encontrado" });
  res.json({ mensaje: "Eliminado", c });
}
