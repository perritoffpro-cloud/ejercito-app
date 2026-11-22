import { Router } from 'express';
import { rangoController } from '../controllers/rangoController.js';

const router = Router();

router.get('/', rangoController.getRangos);

export default router;
