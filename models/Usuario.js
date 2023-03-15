const { Sequelize } = require('sequelize');
const bcrypt = require('bcrypt');
const db = require('../db/config');
const generarId = require('../helpers/generarId');

const Usuario = db.define('usuarios', {

    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    nombre: Sequelize.STRING,
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: {
            args: true,
            msg: 'Usuario ya registrado'
        },
        validate: {
            isEmail: {
                msg: 'Agrega un correo valido'
            }
        }
    },
    password: Sequelize.STRING,

    token: {
        type: Sequelize.STRING,
        defaultValue: generarId()
    },

    confirmar: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
    }

}, {
    hooks: {
        beforeCreate(usuario) {
            usuario.password = bcrypt.hashSync(usuario.password, bcrypt.genSaltSync(10));
        }
    }
});

module.exports = Usuario;