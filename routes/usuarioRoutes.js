const { Router } = require('express');
const router = Router();
const { registrar, autenticar, confirmar } = require('../controllers/usuarioControllers');

router.post('/', registrar);
router.post('/login', autenticar);
router.get('/confirmar/:token', confirmar);

module.exports = router;