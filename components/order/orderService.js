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

module.exports = {
    createOrder,
    createOrderDetail
}