import { pool } from '../config/db.js';

export const inscripcionModel = {
  async getAll() {
    const [rows] = await pool.query('SELECT * FROM inscripciones ORDER BY id DESC');
    return rows;
  },

  async getById(id) {
    const [rows] = await pool.query('SELECT * FROM inscripciones WHERE id = ?', [id]);
    return rows[0] || null;
  },

  async create(data) {
    const fields = ['nombres', 'apellidos', 'dni', 'fecha_nacimiento', 'telefono', 'direccion', 'talla_cm', 'peso_kg', 'eval_medica', 'eval_fisica', 'estado', 'imagen'];
    const values = fields.map(f => (data[f] === '' || data[f] === undefined ? null : data[f]));

    const sql = `INSERT INTO inscripciones (${fields.join(',')}) VALUES (${fields.map(() => '?').join(',')})`;
    const [result] = await pool.query(sql, values);
    return this.getById(result.insertId);
  },

  async update(id, data) {
    const fields = ['nombres', 'apellidos', 'dni', 'fecha_nacimiento', 'telefono', 'direccion', 'talla_cm', 'peso_kg', 'eval_medica', 'eval_fisica', 'estado', 'imagen'];
    const values = fields.map(f => (data[f] === '' || data[f] === undefined ? null : data[f]));

    const sql = `UPDATE inscripciones SET ${fields.map(f => `${f}=?`).join(',')} WHERE id=?`;
    await pool.query(sql, [...values, id]);
    return this.getById(id);
  },

  async delete(id) {
    const [result] = await pool.query('DELETE FROM inscripciones WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },

  async rechazar(id) {
    const [result] = await pool.query("UPDATE inscripciones SET estado='Rechazado' WHERE id=? AND estado<>'Aprobado'", [id]);
    return result.affectedRows > 0;
  },

  /**
   * Transacción ACID atómica con bloqueo pesimista (FOR UPDATE)
   */
  async aprobar(id) {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      const [[inscripcion]] = await conn.query('SELECT * FROM inscripciones WHERE id=? FOR UPDATE', [id]);
      if (!inscripcion) {
        const error = new Error('Inscripción no encontrada');
        error.status = 404;
        throw error;
      }
      if (inscripcion.estado === 'Aprobado') {
        const error = new Error('El postulante ya fue aprobado');
        error.status = 409;
        throw error;
      }
      if (!inscripcion.eval_medica?.startsWith('Apto')) {
        const error = new Error('Se requiere evaluación médica "Apto" para aprobar');
        error.status = 400;
        throw error;
      }

      // Buscar rango base "Soldado"
      const [[soldado]] = await conn.query("SELECT id FROM rangos WHERE nombre='Soldado'");
      if (!soldado) {
        throw new Error('Rango Soldado no encontrado en la base de datos');
      }

      // Insertar en cadetes
      const [cadeteResult] = await conn.query(
        `INSERT INTO cadetes (nombres, apellidos, dni, rango_id, nivel, fisico, tactico, disciplina, unidad, fecha_ingreso, imagen)
         VALUES (?, ?, ?, ?, 'Nuevo', ?, 0, 0, 'Centro de Instrucción', CURDATE(), ?)`,
        [inscripcion.nombres, inscripcion.apellidos, inscripcion.dni, soldado.id, inscripcion.eval_fisica || 0, inscripcion.imagen]
      );

      // Actualizar inscripción
      await conn.query("UPDATE inscripciones SET estado='Aprobado', cadete_id=? WHERE id=?", [cadeteResult.insertId, inscripcion.id]);

      await conn.commit();
      return { ok: true, cadete_id: cadeteResult.insertId };
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  },
};
