const { Sequelize } = require('sequelize');
const initModels = require('./init-models');
const sequelize = new Sequelize(process.env.CLEARDB_DATABASE_URL);

// const sequelize = new Sequelize('estore', 'root', '1234', {
//     host: 'localhost',
//     dialect: 'mysql'
// });

module.exports = {
    sequelize,
    models: initModels(sequelize),
}