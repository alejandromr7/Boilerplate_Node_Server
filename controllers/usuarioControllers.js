const Usuario = require("../models/Usuario")
const bcrypt = require('bcrypt');
const generarId = require("../helpers/generarId");
const generarJWT = require("../helpers/generarJWT");

const registrar = async (req, res) => {
    const { email } = req.body;

    const existeUsuario = await Usuario.findOne({ where: { email } });

    if (existeUsuario) {
        const error = new Error('Usuario ya registrado');
        return res.status(400).json({ msg: error.message, error: true });
    }

    try {
        await Usuario.create(req.body);
        res.json({ msg: 'Usuario registrado correctamente', error: false });
    } catch (error) {
        console.log(error);
    }
}


const autenticar = async (req, res) => {
    const { email, password } = req.body;

    // Comprobar si el usuario existe //
    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
        const error = new Error('El usuario no existe!');
        return res.status(404).json({ msg: error.message, error: true });
    }

    // Comprobar si el usuario esta confirmado //
    if (!usuario.confirmar) {
        const error = new Error('Aún no has confirmado tú cuenta!');
        return res.status(401).json({ msg: error.message, error: true });
    }

    // Comprobar su password //
    const compararPassword = await bcrypt.compare(password, usuario.password);
    console.log(compararPassword);

    if (!compararPassword) {
        const error = new Error('Contraseña incorrecta!');
        return res.status(403).json({ msg: error.message, error: true });
    }

    res.json({
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        token: generarJWT(usuario.id)
    });

}

module.exports = { registrar, autenticar }