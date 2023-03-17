const { Sequelize } = require('sequelize');
const db = require('../db/config');
const fechaActual = require('../helpers/fecha');
const Proyecto = require('./Proyecto');

const Tarea = db.define('tareas', {

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
    estado: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },

    fechaEntrega: {
        type: Sequelize.STRING,
        defaultValue: fechaActual()
    },

    prioridad: Sequelize.STRING,
});

//Tarea.belongsTo(Proyecto)
Proyecto.hasMany(Tarea);

module.exports = Tarea;