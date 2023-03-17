const Proyecto = require("../models/Proyecto");
const Tarea = require("../models/Tarea");


const obtenerProyectos = async (req, res) => {
    const { id: usuarioId } = req.usuario;
    const proyectos = await Proyecto.findAll({ where: { usuarioId } });
    res.json(proyectos);
}

const nuevoProyecto = async (req, res) => {
    const { id } = req.usuario;
    const proyecto = req.body;

    proyecto.usuarioId = id;


    try {
        const proyectoAlmacenado = await Proyecto.create(proyecto);
        res.json(proyectoAlmacenado);
    } catch (error) {
        console.log(error);
    }
}


const obtenerProyecto = async (req, res) => {
    const { id } = req.params;

    const proyecto = await Proyecto.findByPk(id);

    if (!proyecto) {
        return res.status(404).json({ msg: 'No encontrado' });
    }

    console.log(proyecto.usuarioId, req.usuario.id);

    if (proyecto.usuarioId !== req.usuario.id) {
        const error = new Error('No tienes acceso a este recurso');
        return res.status(401).json({ msg: error.message, error: true });
    }

    // Obtener tareas del proyecto //
    const tareas = await Tarea.findAll({ where: { proyectoId: proyecto.id } });

    res.json({ proyecto, tareas });
}

const editarProyecto = async (req, res) => {
    const { id } = req.params;

    const proyecto = await Proyecto.findByPk(id);

    if (!proyecto) {
        return res.status(404).json({ msg: 'No encontrado' });
    }

    console.log(proyecto.usuarioId, req.usuario.id);

    if (proyecto.usuarioId !== req.usuario.id) {
        const error = new Error('No tienes acceso a este recurso');
        return res.status(401).json({ msg: error.message, error: true });
    }

    proyecto.nombre = req.body.nombre || proyecto.nombre;
    proyecto.descripcion = req.body.descripcion || proyecto.descripcion;
    proyecto.cliente = req.body.cliente || proyecto.cliente;

    try {
        const proyectoAlmacenado = await proyecto.save();
        res.json(proyectoAlmacenado);
    } catch (error) {
        console.log(error);
    }
}

const eliminarProyecto = async (req, res) => {
    const { id } = req.params;

    const proyecto = await Proyecto.findByPk(id);

    if (!proyecto) {
        return res.status(404).json({ msg: 'No encontrado' });
    }


    if (proyecto.usuarioId !== req.usuario.id) {
        const error = new Error('No tienes acceso a este recurso');
        return res.status(401).json({ msg: error.message, error: true });
    }

    await proyecto.destroy();
    res.json({ msg: 'Proyecto eliminado correctamente' });
}

const agregarColaborador = async (req, res) => {

}

const eliminarColaborador = async (req, res) => {

}

module.exports = { obtenerProyectos, obtenerProyecto, nuevoProyecto, editarProyecto, eliminarProyecto, agregarColaborador, eliminarColaborador }