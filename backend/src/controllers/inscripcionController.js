import { inscripcionModel } from '../models/inscripcionModel.js';
import { deleteImageFile } from '../utils/fileManager.js';

export const inscripcionController = {
  async getInscripciones(req, res, next) {
    try {
      const inscripciones = await inscripcionModel.getAll();
      res.json(inscripciones);
    } catch (err) {
      next(err);
    }
  },

  async getInscripcionById(req, res, next) {
    try {
      const inscripcion = await inscripcionModel.getById(req.params.id);
      if (!inscripcion) return res.status(404).json({ error: 'Inscripción no encontrada' });
      res.json(inscripcion);
    } catch (err) {
      next(err);
    }
  },

  async createInscripcion(req, res, next) {
    try {
      const { dni } = req.body;
      if (dni && !/^\d{8}$/.test(String(dni).trim())) {
        return res.status(400).json({ error: 'El DNI debe tener 8 dígitos numéricos' });
      }
      const nueva = await inscripcionModel.create(req.body);
      res.status(201).json(nueva);
    } catch (err) {
      next(err);
    }
  },

  async updateInscripcion(req, res, next) {
    try {
      const { dni, imagen } = req.body;
      if (dni && !/^\d{8}$/.test(String(dni).trim())) {
        return res.status(400).json({ error: 'El DNI debe tener 8 dígitos numéricos' });
      }

      const existing = await inscripcionModel.getById(req.params.id);
      if (!existing) return res.status(404).json({ error: 'Inscripción no encontrada' });

      if (existing.imagen && imagen && existing.imagen !== imagen) {
        await deleteImageFile(existing.imagen);
      }

      const actualizada = await inscripcionModel.update(req.params.id, req.body);
      res.json(actualizada);
    } catch (err) {
      next(err);
    }
  },

  async deleteInscripcion(req, res, next) {
    try {
      const existing = await inscripcionModel.getById(req.params.id);
      if (!existing) return res.status(404).json({ error: 'Inscripción no encontrada' });

      if (existing.imagen) {
        await deleteImageFile(existing.imagen);
      }

      await inscripcionModel.delete(req.params.id);
      res.json({ ok: true, message: 'Inscripción eliminada exitosamente' });
    } catch (err) {
      next(err);
    }
  },

  async rechazarInscripcion(req, res, next) {
    try {
      await inscripcionModel.rechazar(req.params.id);
      res.json({ ok: true, message: 'Postulante marcado como Rechazado' });
    } catch (err) {
      next(err);
    }
  },

  async aprobarInscripcion(req, res, next) {
    try {
      const result = await inscripcionModel.aprobar(req.params.id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },
};
