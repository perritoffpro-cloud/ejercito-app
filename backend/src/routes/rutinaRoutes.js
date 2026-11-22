import { Router } from 'express';
import { rutinaController } from '../controllers/rutinaController.js';

const router = Router();

router.get('/', rutinaController.getRutinas);
router.get('/:id', rutinaController.getRutinaById);
router.post('/', rutinaController.createRutina);
router.put('/:id', rutinaController.updateRutina);
router.delete('/:id', rutinaController.deleteRutina);

export default router;
