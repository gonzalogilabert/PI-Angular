**Overview**
- **Project type:** Small Express + Mongoose API (ES modules). See `package.json` (`type: "module"`).
- **Main entry:** `src/server.js` — mounts routes and starts the server.

**How the app is structured**
- **Routes:** `src/routes/*.js` (e.g. `encuestas.routes.js`, `usuarios.routes.js`). Routes import controller functions and export an Express `router`.
- **Controllers:** `src/controllers/*.js` (present: `encuestas.controller.js`). Controller functions implement HTTP handlers (CRUD) and return JSON responses.
- **Models:** `src/models/*.js` — Mongoose schemas and models. Example: `src/models/Encuesta.js` defines `id_encuesta` (Number) and `id_creador` (ObjectId ref `Usuario`).
- **DB:** `src/db.js` holds the Mongoose connection. Note: `dotenv` is installed but currently unused; the connection string is hardcoded in `src/db.js`.

**Key patterns & conventions**
- Uses ES module imports/exports (e.g. `import express from 'express'`). Keep this style when adding files.
- Controllers follow CRUD naming: `crearX`, `listarX`, `obtenerX`, `actualizarX`, `eliminarX`. Use the same signatures: `async function(req, res)` and JSON responses.
- Many models use numeric domain IDs (e.g. `id_encuesta: Number`) for lookups instead of Mongo `_id`. Controller queries use `findOne({ id_encuesta: Number(req.params.id) })` — be consistent when adding endpoints.
- When updating, controllers use `findOneAndUpdate(..., { new: true })` to return the updated document.
- Routes register RESTful endpoints: POST `/`, GET `/`, GET `/:id`, PUT `/:id`, DELETE `/:id`.

**Commands / developer workflow**
- Start dev server: `npm run dev` (uses `nodemon src/server.js`).
- Start production: `npm start` (runs `node src/server.js`).
- No tests are present. Use `nodemon` + console logs or attach a debugger to `src/server.js` to step through requests.

**Important implementation notes discovered in repo**
- `src/db.js` contains a hardcoded MongoDB connection string. Treat credentials as secrets — do not accidentally commit alternative credentials when editing.
- `dotenv` is present in `package.json` but not used. If you add environment variables, update `src/db.js` to use `process.env.MONGODB_URI` and add `import 'dotenv/config'` or `import dotenv from 'dotenv'; dotenv.config();` in `src/server.js` or `src/db.js`.
- `src/controllers/usuarios.controller.js` is referenced by `src/routes/usuarios.routes.js` but is missing from the repository. If you implement user controllers, follow the established controller pattern and add the file under `src/controllers`.
- `src/server.js` currently mounts: `app.use("/api/encuestas", encuestasRoutes);`. If you add `usuarios.routes.js`, mount it similarly (e.g. `app.use('/api/usuarios', usuariosRoutes);`).

**Security & secrets**
- Do not leave credentials in plaintext when preparing commits. Prefer `.env` and `process.env` (see note above). If you must modify `src/db.js` locally for testing, ensure the repository does not receive those changes with secrets.

**Examples (copy-paste patterns)**
- Register a new route module in `src/server.js`:
  - `import usuariosRoutes from './routes/usuarios.routes.js';`
  - `app.use('/api/usuarios', usuariosRoutes);`
- Controller lookup by numeric domain id (pattern used across controllers):
  - `const item = await Model.findOne({ id_encuesta: Number(req.params.id) });`
- Create a Mongoose model file (example style):
  - `import mongoose from 'mongoose';` then `export default mongoose.model('Name', schema);`

**Files to check when changing behavior**
- `src/db.js` — DB connection & credentials
- `src/server.js` — route mounting, middleware, JSON parsing
- `src/routes/*.js` — route definitions
- `src/controllers/*.js` — business logic & HTTP error handling
- `src/models/*.js` — schema shapes and indexes (numeric IDs, refs)

**When making changes, things to verify**
- Ensure ES module syntax is used consistently (no `require`/`module.exports`).
- If using domain numeric IDs (e.g. `id_encuesta`) for lookups, keep `Number(req.params.id)` conversions to avoid mismatches.
- Double-check that each route referenced by `src/server.js` has a corresponding controller and exported router.

If anything above is unclear or you want additional details (example: adding auth, or replacing the hardcoded DB string with `.env` and a short migration patch), tell me which area to expand and I will update this file.
