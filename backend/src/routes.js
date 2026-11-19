import { Router } from 'express';
import { pool } from './db.js';
import { crud } from './crud.js';
import { mkdir, writeFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Carpeta donde se guardan las imágenes subidas (se sirve en /uploads)
export const UPLOADS = fileURLToPath(new URL('../uploads', import.meta.url));

const wrap = (fn) => (req, res, next) => fn(req, res, next).catch(next);
const router = Router();

function mount(path, c) {
  router.get(path, wrap(c.list));
  router.get(`${path}/:id`, wrap(c.get));
  router.post(path, wrap(c.create));
  router.put(`${path}/:id`, wrap(c.update));
  router.delete(`${path}/:id`, wrap(c.remove));
}

router.get('/rangos', wrap(async (_q, res) =>
  res.json((await pool.query('SELECT * FROM rangos ORDER BY orden'))[0])));

mount('/cadetes', crud('cadetes',
  ['nombres', 'apellidos', 'dni', 'rango_id', 'nivel', 'fisico', 'tactico', 'disciplina', 'unidad', 'fecha_ingreso', 'imagen'],
  { select: 'SELECT cadetes.*, rangos.nombre AS rango, rangos.orden FROM cadetes JOIN rangos ON rangos.id = cadetes.rango_id',
    order: 'rangos.orden DESC, cadetes.apellidos' }));

mount('/rutinas', crud('rutinas',
  ['titulo', 'tipo', 'frecuencia', 'dia_semana', 'hora', 'duracion_min', 'rango_id', 'nivel', 'descripcion', 'imagen'],
  { select: 'SELECT rutinas.*, rangos.nombre AS rango FROM rutinas LEFT JOIN rangos ON rangos.id = rutinas.rango_id',
    order: 'rutinas.hora' }));

mount('/eventos', crud('eventos',
  ['titulo', 'tipo', 'fecha', 'hora', 'lugar', 'descripcion', 'imagen'], { order: 'eventos.fecha, eventos.hora' }));

mount('/inscripciones', crud('inscripciones',
  ['nombres', 'apellidos', 'dni', 'fecha_nacimiento', 'telefono', 'direccion', 'talla_cm', 'peso_kg', 'eval_medica', 'eval_fisica', 'estado', 'imagen']));

// Aprobar postulante: crea el cadete (Soldado / Nuevo) y marca la inscripción, en una transacción
router.post('/inscripciones/:id/aprobar', wrap(async (req, res) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [[i]] = await conn.query('SELECT * FROM inscripciones WHERE id=? FOR UPDATE', [req.params.id]);
    if (!i) throw Object.assign(new Error('Inscripción no encontrada'), { status: 404 });
    if (i.estado === 'Aprobado') throw Object.assign(new Error('El postulante ya fue aprobado'), { status: 409 });
    if (!i.eval_medica.startsWith('Apto'))
      throw Object.assign(new Error('Se requiere evaluación médica "Apto" para aprobar'), { status: 400 });
    const [[soldado]] = await conn.query("SELECT id FROM rangos WHERE nombre='Soldado'");
    const [c] = await conn.query(
      `INSERT INTO cadetes (nombres,apellidos,dni,rango_id,nivel,fisico,tactico,disciplina,unidad,fecha_ingreso,imagen)
       VALUES (?,?,?,?, 'Nuevo', ?, 0, 0, 'Centro de Instrucción', CURDATE(), ?)`,
      [i.nombres, i.apellidos, i.dni, soldado.id, i.eval_fisica, i.imagen]);
    await conn.query("UPDATE inscripciones SET estado='Aprobado', cadete_id=? WHERE id=?", [c.insertId, i.id]);
    await conn.commit();
    res.json({ ok: true, cadete_id: c.insertId });
  } catch (e) { await conn.rollback(); throw e; } finally { conn.release(); }
}));

router.post('/inscripciones/:id/rechazar', wrap(async (req, res) => {
  await pool.query("UPDATE inscripciones SET estado='Rechazado' WHERE id=? AND estado<>'Aprobado'", [req.params.id]);
  res.json({ ok: true });
}));

// Subida de imágenes: recibe { data: 'data:image/...;base64,...' } y devuelve { url }
router.post('/uploads', wrap(async (req, res) => {
  const m = /^data:image\/(png|jpe?g|webp|gif);base64,([A-Za-z0-9+/=]+)$/.exec(req.body?.data || '');
  if (!m) throw Object.assign(new Error('Formato de imagen no válido (usa PNG, JPG, WEBP o GIF)'), { status: 400 });
  const buf = Buffer.from(m[2], 'base64');
  if (buf.length > 5 * 1024 * 1024) throw Object.assign(new Error('La imagen supera los 5 MB'), { status: 413 });
  const name = `${randomUUID()}.${m[1] === 'jpeg' ? 'jpg' : m[1]}`;
  await mkdir(UPLOADS, { recursive: true });
  await writeFile(path.join(UPLOADS, name), buf);
  res.status(201).json({ url: `/uploads/${name}` });
}));

export default router;
