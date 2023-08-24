const { Router } = require('express');
const router = Router();
const { registrar, autenticar, confirmar, olvidePassword, comprobarToken, nuevoPassword, perfil, googleSingIn, actualizarPerfil, actualizarPassword, activarDesactivarCuenta } = require('../controllers/usuarioControllers');
const checkAuth = require('../middleware/checkAuth');

router.post('/', registrar);
router.post('/login', autenticar);
router.post('/google', googleSingIn);
router.get('/confirmar/:token', confirmar);
router.post('/olvide-password', olvidePassword);
router.route('/olvide-password/:token').get(comprobarToken).post(nuevoPassword);

router.get('/perfil', checkAuth, perfil);

router.get('/perfil-estado', checkAuth, activarDesactivarCuenta);
router.put('/perfil/:id', checkAuth, actualizarPerfil);
router.put('/actualizar-password', checkAuth, actualizarPassword);


module.exports = router;