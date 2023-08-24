const db = require("../db/config");
const Proyecto = require("../models/Proyecto");
const Tarea = require("../models/Tarea");


const agregarTarea = async (req, res) => {
    const { proyectoId } = req.body;

    const existeProyecto = await Proyecto.findOne({ where: { id: proyectoId } });

    // Validar si el proyecto existe //
    if (!existeProyecto) {
        const error = new Error('El proyecto no existe');
        return res.status(404).json({ msg: error.message });
    }

    // Si pertenece a la persona que creo el proyecto //
    if (existeProyecto.usuarioId !== req.usuario.id) {
        const error = new Error('No tienes permiso para agregar tareas');
        return res.status(401).json({ msg: error.message, error: true });
    }


    try {
        const { nombre, descripcion, fechaEntrega, prioridad, cliente } = req.body;
        const tareaAlmacenada = await Tarea.create({ nombre, descripcion, fechaEntrega, prioridad, cliente, proyectoId });
        res.json(tareaAlmacenada);
    } catch (error) {
        console.log(error);
    }

}

const obtenerTarea = async (req, res) => {
    const { id } = req.params;
    const [[tarea]] = await db.query(
        `SELECT * FROM tareas INNER JOIN proyectos ON proyectos.id=tareas.proyectoId WHERE tareas.id=${id}`
    );

    if (!tarea) {
        const error = new Error('No existe esta tarea');
        return res.status(404).json({ msg: error.message });
    }

    console.log(tarea.usuarioId, req.usuario.id);
    if (tarea.usuarioId !== req.usuario.id) {
        const error = new Error('Acción no válida');
        return res.status(403).json({ msg: error.message });
    }

    res.json(tarea);

}

const actualizarTarea = async (req, res) => {
    const { id } = req.params;
    const tarea = await Tarea.findByPk(id);

    if (!tarea) {
        const error = new Error('No existe esta tarea');
        return res.status(404).json({ msg: error.message });
    }

    const { proyectoId } = tarea;
    const existeProyecto = await Proyecto.findOne({ where: { id: proyectoId } });

    console.log(existeProyecto.usuarioId, req.usuario.id);
    if (existeProyecto.usuarioId !== req.usuario.id) {
        const error = new Error('Accion no valida');
        return res.status(403).json({ msg: error.message });
    }

    tarea.nombre = req.body.nombre || tarea.nombre;
    tarea.descripcion = req.body.descripcion || tarea.descripcion;
    tarea.prioridad = req.body.prioridad || tarea.prioridad;
    tarea.fechaEntrega = req.body.fechaEntrega || tarea.fechaEntrega;

    try {
        const tareaAlmacenada = await tarea.save();
        res.json(tareaAlmacenada)
    } catch (error) {
        console.log(error);
    }
}

const eliminarTarea = async (req, res) => {
    const { id } = req.params;
    const tarea = await Tarea.findByPk(id);

    if (!tarea) {
        const error = new Error('No existe esta tarea');
        return res.status(404).json({ msg: error.message });
    }

    const { proyectoId } = tarea;
    const existeProyecto = await Proyecto.findOne({ where: { id: proyectoId } });

    console.log(existeProyecto.usuarioId, req.usuario.id);
    if (existeProyecto.usuarioId !== req.usuario.id) {
        const error = new Error('Accion no valida');
        return res.status(403).json({ msg: error.message });
    }

    await tarea.destroy();
    res.json({ msg: 'Tarea eliminada corractamente' });


}

const cambiarEstado = async (req, res) => {

}


module.exports = { agregarTarea, obtenerTarea, actualizarTarea, eliminarTarea, cambiarEstado }