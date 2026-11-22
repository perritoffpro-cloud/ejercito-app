import { rutinaModel } from '../models/rutinaModel.js';
import { deleteImageFile } from '../utils/fileManager.js';

export const rutinaController = {
  async getRutinas(req, res, next) {
    try {
      const rutinas = await rutinaModel.getAll();
      res.json(rutinas);
    } catch (err) {
      next(err);
    }
  },

  async getRutinaById(req, res, next) {
    try {
      const rutina = await rutinaModel.getById(req.params.id);
      if (!rutina) return res.status(404).json({ error: 'Rutina no encontrada' });
      res.json(rutina);
    } catch (err) {
      next(err);
    }
  },

  async createRutina(req, res, next) {
    try {
      const nueva = await rutinaModel.create(req.body);
      res.status(201).json(nueva);
    } catch (err) {
      next(err);
    }
  },

  async updateRutina(req, res, next) {
    try {
      const existing = await rutinaModel.getById(req.params.id);
      if (!existing) return res.status(404).json({ error: 'Rutina no encontrada' });

      if (existing.imagen && req.body.imagen && existing.imagen !== req.body.imagen) {
        await deleteImageFile(existing.imagen);
      }

      const actualizada = await rutinaModel.update(req.params.id, req.body);
      res.json(actualizada);
    } catch (err) {
      next(err);
    }
  },

  async deleteRutina(req, res, next) {
    try {
      const existing = await rutinaModel.getById(req.params.id);
      if (!existing) return res.status(404).json({ error: 'Rutina no encontrada' });

      if (existing.imagen) {
        await deleteImageFile(existing.imagen);
      }

      await rutinaModel.delete(req.params.id);
      res.json({ ok: true, message: 'Rutina eliminada exitosamente' });
    } catch (err) {
      next(err);
    }
  },
};
