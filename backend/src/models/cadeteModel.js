import { pool } from '../config/db.js';

export const cadeteModel = {
  async getAll() {
    const query = `
      SELECT cadetes.*, rangos.nombre AS rango, rangos.orden 
      FROM cadetes 
      JOIN rangos ON rangos.id = cadetes.rango_id 
      ORDER BY rangos.orden DESC, cadetes.apellidos ASC
    `;
    const [rows] = await pool.query(query);
    return rows;
  },

  async getById(id) {
    const query = `
      SELECT cadetes.*, rangos.nombre AS rango, rangos.orden 
      FROM cadetes 
      JOIN rangos ON rangos.id = cadetes.rango_id 
      WHERE cadetes.id = ?
    `;
    const [rows] = await pool.query(query, [id]);
    return rows[0] || null;
  },

  async create(data) {
    const fields = ['nombres', 'apellidos', 'dni', 'rango_id', 'nivel', 'fisico', 'tactico', 'disciplina', 'unidad', 'fecha_ingreso', 'imagen'];
    const values = fields.map(f => (data[f] === '' || data[f] === undefined ? null : data[f]));

    const sql = `INSERT INTO cadetes (${fields.join(',')}) VALUES (${fields.map(() => '?').join(',')})`;
    const [result] = await pool.query(sql, values);
    return this.getById(result.insertId);
  },

  async update(id, data) {
    const fields = ['nombres', 'apellidos', 'dni', 'rango_id', 'nivel', 'fisico', 'tactico', 'disciplina', 'unidad', 'fecha_ingreso', 'imagen'];
    const values = fields.map(f => (data[f] === '' || data[f] === undefined ? null : data[f]));

    const sql = `UPDATE cadetes SET ${fields.map(f => `${f}=?`).join(',')} WHERE id=?`;
    await pool.query(sql, [...values, id]);
    return this.getById(id);
  },

  async delete(id) {
    const [result] = await pool.query('DELETE FROM cadetes WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },
};
