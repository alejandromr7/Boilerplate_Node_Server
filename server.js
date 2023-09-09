const express = require('express');
const cors = require('cors');
const { Server } = require("socket.io");
const db = require('./db/config');
var ip = require('ip');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');


const options = {
    definition: {
        openapi: "3.1.0",
        info: {
            title: "Expense Tracker",
            version: "0.1.0",
            description:
                "This is a simple CRUD API application made with Express and documented with Swagger",
            license: {
                name: "MIT",
                url: "https://spdx.org/licenses/MIT.html",
            },
            contact: {
                name: "Expense Tracker",
                url: "https://logrocket.com",
                email: "info@email.com",
            },
        },
        servers: [
            {
                url: "http://localhost:9000",
            },
        ],
    },
    apis: [`${path.join(__dirname, './routes/*.js')}`]
};

const swaggerSpec = swaggerJSDoc(options);

// const swaggerSpect = {
//     definition: {
//         openapi: '3.0.0',
//         info: {
//             title: 'Node Postgress API',
//             version: '1.0'
//         }
//     },
//     servers: [
//         { url: 'http://localhost:9000/api', description: 'http://localhost:9000/api' }
//     ]
// }

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
            require('./models/Gasto');
            await db.sync();
            console.log('Connection has been established successfully.');
        } catch (error) {
            console.error('Unable to connect to the database:', error);
        }
    }

    middlewares() {
        this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.static('public'));
    }

    routes() {
        this.app.use('/api/usuarios', require('./routes/usuarioRoutes'));
        this.app.use('/api/gastos', require('./routes/gastoRoutes'));


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