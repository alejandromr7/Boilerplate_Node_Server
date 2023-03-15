const { json } = require("sequelize");
const Usuario = require("../models/Usuario")

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

module.exports = { registrar }