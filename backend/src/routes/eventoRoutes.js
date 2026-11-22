import { Router } from 'express';
import { eventoController } from '../controllers/eventoController.js';

const router = Router();

router.get('/', eventoController.getEventos);
router.get('/:id', eventoController.getEventoById);
router.post('/', eventoController.createEvento);
router.put('/:id', eventoController.updateEvento);
router.delete('/:id', eventoController.deleteEvento);

export default router;
