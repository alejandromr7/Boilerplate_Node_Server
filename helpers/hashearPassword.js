const bcrypt = require('bcrypt');

const encryptarPassword = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

module.exports = encryptarPassword;