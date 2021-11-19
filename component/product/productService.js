const { models } = require('../../model');

const all = (page = 0, perPage = 9) => {
    return models.product.findAll({
        include: [{
            model: models.category,
            as: 'category',
            attributes: ['name']
        },
        {
            model: models.product_image,
            as: 'product_images',
            attributes: ['image_url']
        }],
        offset: page*perPage,
        limit: perPage,
        raw: true
    });
}

module.exports = {
    all
}