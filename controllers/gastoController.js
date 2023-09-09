const { Op } = require('sequelize');
const currentWeek = require('../helpers/currentWeek');
const Gasto = require('../models/Gasto');

const obtenerGastos = async (req, res) => {
    const { id } = req.usuario;
    const semana = currentWeek();

    try {
        const gastosSemanales = await Gasto.findAll({ where: { semana, usuario_id: id } });
        res.json(gastosSemanales);
    } catch (error) {
        console.log(error);
    }
}

const obtenerGastosPorRangos = async (req, res) => {
    const { id } = req.usuario;
    const { s1, s2 } = req.body;

    try {
        const gastosSemanales = await Gasto.findAll({ where: { semana: { [Op.between]: [s1, s2] }, usuario_id: id } });
        // const gastosSemanales = await Gasto.findAll({
        //     where: {
        //         semana: {
        //             [Op.or]: [{ [Op.between]: [s1, s2] }, semana]
        //         }
        //     }
        // });
        res.json(gastosSemanales);
    } catch (error) {
        console.log(error);
    }
}

const obtenerTotalSemanal = async (req, res) => {
    const { id: usuario_id } = req.usuario;
    const semana = currentWeek();

    try {
        const gastosSemanales = await Gasto.sum('costo', { where: { usuario_id, semana } }, { group: 'semana' });
        res.json({ totalSemanal: gastosSemanales });
    } catch (error) {
        console.log(error);
    }
}

const obtenerTotalSemanalPorRango = async (req, res) => {
    const { id: usuario_id } = req.usuario;
    const { s1, s2 } = req.body;

    try {
        const gastosSemanales = await Gasto.sum('costo', { where: { semana: { [Op.between]: [s1, s2] }, usuario_id } }, { group: 'semana' });
        res.json({ totalSemanal: gastosSemanales });
    } catch (error) {
        console.log(error);
    }
}

const crearGasto = async (req, res) => {
    const { id } = req.usuario;
    const gasto = req.body;

    // Modificando los valores del objeto Gasto //
    gasto.semana = currentWeek();
    gasto.usuario_id = id;

    try {
        const gastoAlmacenado = await Gasto.create(gasto);
        res.json(gastoAlmacenado);
    } catch (error) {
        console.log(error);
    }
}

const editarGasto = async (req, res) => {
    const { id } = req.params;
    const gasto = await Gasto.findByPk(id);

    if (!gasto) {
        return res.status(404).json({ msg: 'Lo sentimos, tú transacción no fué encontrada' });
    }

    console.log(req.usuario.id, gasto.usuario_id)
    if (req.usuario.id !== gasto.usuario_id) {
        return res.status(404).json({ msg: 'Lo sentimos, No tienes acceso a este recurso' });
    }

    // Modificar los valores del objeto //
    gasto.nombre = req.body.nombre || gasto.nombre;
    gasto.descripcion = req.body.descripcion || gasto.descripcion;
    gasto.prioridad = req.body.prioridad || gasto.prioridad;
    gasto.costo = req.body.costo || gasto.costo;

    try {
        await gasto.save();
        res.json({ msg: `Tú transacción ${gasto.id} ha sido actualida correctamente`, error: false });
    } catch (error) {
        console.log(error);
    }

}

const elimiarGasto = async (req, res) => {
    const { id } = req.params;
    const gasto = await Gasto.findByPk(id);

    if (!gasto) {
        return res.status(404).json({ msg: 'Lo sentimos, tú transacción no fué encontrada' });
    }

    console.log(req.usuario.id, gasto.usuario_id)
    if (req.usuario.id !== gasto.usuario_id) {
        return res.status(404).json({ msg: 'Lo sentimos, No tienes acceso a este recurso' });
    }

    try {
        await gasto.destroy();
        res.json({ msg: `Tú transacción ${gasto.id} ha sido eliminada correctamente`, error: false });
    } catch (error) {
        console.log(error);
    }

}


module.exports = { obtenerGastos, obtenerGastosPorRangos, obtenerTotalSemanal, obtenerTotalSemanalPorRango, crearGasto, editarGasto, elimiarGasto }