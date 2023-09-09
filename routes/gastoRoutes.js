const { Router } = require('express');
const router = Router();
const { obtenerGastos, crearGasto, editarGasto, obtenerTotalSemanal, elimiarGasto, obtenerGastosPorRangos, obtenerTotalSemanalPorRango } = require('../controllers/gastoController');
const checkAuth = require('../middleware/checkAuth');

router.get('/', checkAuth, obtenerGastos);
router.get('/rango', checkAuth, obtenerGastosPorRangos);
router.get('/total', checkAuth, obtenerTotalSemanal);
router.get('/total-rango', checkAuth, obtenerTotalSemanalPorRango);
router.post('/', checkAuth, crearGasto);
router.route('/:id').put(checkAuth, editarGasto).delete(checkAuth, elimiarGasto);

module.exports = router;