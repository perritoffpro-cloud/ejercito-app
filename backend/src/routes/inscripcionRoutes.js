import { Router } from 'express';
import { inscripcionController } from '../controllers/inscripcionController.js';

const router = Router();

router.get('/', inscripcionController.getInscripciones);
router.get('/:id', inscripcionController.getInscripcionById);
router.post('/', inscripcionController.createInscripcion);
router.put('/:id', inscripcionController.updateInscripcion);
router.delete('/:id', inscripcionController.deleteInscripcion);

// Acciones especiales del flujo de admisión
router.post('/:id/aprobar', inscripcionController.aprobarInscripcion);
router.post('/:id/rechazar', inscripcionController.rechazarInscripcion);

export default router;
