import express from 'express';
import cors from 'cors';
import { ASSETS_DIR } from './utils/fileManager.js';
import apiRouter from './routes/index.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json({ limit: '12mb' }));

// Servidor de archivos estáticos (imágenes militares)
app.use('/assets', express.static(ASSETS_DIR, { maxAge: '7d' }));
app.use('/uploads', express.static(ASSETS_DIR, { maxAge: '7d' })); // Retrocompatibilidad

// Montaje de rutas de la API REST
app.use('/api', apiRouter);

// Middleware centralizado de manejo de errores
app.use(errorHandler);

export default app;
