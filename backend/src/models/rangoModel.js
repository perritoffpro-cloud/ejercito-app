import { pool } from '../config/db.js';

export const rangoModel = {
  async getAll() {
    const [rows] = await pool.query('SELECT * FROM rangos ORDER BY orden ASC');
    return rows;
  },

  async getById(id) {
    const [rows] = await pool.query('SELECT * FROM rangos WHERE id = ?', [id]);
    return rows[0] || null;
  },

  async getByNombre(nombre) {
    const [rows] = await pool.query('SELECT * FROM rangos WHERE nombre = ?', [nombre]);
    return rows[0] || null;
  },
};
