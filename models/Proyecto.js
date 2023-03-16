const { Sequelize } = require('sequelize');
const db = require('../db/config');
const fechaActual = require('../helpers/fecha');
const Usuario = require('./Usuario');

const Proyecto = db.define('proyectos', {

    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    nombre: {
        type: Sequelize.STRING,
        require: true
    },

    descripcion: Sequelize.STRING,

    fechaEntrega: {
        type: Sequelize.STRING,
        defaultValue: fechaActual()
    },

    cliente: Sequelize.STRING
});

Usuario.hasMany(Proyecto);

module.exports = Proyecto;