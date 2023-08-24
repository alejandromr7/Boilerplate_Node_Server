const express = require('express');
const cors = require('cors');
const { Server } = require("socket.io");
const db = require('./db/config');
var ip = require('ip');
var path = require('path');

class Servidor {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.servidor = '';


        this.dbConnection();
        this.middlewares();
        this.routes();
        this.listen();
    }

    async dbConnection() {
        try {
            require('./models/Usuario');
            require('./models/Proyecto');
            require('./models/Tarea');
            await db.sync();
            console.log('Connection has been established successfully.');
        } catch (error) {
            console.error('Unable to connect to the database:', error);
        }
    }

    middlewares() {
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.static('public'));
    }

    routes() {
        this.app.use('/api/usuarios', require('./routes/usuarioRoutes'));
        this.app.use('/api/proyectos', require('./routes/proyectoRoutes'));
        this.app.use('/api/tareas', require('./routes/tareaRoutes'));


        this.app.get('*', (req, res) => {
            res.sendFile(path.resolve(__dirname, 'public/index.html'));

        });
    }

    listen() {
        const servidor = this.servidor = this.app.listen(this.port, () => {
            console.log(`http://localhost:${this.port}/api`);
        });

        const io = new Server(servidor, {
            pingTimeout: 60000,
            cors: 'http://localhost:3000/'
        });

        io.on("connection", socket => {
            console.log('Socket de tareas');
            // Definir los eventos de scoket io //
            socket.on('abrir proyecto', proyecto => {
                socket.join(proyecto)
            })

            socket.on('nueva tarea', (tarea) => {
                const { proyectoId } = tarea;

                io.to(proyectoId).emit('tarea agregada', tarea);
            })

        });

    }

}

module.exports = Servidor;