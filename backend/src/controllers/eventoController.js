import { eventoModel } from '../models/eventoModel.js';
import { deleteImageFile } from '../utils/fileManager.js';

export const eventoController = {
  async getEventos(req, res, next) {
    try {
      const eventos = await eventoModel.getAll();
      res.json(eventos);
    } catch (err) {
      next(err);
    }
  },

  async getEventoById(req, res, next) {
    try {
      const evento = await eventoModel.getById(req.params.id);
      if (!evento) return res.status(404).json({ error: 'Evento no encontrado' });
      res.json(evento);
    } catch (err) {
      next(err);
    }
  },

  async createEvento(req, res, next) {
    try {
      const nuevo = await eventoModel.create(req.body);
      res.status(201).json(nuevo);
    } catch (err) {
      next(err);
    }
  },

  async updateEvento(req, res, next) {
    try {
      const existing = await eventoModel.getById(req.params.id);
      if (!existing) return res.status(404).json({ error: 'Evento no encontrado' });

      if (existing.imagen && req.body.imagen && existing.imagen !== req.body.imagen) {
        await deleteImageFile(existing.imagen);
      }

      const actualizado = await eventoModel.update(req.params.id, req.body);
      res.json(actualizado);
    } catch (err) {
      next(err);
    }
  },

  async deleteEvento(req, res, next) {
    try {
      const existing = await eventoModel.getById(req.params.id);
      if (!existing) return res.status(404).json({ error: 'Evento no encontrado' });

      if (existing.imagen) {
        await deleteImageFile(existing.imagen);
      }

      await eventoModel.delete(req.params.id);
      res.json({ ok: true, message: 'Evento eliminado exitosamente' });
    } catch (err) {
      next(err);
    }
  },
};
