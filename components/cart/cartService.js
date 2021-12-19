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
        group: ['product.id']
    })
}

const updateCart = (userId, productId, quantity, total) => {
    return models.cart.update({
        quantity,
        total
    }, {
        where: {
            [Op.and]: [
                { 'customer_id': userId },
                { 'product_id': productId }
            ]
        }
    });
}

const deleteFromCart = (userId, productId) => {
    return models.cart.destroy({
        where: {
            [Op.and]: [
                { 'customer_id': userId },
                { 'product_id': productId }
            ]
        }
    })
}
module.exports = {
    getCartById,
    updateCart,
    deleteFromCart
}