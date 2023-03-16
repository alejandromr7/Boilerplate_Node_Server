const { Router } = require('express');
const router = Router();
const { registrar, autenticar, confirmar, olvidePassword } = require('../controllers/usuarioControllers');

router.post('/', registrar);
router.post('/login', autenticar);
router.get('/confirmar/:token', confirmar);
router.post('/olvide-password', olvidePassword);

module.exports = router;