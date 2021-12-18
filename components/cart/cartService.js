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

module.exports = {
    getCartById
}