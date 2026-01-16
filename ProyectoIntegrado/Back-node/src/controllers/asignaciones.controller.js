import AsignacionEncuesta from "../models/AsignacionEncuesta.js";

export async function crearAsignacion(req, res) {
  try {
    const nueva = await AsignacionEncuesta.create(req.body);
    res.status(201).json(nueva);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function listarAsignaciones(req, res) {
  try {
    const items = await AsignacionEncuesta.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function obtenerAsignacion(req, res) {
  try {
    const item = await AsignacionEncuesta.findOne({ id_asignacion: Number(req.params.id) });
    if (!item) return res.status(404).json({ error: "No encontrada" });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function actualizarAsignacion(req, res) {
  try {
    const item = await AsignacionEncuesta.findOneAndUpdate(
      { id_asignacion: Number(req.params.id) },
      req.body,
      { new: true }
    );

    if (!item) return res.status(404).json({ error: "No encontrada" });

    res.json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function eliminarAsignacion(req, res) {
  try {
    const borrada = await AsignacionEncuesta.findOneAndDelete({ id_asignacion: Number(req.params.id) });
    if (!borrada) return res.status(404).json({ error: "No encontrada" });
    res.json({ mensaje: "Asignación eliminada", borrada });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
