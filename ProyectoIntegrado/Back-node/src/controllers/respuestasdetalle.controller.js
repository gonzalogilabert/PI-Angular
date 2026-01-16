import RespuestaDetalle from "../models/RespuestaDetalle.js";

export async function crearRespuestaDetalle(req, res) {
  try {
    const nueva = await RespuestaDetalle.create(req.body);
    res.status(201).json(nueva);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

export async function listarRespuestasDetalle(req, res) {
  res.json(await RespuestaDetalle.find());
}

export async function obtenerRespuestaDetalle(req, res) {
  const r = await RespuestaDetalle.findOne({
    id_respuesta_detalle: Number(req.params.id)
  });
  if (!r) return res.status(404).json({ error: "No encontrada" });
  res.json(r);
}

export const actualizarRespuestaDetalle = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const datos = req.body;

    const respuestaActualizada = await RespuestaDetalle.findOneAndUpdate(
      { id_respuesta_detalle: id },
      datos,
      { new: true, runValidators: true }
    );

    if (!respuestaActualizada) {
      return res.status(404).json({ mensaje: "Respuesta detalle no encontrada" });
    }
    
    res.json(respuestaActualizada);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export async function eliminarRespuestaDetalle(req, res) {
  const r = await RespuestaDetalle.findOneAndDelete({
    id_respuesta_detalle: Number(req.params.id)
  });
  if (!r) return res.status(404).json({ error: "No encontrada" });
  res.json({ mensaje: "Eliminado", r });
}
