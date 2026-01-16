import Opcion from "../models/Opcion.js";

export async function crearOpcion(req, res) {
  try {
    const nueva = await Opcion.create(req.body);
    res.status(201).json(nueva);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

export async function listarOpciones(req, res) {
  try {
    const opciones = await Opcion.find();
    res.json(opciones);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export async function obtenerOpcion(req, res) {
  try {
    const opcion = await Opcion.findOne({ id_opcion: Number(req.params.id) });
    if (!opcion) return res.status(404).json({ error: "No encontrada" });
    res.json(opcion);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export async function actualizarOpcion(req, res) {
  try {
    const opcion = await Opcion.findOneAndUpdate(
      { id_opcion: Number(req.params.id) },
      req.body,
      { new: true }
    );
    if (!opcion) return res.status(404).json({ error: "No encontrada" });
    res.json(opcion);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

export async function eliminarOpcion(req, res) {
  try {
    const opcion = await Opcion.findOneAndDelete({
      id_opcion: Number(req.params.id)
    });

    if (!opcion) return res.status(404).json({ error: "No encontrada" });

    res.json({ mensaje: "Opción eliminada", opcion });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
