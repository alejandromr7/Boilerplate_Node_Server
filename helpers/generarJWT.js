const jwt = require('jsonwebtoken');

const generarJWT = (id) => jwt.sign({ id }, process.env.JWT_SECRET_WORD, {
    expiresIn: '30d'
});

module.exports = generarJWT;