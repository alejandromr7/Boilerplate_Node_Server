const Proyecto = require("../models/Proyecto");
const Tarea = require("../models/Tarea");
const Usuario = require("../models/Usuario");


const obtenerProyectos = async (req, res) => {
    const { id: usuarioId } = req.usuario;
    const proyectos = await Proyecto.findAll({ where: { usuarioId } });
    // const proyectos = await Proyecto.findAll({
    //     include: [{
    //         model: Tarea
    //     }],
    //     where: { usuarioId }
    // });
    res.json(proyectos);
}

const nuevoProyecto = async (req, res) => {
    const { id } = req.usuario;
    const proyecto = req.body;

    proyecto.usuarioId = id;

    console.log(proyecto.fechaEntrega);

    try {
        const proyectoAlmacenado = await Proyecto.create(proyecto);
        res.json(proyectoAlmacenado);
    } catch (error) {
        console.log(error);
    }
}


const obtenerProyecto = async (req, res) => {
    const { id } = req.params;

    const proyecto = await Proyecto.findByPk(id, {
        include: [{
            model: Tarea
        }]
    });

    if (!proyecto) {
        return res.status(404).json({ msg: 'Proyecto no encontrado' });
    }

    if (proyecto.usuarioId !== req.usuario.id) {
        const error = new Error('No tienes acceso a este recurso');
        return res.status(401).json({ msg: error.message, error: true });
    }

    res.json(proyecto);
}

const editarProyecto = async (req, res) => {
    const { id } = req.params;

    const proyecto = await Proyecto.findByPk(id);

    if (!proyecto) {
        return res.status(404).json({ msg: 'Proyecto no encontrado' });
    }

    console.log(proyecto.usuarioId, req.usuario.id);

    if (proyecto.usuarioId !== req.usuario.id) {
        const error = new Error('No tienes acceso a este recurso');
        return res.status(401).json({ msg: error.message, error: true });
    }

    proyecto.nombre = req.body.nombre || proyecto.nombre;
    proyecto.descripcion = req.body.descripcion || proyecto.descripcion;
    proyecto.cliente = req.body.cliente || proyecto.cliente;
    proyecto.fechaEntrega = req.body.fechaEntrega || proyecto.fechaEntrega;

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
        return res.status(404).json({ msg: 'Proyecto no encontrado' });
    }


    if (proyecto.usuarioId !== req.usuario.id) {
        const error = new Error('No tienes acceso a este recurso');
        return res.status(401).json({ msg: error.message, error: true });
    }

    await proyecto.destroy();
    res.json({ msg: 'Proyecto eliminado correctamente' });
}

const buscarColaborador = async (req, res) => {
    const { email } = req.body;

    try {
        const usuario = await Usuario.findOne({ where: { email } });

        console.log(usuario);

        if (!usuario) {
            const error = new Error('Usuario no encontrado');
            return res.status(404).json({ msg: error.message, error: true });
        }

        res.json({
            id: usuario.id,
            nombre: usuario.nombre,
            email: usuario.email
        });
    } catch (error) {
        console.log(error);
    }
}

const agregarColaborador = async (req, res) => {
    const proyecto = await Proyecto.findByPk(req.params.id);

    if (!proyecto) {
        const error = new Error('Proyecto no encontrado');
        return res.status(404).json({ msg: error.message, error: true });
    }

    if (proyecto.usuarioId !== req.usuario.id) {
        const error = new Error('Accion no valida');
        return res.status(404).json({ msg: error.message, error: true });
    }


    const { email } = req.body;

    try {
        const usuario = await Usuario.findOne({ where: { email } });

        console.log(usuario);

        if (!usuario) {
            const error = new Error('Usuario no encontrado');
            return res.status(404).json({ msg: error.message, error: true });
        }

        // El colaborador no es el admin //
        if (proyecto.usuarioId === usuario.id) {
            const error = new Error('El creador del proyecto no puede ser colaborador');
            return res.status(401).json({ msg: error.message, error: true });
        }

    } catch (error) {
        console.log(error);
    }

}

const eliminarColaborador = async (req, res) => {

}

module.exports = { obtenerProyectos, obtenerProyecto, nuevoProyecto, editarProyecto, eliminarProyecto, agregarColaborador, eliminarColaborador, buscarColaborador }