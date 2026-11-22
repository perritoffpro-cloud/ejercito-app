import { rangoModel } from '../models/rangoModel.js';

export const rangoController = {
  async getRangos(req, res, next) {
    try {
      const rangos = await rangoModel.getAll();
      res.json(rangos);
    } catch (err) {
      next(err);
    }
  },
};
