const { models } = require('../../model');

const category = () => {
    return models.category.findAll({
        raw: true
    })
}

const all = (page = 0, perPage = 9) => {
    return models.product.findAndCountAll({
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

const byCategory = (id, page = 0, perPage = 9) => {
    return models.product.findAndCountAll({
        where: {
            'category_id': id
        },
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

const detail = id => {
    return models.product.findByPk(id,{
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
        raw: true
    })
}
module.exports = {
    all,
    category,
    byCategory,
    detail
}