const { Router } = require('express');
const machineController = require('../controllers/machineController');
const maintenanceController = require('../controllers/maintenanceController');
const authMiddleware = require('../middleware/auth');

const router = Router();

router.use(authMiddleware);

router.get('/', machineController.list);
router.post('/', machineController.create);
router.get('/:id', machineController.getOne);
router.put('/:id', machineController.update);
router.delete('/:id', machineController.remove);

router.get('/:machineId/maintenances', maintenanceController.list);
router.post('/:machineId/maintenances', maintenanceController.create);
router.put('/:machineId/maintenances/:id', maintenanceController.update);
router.delete('/:machineId/maintenances/:id', maintenanceController.remove);

module.exports = router;
