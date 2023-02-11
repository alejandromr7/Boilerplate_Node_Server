
const getUser = async (req, res) => {
    res.json({ msg: 'get API' });
}

const postUser = async (req, res) => {
    const body = req.body;
    res.json(body);
}

const putUser = async (req, res) => {
    const { q, nombre, apikey } = req.query;
    res.json({ q, nombre, apikey });
}

const deleteUser = async (req, res) => {
    res.json({ msg: 'delete API' });
}


module.exports = { getUser, postUser, putUser, deleteUser }