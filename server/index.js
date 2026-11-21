import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { mkdir, writeFile, unlink } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { pool } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const ASSETS_DIR = path.resolve(ROOT_DIR, 'assets');
const PORT = process.env.PORT || 3000;

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '12mb' }));
app.use('/assets', express.static(ASSETS_DIR, { maxAge: '7d' }));
app.use('/uploads', express.static(ASSETS_DIR, { maxAge: '7d' })); // Retrocompatibilidad

// Helper para envolver funciones asíncronas y atrapar errores
const wrap = (fn) => (req, res, next) => fn(req, res, next).catch(next);

// Helper para eliminar imagen previa si se actualiza o borra un registro
async function deleteOldImage(imageUrl) {
  if (!imageUrl || (!imageUrl.startsWith('/assets/') && !imageUrl.startsWith('/uploads/'))) return;
  const fileName = path.basename(imageUrl);
  const filePath = path.join(ASSETS_DIR, fileName);
  try {
    if (existsSync(filePath)) await unlink(filePath);
  } catch (err) {
    console.warn('No se pudo borrar imagen antigua:', err.message);
  }
}

// Generador de controladores CRUD
function crud(table, fields, { select, order } = {}) {
  const base = select || `SELECT * FROM ${table}`;
  const ord = order || `${table}.id DESC`;
  const values = (b) => fields.map((f) => (b[f] === '' || b[f] === undefined ? null : b[f]));
  const findOne = async (id) => (await pool.query(`${base} WHERE ${table}.id = ?`, [id]))[0][0];

  return {
    list: async (_req, res) => res.json((await pool.query(`${base} ORDER BY ${ord}`))[0]),
    get: async (req, res) => {
      const row = await findOne(req.params.id);
      row ? res.json(row) : res.status(404).json({ error: 'Registro no encontrado' });
    },
    create: async (req, res) => {
      if (req.body.dni && !/^\d{8}$/.test(String(req.body.dni).trim())) {
        return res.status(400).json({ error: 'El DNI debe tener 8 dígitos numéricos' });
      }
      const [r] = await pool.query(
        `INSERT INTO ${table} (${fields.join(',')}) VALUES (${fields.map(() => '?').join(',')})`,
        values(req.body)
      );
      res.status(201).json(await findOne(r.insertId));
    },
    update: async (req, res) => {
      if (req.body.dni && !/^\d{8}$/.test(String(req.body.dni).trim())) {
        return res.status(400).json({ error: 'El DNI debe tener 8 dígitos numéricos' });
      }
      const existing = await findOne(req.params.id);
      if (!existing) return res.status(404).json({ error: 'Registro no encontrado' });

      if (existing.imagen && req.body.imagen && existing.imagen !== req.body.imagen) {
        await deleteOldImage(existing.imagen);
      }

      await pool.query(
        `UPDATE ${table} SET ${fields.map((f) => `${f}=?`).join(',')} WHERE id=?`,
        [...values(req.body), req.params.id]
      );
      res.json(await findOne(req.params.id));
    },
    remove: async (req, res) => {
      const existing = await findOne(req.params.id);
      if (!existing) return res.status(404).json({ error: 'Registro no encontrado' });
      if (existing.imagen) await deleteOldImage(existing.imagen);

      await pool.query(`DELETE FROM ${table} WHERE id=?`, [req.params.id]);
      res.json({ ok: true });
    },
  };
}

function mount(routePath, controller) {
  app.get(`/api${routePath}`, wrap(controller.list));
  app.get(`/api${routePath}/:id`, wrap(controller.get));
  app.post(`/api${routePath}`, wrap(controller.create));
  app.put(`/api${routePath}/:id`, wrap(controller.update));
  app.delete(`/api${routePath}/:id`, wrap(controller.remove));
}

// ── RUTAS DE LA API ─────────────────────────────────────────────────────────────
app.get('/api/rangos', wrap(async (_req, res) => {
  const [rows] = await pool.query('SELECT * FROM rangos ORDER BY orden');
  res.json(rows);
}));

mount('/cadetes', crud('cadetes',
  ['nombres', 'apellidos', 'dni', 'rango_id', 'nivel', 'fisico', 'tactico', 'disciplina', 'unidad', 'fecha_ingreso', 'imagen'],
  { select: 'SELECT cadetes.*, rangos.nombre AS rango, rangos.orden FROM cadetes JOIN rangos ON rangos.id = cadetes.rango_id',
    order: 'rangos.orden DESC, cadetes.apellidos' }));

mount('/rutinas', crud('rutinas',
  ['titulo', 'tipo', 'frecuencia', 'dia_semana', 'hora', 'duracion_min', 'rango_id', 'nivel', 'descripcion', 'imagen'],
  { select: 'SELECT rutinas.*, rangos.nombre AS rango FROM rutinas LEFT JOIN rangos ON rangos.id = rutinas.rango_id',
    order: 'rutinas.hora' }));

mount('/eventos', crud('eventos',
  ['titulo', 'tipo', 'fecha', 'hora', 'lugar', 'descripcion', 'imagen'],
  { order: 'eventos.fecha, eventos.hora' }));

mount('/inscripciones', crud('inscripciones',
  ['nombres', 'apellidos', 'dni', 'fecha_nacimiento', 'telefono', 'direccion', 'talla_cm', 'peso_kg', 'eval_medica', 'eval_fisica', 'estado', 'imagen']));

// Aprobar postulante
app.post('/api/inscripciones/:id/aprobar', wrap(async (req, res) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [[i]] = await conn.query('SELECT * FROM inscripciones WHERE id=? FOR UPDATE', [req.params.id]);
    if (!i) return res.status(404).json({ error: 'Inscripción no encontrada' });
    if (i.estado === 'Aprobado') return res.status(409).json({ error: 'El postulante ya fue aprobado' });
    if (!i.eval_medica?.startsWith('Apto')) {
      return res.status(400).json({ error: 'Se requiere evaluación médica "Apto" para aprobar' });
    }

    const [[soldado]] = await conn.query("SELECT id FROM rangos WHERE nombre='Soldado'");
    const [c] = await conn.query(
      `INSERT INTO cadetes (nombres,apellidos,dni,rango_id,nivel,fisico,tactico,disciplina,unidad,fecha_ingreso,imagen)
       VALUES (?,?,?,?, 'Nuevo', ?, 0, 0, 'Centro de Instrucción', CURDATE(), ?)`,
      [i.nombres, i.apellidos, i.dni, soldado.id, i.eval_fisica || 0, i.imagen]);

    await conn.query("UPDATE inscripciones SET estado='Aprobado', cadete_id=? WHERE id=?", [c.insertId, i.id]);
    await conn.commit();
    res.json({ ok: true, cadete_id: c.insertId });
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
}));

// Rechazar postulante
app.post('/api/inscripciones/:id/rechazar', wrap(async (req, res) => {
  await pool.query("UPDATE inscripciones SET estado='Rechazado' WHERE id=? AND estado<>'Aprobado'", [req.params.id]);
  res.json({ ok: true });
}));

// Subida de imágenes
app.post('/api/uploads', wrap(async (req, res) => {
  const m = /^data:image\/(png|jpe?g|webp|gif);base64,([A-Za-z0-9+/=]+)$/.exec(req.body?.data || '');
  if (!m) return res.status(400).json({ error: 'Formato no válido (usa PNG, JPG, WEBP o GIF)' });

  const buf = Buffer.from(m[2], 'base64');
  if (buf.length > 5 * 1024 * 1024) return res.status(413).json({ error: 'La imagen supera los 5 MB' });

  const name = `${randomUUID()}.${m[1] === 'jpeg' ? 'jpg' : m[1]}`;
  await mkdir(ASSETS_DIR, { recursive: true });
  await writeFile(path.join(ASSETS_DIR, name), buf);
  res.status(201).json({ url: `/assets/${name}` });
}));

// Manejo de errores API
app.use((err, req, res, next) => {
  if (req.path.startsWith('/api')) {
    console.error(err.message);
    const isDup = err.code === 'ER_DUP_ENTRY';
    return res.status(err.status || (isDup || err.code?.startsWith('ER_') ? 400 : 500)).json({
      error: isDup ? 'Ya existe un registro con ese DNI' : (err.message || 'Error del servidor'),
    });
  }
  next(err);
});

// Integración de Vite (Frontend)
const DIST_DIR = path.resolve(ROOT_DIR, 'dist');
if (process.env.NODE_ENV === 'production' && existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR));
  app.get('*', (_req, res) => res.sendFile(path.resolve(DIST_DIR, 'index.html')));
} else {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    root: ROOT_DIR,
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
}

app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(` 🛡️  Centro de Mando · Ejército del Perú`);
  console.log(` 🌐 Aplicación lista en: http://localhost:${PORT}`);
  console.log(`======================================================\n`);
});
