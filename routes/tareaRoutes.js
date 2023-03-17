const { Router } = require('express');
const router = Router();
const { agregarTarea, obtenerTarea, actualizarTarea, eliminarTarea, cambiarEstado } = require('../controllers/tareaControllers');
const checkAuth = require('../middleware/checkAuth');

router.post('/', checkAuth, agregarTarea);
router.route('/:id').get(checkAuth, obtenerTarea).put(checkAuth, actualizarTarea).delete(checkAuth, eliminarTarea);

router.post('/estado/:id', checkAuth, cambiarEstado);

module.exports = router;
