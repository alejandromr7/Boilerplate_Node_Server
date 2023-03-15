const { Router } = require('express');
const router = Router();
const { registrar } = require('../controllers/usuarioControllers');

router.post('/', registrar);

module.exports = router;