const { Sequelize } = require('sequelize');
const db = require('../db/config');
const fechaActual = require('../helpers/fecha');
const Usuario = require('./Usuario');

const Gasto = db.define('gastos', {

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

    prioridad: Sequelize.STRING,
    costo: Sequelize.INTEGER,

    fecha: {
        type: Sequelize.STRING,
        defaultValue: fechaActual()
    },

    semana: Sequelize.INTEGER

});

Usuario.hasMany(Gasto, { foreignKey: 'usuario_id' }, { onDelete: 'cascade', hooks: true });


module.exports = Gasto;