import { pool } from '../config/db.js';

export const rutinaModel = {
  async getAll() {
    const query = `
      SELECT rutinas.*, rangos.nombre AS rango 
      FROM rutinas 
      LEFT JOIN rangos ON rangos.id = rutinas.rango_id 
      ORDER BY rutinas.hora ASC
    `;
    const [rows] = await pool.query(query);
    return rows;
  },

  async getById(id) {
    const query = `
      SELECT rutinas.*, rangos.nombre AS rango 
      FROM rutinas 
      LEFT JOIN rangos ON rangos.id = rutinas.rango_id 
      WHERE rutinas.id = ?
    `;
    const [rows] = await pool.query(query, [id]);
    return rows[0] || null;
  },

  async create(data) {
    const fields = ['titulo', 'tipo', 'frecuencia', 'dia_semana', 'hora', 'duracion_min', 'rango_id', 'nivel', 'descripcion', 'imagen'];
    const values = fields.map(f => (data[f] === '' || data[f] === undefined ? null : data[f]));

    const sql = `INSERT INTO rutinas (${fields.join(',')}) VALUES (${fields.map(() => '?').join(',')})`;
    const [result] = await pool.query(sql, values);
    return this.getById(result.insertId);
  },

  async update(id, data) {
    const fields = ['titulo', 'tipo', 'frecuencia', 'dia_semana', 'hora', 'duracion_min', 'rango_id', 'nivel', 'descripcion', 'imagen'];
    const values = fields.map(f => (data[f] === '' || data[f] === undefined ? null : data[f]));

    const sql = `UPDATE rutinas SET ${fields.map(f => `${f}=?`).join(',')} WHERE id=?`;
    await pool.query(sql, [...values, id]);
    return this.getById(id);
  },

  async delete(id) {
    const [result] = await pool.query('DELETE FROM rutinas WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },
};
