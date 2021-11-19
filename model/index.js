const { Sequelize } = require('sequelize');
const initModels = require('./init-models');
const sequelize = new Sequelize(process.env.DB_DTB, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
});

module.exports = {
    sequelize,
    models: initModels(sequelize),
}