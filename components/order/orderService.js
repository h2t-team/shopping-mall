const { models } = require('../../model');
const { v4: uuidv4 } = require('uuid');

const createOrder = (userId, receiverId, total, note) => {
    return models.order.create({
        id: uuidv4(),
        'customer_id': userId,
        'receiver_address_id': receiverId,
        status: 'Prepairing',
        note,
        total,
        'created_at': Date.now()
    });
}

const createOrderDetail = (orderId, productId, size, quantity, total) => {
    return models.order_details.create({
        'order_id': orderId,
        'product_id': productId,
        size,
        quantity,
        price: total,
    });
}

const getOrder = orderId => {
    return models.order.findByPk(orderId, {
        raw: true,
        include: [{
            model: models.receiver_address,
            as: 'receiver_address',
        }]
    });
}

const getOrderDetail = orderId => {
    return models.order_details.findAll({
        raw: true,
        where: {
            'order_id': orderId
        },
        include: [{
            model: models.product,
            as: 'product'
        }]
    })
}

const getOrders = userId => {
    return models.order.findAll({
        raw: true,
        include: [{
            model: models.receiver_address,
            as: 'receiver_address',
        }],
        where: {
            'customer_id': userId
        }
    });
}

const cancelOrder = orderId => {
    return models.order.update({
        status: 'Cancel'
    }, {
        where: {
            id: orderId
        }
    })
}
module.exports = {
    createOrder,
    createOrderDetail,
    getOrder,
    getOrderDetail,
    getOrders,
    cancelOrder
}