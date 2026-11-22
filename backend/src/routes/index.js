import { Router } from 'express';
import rangoRoutes from './rangoRoutes.js';
import cadeteRoutes from './cadeteRoutes.js';
import rutinaRoutes from './rutinaRoutes.js';
import eventoRoutes from './eventoRoutes.js';
import inscripcionRoutes from './inscripcionRoutes.js';
import uploadRoutes from './uploadRoutes.js';

const apiRouter = Router();

apiRouter.use('/rangos', rangoRoutes);
apiRouter.use('/cadetes', cadeteRoutes);
apiRouter.use('/rutinas', rutinaRoutes);
apiRouter.use('/eventos', eventoRoutes);
apiRouter.use('/inscripciones', inscripcionRoutes);
apiRouter.use('/uploads', uploadRoutes);

export default apiRouter;
