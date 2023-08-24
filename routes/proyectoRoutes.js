const { Router } = require('express');
const router = Router();
const { obtenerProyectos, obtenerProyecto, nuevoProyecto, editarProyecto, eliminarProyecto, agregarColaborador, eliminarColaborador, buscarColaborador } = require('../controllers/proyectoControllers');
const checkAuth = require('../middleware/checkAuth');

router.route('/').get(checkAuth, obtenerProyectos).post(checkAuth, nuevoProyecto);
router.route('/:id').get(checkAuth, obtenerProyecto).put(checkAuth, editarProyecto).delete(checkAuth, eliminarProyecto)


router.post('/colaboradores', checkAuth, buscarColaborador);
router.post('/colaboradores/:id', checkAuth, agregarColaborador);
router.route('/colaborador/:id').delete(checkAuth, eliminarColaborador);


module.exports = router;