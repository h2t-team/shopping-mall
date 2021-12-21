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

const addAddress = (userId, receiver, tel, city, district, ward, address) => {
    return models.receiver_address.create({
        'customer_id': userId,
        'receiver_name': receiver,
        telephone: tel,
        city,
        ward,
        district,
        'specific_address': address
    })
}
module.exports = {
    update,
    updateWithImg,
    updatePass,
    getAddresses,
    addAddress
}