import Usuario from "../models/Usuario.js";

export async function crearUsuario(req, res) {
  try {
    console.log("📥 Recibido:", req.body);

    // Buscar un usuario que tenga id_usuario válido
    const ultimo = await Usuario.findOne({ id_usuario: { $exists: true, $ne: null } })
      .sort({ id_usuario: -1 });

    let nuevoId = 1;

    if (ultimo && typeof ultimo.id_usuario === "number") {
      nuevoId = ultimo.id_usuario + 1;
    }

    console.log("🆕 Generado id_usuario:", nuevoId);

    const nuevo = await Usuario.create({
      id_usuario: nuevoId,
      nombre_completo: req.body.nombre_completo,
      email: req.body.email,
      rol: req.body.rol,
      fecha_registro: new Date()
    });

    res.status(201).json(nuevo);

  } catch (e) {
    console.log(" ERROR:", e.message);
    res.status(400).json({ error: e.message });
  }
}

export async function listarUsuarios(req, res) {
  res.json(await Usuario.find());
}

export async function obtenerUsuario(req, res) {
  const u = await Usuario.findOne({ id_usuario: Number(req.params.id) });
  if (!u) return res.status(404).json({ error: "No encontrado" });
  res.json(u);
}

export async function actualizarUsuario(req, res) {
  try {
    //  Corregir si viene como array
    const data = Array.isArray(req.body) ? req.body[0] : req.body;

    //  Evitar actualizar _id
    delete data._id;

    const usuarioActualizado = await Usuario.findOneAndUpdate(
      { id_usuario: Number(req.params.id) },
      data,
      { new: true, runValidators: true }
    );

    if (!usuarioActualizado) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    res.json(usuarioActualizado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function eliminarUsuario(req, res) {
  const u = await Usuario.findOneAndDelete({
    id_usuario: Number(req.params.id)
  });
  if (!u) return res.status(404).json({ error: "No encontrado" });
  res.json({ mensaje: "Eliminado", u });
}
