const express = require('express');
const cors = require('cors');
const db = require('./db/config');

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;


        this.dbConnection();
        this.middlewares();
        this.routes();
        this.listen();
    }

    async dbConnection() {
        try {
            require('./models/Usuario');
            require('./models/Proyecto');
            await db.sync();
            console.log('Connection has been established successfully.');
        } catch (error) {
            console.error('Unable to connect to the database:', error);
        }
    }

    middlewares() {
        this.app.use(express.json());
        this.app.use(express.static('public'));
        this.app.use(express(cors()));
    }

    routes() {
        this.app.use('/api/usuarios', require('./routes/usuarioRoutes'));
        this.app.use('/api/proyectos', require('./routes/proyectoRoutes'));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`http://localhost:${this.port}/api`);
        });
    }

}

module.exports = Server;