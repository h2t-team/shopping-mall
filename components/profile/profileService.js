const { models } = require('../../model');

const update = (userId, {firstname, lastname, birthday, url}) =>{
    return models.customer.update({
        'first_name': firstname,
        'last_name': lastname,
        dob: birthday
    }, {
        where: {
            id: userId
        }
    })
}

const updateWithImg = (userId, {firstname, lastname, birthday, url}) =>{
    return models.customer.update({
        'first_name': firstname,
        'last_name': lastname,
        dob: birthday,
        avatar: url
    }, {
        where: {
            id: userId
        }
    })
}

const updatePass = (userId, hashPass) => {
    return models.customer.update({
        password: hashPass
    }, {
        where: {
            id: userId
        }
    })
}

const getAddresses = userId => {
    return models.receiver_address.findAll({
        raw: true,
        where: {
            'customer_id': userId
        }
    })
}

module.exports = {
    update,
    updateWithImg,
    updatePass,
    getAddresses
}