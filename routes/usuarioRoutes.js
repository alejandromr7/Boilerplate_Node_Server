const { Router } = require('express');
const router = Router();
const { registrar, autenticar } = require('../controllers/usuarioControllers');

router.post('/', registrar);
router.post('/login', autenticar);

module.exports = router;