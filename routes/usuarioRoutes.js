const { Router } = require('express');
const router = Router();
const { registrar, autenticar, confirmar, olvidePassword, comprobarToken, nuevoPassword, perfil } = require('../controllers/usuarioControllers');
const checkAuth = require('../middleware/checkAuth');

router.post('/', registrar);
router.post('/login', autenticar);
router.get('/confirmar/:token', confirmar);
router.post('/olvide-password', olvidePassword);
router.route('/olvide-password/:token').get(comprobarToken).post(nuevoPassword);

router.get('/perfil', checkAuth, perfil);


module.exports = router;