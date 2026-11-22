import { pool } from '../config/db.js';

export const eventoModel = {
  async getAll() {
    const [rows] = await pool.query('SELECT * FROM eventos ORDER BY eventos.fecha ASC, eventos.hora ASC');
    return rows;
  },

  async getById(id) {
    const [rows] = await pool.query('SELECT * FROM eventos WHERE id = ?', [id]);
    return rows[0] || null;
  },

  async create(data) {
    const fields = ['titulo', 'tipo', 'fecha', 'hora', 'lugar', 'descripcion', 'imagen'];
    const values = fields.map(f => (data[f] === '' || data[f] === undefined ? null : data[f]));

    const sql = `INSERT INTO eventos (${fields.join(',')}) VALUES (${fields.map(() => '?').join(',')})`;
    const [result] = await pool.query(sql, values);
    return this.getById(result.insertId);
  },

  async update(id, data) {
    const fields = ['titulo', 'tipo', 'fecha', 'hora', 'lugar', 'descripcion', 'imagen'];
    const values = fields.map(f => (data[f] === '' || data[f] === undefined ? null : data[f]));

    const sql = `UPDATE eventos SET ${fields.map(f => `${f}=?`).join(',')} WHERE id=?`;
    await pool.query(sql, [...values, id]);
    return this.getById(id);
  },

  async delete(id) {
    const [result] = await pool.query('DELETE FROM eventos WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },
};
