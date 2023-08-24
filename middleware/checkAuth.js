const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const { confirmar } = require('../controllers/usuarioControllers');

const checkAuth = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {

        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET_WORD);

            const respuesta = await Usuario.findByPk(decoded.id);

            req.usuario = {
                id: respuesta.id,
                nombre: respuesta.nombre,
                email: respuesta.email,
                confirmar: respuesta.confirmar
            }

            return next();

        } catch (error) {
            return res.status(403).json({ msg: 'Token ha expirado!', error: true });
        }
    }

    if (!token) {
        const error = new Error('Token no valido!');
        return res.status(401).json({ msg: error.message });
    }

    next();
}


module.exports = checkAuth;