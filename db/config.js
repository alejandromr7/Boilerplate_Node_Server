const { Sequelize } = require('sequelize');

const db = new Sequelize(process.env.DB, process.env.USER, process.env.PASSWORD, {
    host: process.env.HOST,
    dialect: process.env.DIALECT,

    define: {
        timestamps: false
    },

    logging: false,
    native: true,
    ssl: true,
});

module.exports = db;