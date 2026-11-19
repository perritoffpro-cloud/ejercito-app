import { pool } from './db.js';

// Fábrica de controladores CRUD: list, get, create, update, remove
export function crud(table, fields, { select, order } = {}) {
  const base = select || `SELECT * FROM ${table}`;
  const ord = order || `${table}.id DESC`;
  const values = (b) => fields.map((f) => (b[f] === '' || b[f] === undefined ? null : b[f]));
  const one = async (id) => (await pool.query(`${base} WHERE ${table}.id = ?`, [id]))[0][0];

  return {
    list: async (_req, res) => res.json((await pool.query(`${base} ORDER BY ${ord}`))[0]),
    get: async (req, res) => {
      const row = await one(req.params.id);
      row ? res.json(row) : res.status(404).json({ error: 'Registro no encontrado' });
    },
    create: async (req, res) => {
      const [r] = await pool.query(
        `INSERT INTO ${table} (${fields.join(',')}) VALUES (${fields.map(() => '?').join(',')})`,
        values(req.body)
      );
      res.status(201).json(await one(r.insertId));
    },
    update: async (req, res) => {
      const [r] = await pool.query(
        `UPDATE ${table} SET ${fields.map((f) => `${f}=?`).join(',')} WHERE id=?`,
        [...values(req.body), req.params.id]
      );
      r.affectedRows ? res.json(await one(req.params.id)) : res.status(404).json({ error: 'Registro no encontrado' });
    },
    remove: async (req, res) => {
      const [r] = await pool.query(`DELETE FROM ${table} WHERE id=?`, [req.params.id]);
      r.affectedRows ? res.json({ ok: true }) : res.status(404).json({ error: 'Registro no encontrado' });
    },
  };
}
