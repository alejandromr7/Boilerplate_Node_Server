const { Router } = require('express');
const router = Router();
const { obtenerProyectos, obtenerProyecto, nuevoProyecto, editarProyecto, eliminarProyecto, agregarColaborador, eliminarColaborador } = require('../controllers/proyectoControllers');
const checkAuth = require('../middleware/checkAuth');

router.route('/').get(checkAuth, obtenerProyectos).post(checkAuth, nuevoProyecto);
router.route('/:id').get(checkAuth, obtenerProyecto).put(checkAuth, editarProyecto).delete(checkAuth, eliminarProyecto)
router.route('/agregar-colaborador/:id').post(checkAuth, agregarColaborador);
router.route('/eliminar-colaborador/:id').delete(checkAuth, eliminarColaborador);

module.exports = router;