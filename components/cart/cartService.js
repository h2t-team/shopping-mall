const { Op } = require('sequelize');
const { models } = require('../../model');

const getCartById = id => {
    return models.cart.findAll({
        raw: true,
        where: {
            'customer_id': id
        },
        include: [{
            model: models.product,
            as: 'product',
            attributes: ['name', 'price'],
            include: [{
                model: models.product_image,
                as: 'product_images',
                attributes: ['image_url'],
                duplicating: false,
            }],
        }],
        group: ['product.id', 'size']
    })
}

const findInCart = (userId, productId, size) => {
    return models.cart.findOne({
        where: {
            [Op.and]: [
                { 'customer_id': userId },
                { 'product_id': productId },
                { size }
            ]
        },
        raw: true
    })
}
const addToCart = (userId, productId, size, quantity, total) => {
    return models.cart.create({
        'customer_id': userId,
        'product_id': productId,
        size,
        quantity,
        total,
    });
}
const updateCart = (userId, productId, size, quantity, total) => {
    return models.cart.update({
        quantity,
        total,
    }, {
        where: {
            [Op.and]: [
                { 'customer_id': userId },
                { 'product_id': productId },
                { size }
            ]
        }
    });
}

const deleteFromCart = (userId, productId, size) => {
    return models.cart.destroy({
        where: {
            [Op.and]: [
                { 'customer_id': userId },
                { 'product_id': productId },
                { size }
            ]
        }
    })
}

const clearCart = userId => {
    return models.cart.destroy({
        where: {
            'customer_id': userId
        }
    })
}

module.exports = {
    getCartById,
    findInCart,
    addToCart,
    updateCart,
    deleteFromCart,
    clearCart
}