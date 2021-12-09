const { Op } = require("sequelize");
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
            attributes: ['image_url'],
            duplicating: false,
        }],
        offset: page * perPage,
        limit: perPage,
        raw: true,
        group: ['product.id']
    });
}

const byCategory = (id, page = 0, perPage = 9) => {
    return models.product.findAndCountAll({
        include: [{
            model: models.category,
            as: 'category',
            attributes: ['name'],
            where: {
                [Op.or]: [
                    { id: id },
                    { 'parent_id': id }
                ]
            }
        },
        {
            model: models.product_image,
            as: 'product_images',
            attributes: ['image_url'],
            duplicating: false,
        }],
        offset: page * perPage,
        limit: perPage,
        group: ['product.id'],
        raw: true
    });
}

const topRate = () => {
    return models.product.findAll({
        include: [{
            model: models.product_image,
            as: 'product_images',
            attributes: ['image_url']
        }],
        where: {
            'rate': 5
        },
        limit: 9,
        duplicating: false,
        required: true,
        group: ['product.id'],
        raw: true
    });
}

const detail = id => {
    return models.product.findByPk(id, {
        include: [{
            model: models.category,
            as: 'category',
            attributes: ['name']
        },
        {
            model: models.product_image,
            as: 'product_images',
            attributes: ['image_url'],
            duplicating: false
        }],
        raw: true
    })
}

const size = id => {
    return models.product_size.findAll({
        where: {
            'product_id': id
        },
        attributes: ['size', 'quantity'],
        raw: true
    })
}

const image = id => {
    return models.product_image.findAll({
        raw: true,
        where: { 'product_id': id },
        offset: 1
    })
}

module.exports = {
    all,
    category,
    byCategory,
    topRate,
    detail,
    size,
    image
}