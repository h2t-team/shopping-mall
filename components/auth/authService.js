const { Op, DataTypes } = require("sequelize");
const { v4: uuidv4 } = require('uuid');
const { models } = require('../../model');

const findUser = ({ username, email, phone }) => {
    return models.customer.findOne({
        raw: true, where: {
            [Op.or]: [
                { username },
                { email },
                { telephone: phone }
            ]
        }
    })
}
const createUser = ({ firstname, lastname, username, email,
    phone, birthday, hashPassword }) => {
    return models.customer.create({
        id: uuidv4(),
        username,
        password: hashPassword,
        'first_name': firstname,
        'last_name': lastname,
        email,
        telephone: phone,
        dob: birthday,
        'created_at': Date.now()
    });
}
module.exports = {
    createUser,
    findUser
}
