import { cadeteModel } from '../models/cadeteModel.js';
import { deleteImageFile } from '../utils/fileManager.js';

export const cadeteController = {
  async getCadetes(req, res, next) {
    try {
      const cadetes = await cadeteModel.getAll();
      res.json(cadetes);
    } catch (err) {
      next(err);
    }
  },

  async getCadeteById(req, res, next) {
    try {
      const cadete = await cadeteModel.getById(req.params.id);
      if (!cadete) return res.status(404).json({ error: 'Cadete no encontrado' });
      res.json(cadete);
    } catch (err) {
      next(err);
    }
  },

  async createCadete(req, res, next) {
    try {
      const { dni } = req.body;
      if (dni && !/^\d{8}$/.test(String(dni).trim())) {
        return res.status(400).json({ error: 'El DNI debe tener 8 dígitos numéricos' });
      }
      const nuevo = await cadeteModel.create(req.body);
      res.status(201).json(nuevo);
    } catch (err) {
      next(err);
    }
  },

  async updateCadete(req, res, next) {
    try {
      const { dni, imagen } = req.body;
      if (dni && !/^\d{8}$/.test(String(dni).trim())) {
        return res.status(400).json({ error: 'El DNI debe tener 8 dígitos numéricos' });
      }

      const existing = await cadeteModel.getById(req.params.id);
      if (!existing) return res.status(404).json({ error: 'Cadete no encontrado' });

      // Si cambió de imagen, eliminar la foto anterior en disco
      if (existing.imagen && imagen && existing.imagen !== imagen) {
        await deleteImageFile(existing.imagen);
      }

      const actualizado = await cadeteModel.update(req.params.id, req.body);
      res.json(actualizado);
    } catch (err) {
      next(err);
    }
  },

  async deleteCadete(req, res, next) {
    try {
      const existing = await cadeteModel.getById(req.params.id);
      if (!existing) return res.status(404).json({ error: 'Cadete no encontrado' });

      if (existing.imagen) {
        await deleteImageFile(existing.imagen);
      }

      await cadeteModel.delete(req.params.id);
      res.json({ ok: true, message: 'Cadete eliminado exitosamente' });
    } catch (err) {
      next(err);
    }
  },
};
