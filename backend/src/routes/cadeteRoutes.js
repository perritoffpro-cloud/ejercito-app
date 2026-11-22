import { Router } from 'express';
import { cadeteController } from '../controllers/cadeteController.js';

const router = Router();

router.get('/', cadeteController.getCadetes);
router.get('/:id', cadeteController.getCadeteById);
router.post('/', cadeteController.createCadete);
router.put('/:id', cadeteController.updateCadete);
router.delete('/:id', cadeteController.deleteCadete);

export default router;
