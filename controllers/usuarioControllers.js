const Usuario = require("../models/Usuario")
const bcrypt = require('bcrypt');
const generarJWT = require("../helpers/generarJWT");
const generarId = require("../helpers/generarId");
const encryptarPassword = require("../helpers/hashearPassword");
const { emailRegistro, emailOlvidePassword } = require("../helpers/emails");
const { googleVerify } = require("../helpers/google-verify");
const { json } = require("sequelize");

const registrar = async (req, res) => {
    const { email } = req.body;

    const existeUsuario = await Usuario.findOne({ where: { email } });

    if (existeUsuario) {
        const error = new Error('Usuario ya registrado');
        return res.status(400).json({ msg: error.message, error: true });
    }

    try {
        const usuario = await Usuario.create(req.body);

        emailRegistro({
            nombre: usuario.nombre,
            email: usuario.email,
            token: usuario.token
        });

        res.json({ msg: 'Usuario registrado correctamente, Revisa tu Email para confirmar tu cúenta', error: false });
    } catch (error) {
        console.log(error);
    }
}


const autenticar = async (req, res) => {
    const { email, password } = req.body;

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

    if (usuario.intentos >= 3) {
        const error = new Error('Tu cuentas ha sido bloqueada, Has intentado acceder más de 3 veces!');
        return res.status(401).json({ msg: error.message, error: true });
    }

    if (!compararPassword) {
        usuario.intentos += 1;
        await usuario.save();
        const error = new Error('Contraseña incorrecta!');
        return res.status(403).json({ msg: error.message, error: true });
    }

    usuario.intentos = 0;
    await usuario.save();


    res.json({
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        token: generarJWT(usuario.id)
    });

}

const confirmar = async (req, res) => {
    const { token } = req.params;

    //* Comprobar si el token es valido *//
    const usuarioConfirmar = await Usuario.findOne({ where: { token } });

    if (!usuarioConfirmar) {
        const error = new Error('Token no válido!');
        return res.status(403).json({ msg: error.message, error: true });
    }

    try {
        usuarioConfirmar.confirmar = true;
        usuarioConfirmar.token = '';
        await usuarioConfirmar.save();
        res.json({ msg: 'Cuenta confirmada correctamente', error: false });
    } catch (error) {
        console.log(error);
    }
}

const olvidePassword = async (req, res) => {
    const { email } = req.body;

    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
        const error = new Error('El usuario no existe!');
        return res.status(404).json({ msg: error.message });
    }

    try {
        usuario.token = generarId();
        await usuario.save();
        await emailOlvidePassword({
            nombre: usuario.nombre,
            email: usuario.email,
            token: usuario.token
        });
        res.json({ msg: 'Hemos enviado un email con las instrucciones' });
    } catch (error) {
        console.log(error);
    }

}

const comprobarToken = async (req, res) => {
    const { token } = req.params;

    //* Comprobar si el token es valido *//
    const tokenValido = await Usuario.findOne({ where: { token } });

    if (!tokenValido) {
        const error = new Error('Token no válido!');
        return res.status(403).json({ msg: error.message, error: true });
    }

    res.json({ msg: 'Token válido y el usuario existe!', error: false });
}


const nuevoPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    //* Comprobar si el token es valido *//
    const usuario = await Usuario.findOne({ where: { token } });

    if (!usuario) {
        const error = new Error('Token no válido!');
        return res.status(403).json({ msg: error.message, error: true });
    }

    try {
        usuario.password = encryptarPassword(password);
        usuario.token = '';
        await usuario.save();
        res.json({ msg: 'Contraseña actualizada correctamente.', error: false });
    } catch (error) {
        console.log(error);
    }


}

const perfil = async (req, res) => {
    const { usuario } = req;

    res.json(usuario);
}


const googleSingIn = async (req, res) => {

    const { id_token } = req.body;

    try {
        const { nombre, img, correo } = await googleVerify(id_token);

        let usuario = await Usuario.findOne({ where: { email: correo } });

        if (!usuario) {

            const data = {
                nombre,
                email: correo,
                password: '',
                token: '',
                confirmar: true
            }

            const usuarioDB = await Usuario.create(data);
            console.log(usuarioDB);

            return
        }

        res.json({
            id: usuario.id,
            nombre: usuario.nombre,
            email: usuario.email,
            img,
            token: generarJWT(usuario.id)
        });

    } catch (error) {
        res.status(400).json({ msg: 'El token no se pudo verificar' });
    }

}


const actualizarPerfil = async (req, res) => {
    const { id } = req.params;
    const body = req.body;

    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
        const error = new Error('El usuario no existe!');
        return res.status(404).json({ msg: error.message, error: true });
    }

    const { email } = req.body;

    if (usuario.email !== req.body.email) {
        const existeEmail = await Usuario.findOne({ where: { email } });

        if (existeEmail) {
            const error = new Error('Este email ya se encuentra registrado!');
            return res.status(400).json({ msg: error.message, error: true });
        }
    }

    try {
        usuario.nombre = body.nombre || usuario.nombre;
        usuario.email = body.email || usuario.email;
        const usuarioActualizado = await usuario.save();

        res.json({
            id: usuarioActualizado.id,
            nombre: usuarioActualizado.nombre,
            email: usuarioActualizado.email
        });
    } catch (error) {
        console.log(error);
    }

}


const actualizarPassword = async (req, res) => {
    const { id } = req.usuario;
    const { pwd_actual, pwd_nuevo } = req.body;

    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
        const error = new Error('El usuario no existe!');
        return res.status(404).json({ msg: error.message, error: true });
    }

    // Comprobar su password //
    const compararPassword = await bcrypt.compare(pwd_actual, usuario.password);

    if (!compararPassword) {
        const error = new Error('Contraseña incorrecta!');
        return res.status(403).json({ msg: error.message, error: true });
    }

    usuario.password = encryptarPassword(pwd_nuevo);
    await usuario.save();

    res.json({ msg: 'Contraseña actualizada correctamente!', error: false });

}

const activarDesactivarCuenta = async (req, res) => {
    const { id } = req.usuario;

    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
        const error = new Error('El usuario no existe!');
        return res.status(404).json({ msg: error.message, error: true });
    }

    if (usuario.confirmar) {
        usuario.confirmar = false;
    } else {
        usuario.confirmar = true;
    }

    usuario.save();
    console.log(usuario.confirmar)
    res.json({ msg: usuario.confirmar });
}


module.exports = { registrar, autenticar, confirmar, olvidePassword, comprobarToken, nuevoPassword, perfil, googleSingIn, actualizarPerfil, actualizarPassword, activarDesactivarCuenta }