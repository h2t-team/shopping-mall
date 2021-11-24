const { Sequelize } = require('sequelize');
const initModels = require('./init-models');
const sequelize = new Sequelize(process.env.DB_URL);

module.exports = {
    sequelize,
    models: initModels(sequelize),
}