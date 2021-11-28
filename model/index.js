const { Sequelize } = require('sequelize');
const initModels = require('./init-models');
const sequelize = new Sequelize(process.env.CLEARDB_DATABASE_URL);

module.exports = {
    sequelize,
    models: initModels(sequelize),
}