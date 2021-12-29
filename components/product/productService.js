const sequelize = require("sequelize");
const { models } = require('../../model');
const Op = sequelize.Op;

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

const topRate = (perPage = 8) => {
    return models.product.findAll({
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
        where: {
            rate: 5
        },
        limit: perPage,
        raw: true,
        group: ['product.id']
    });
}

const bestSeller = (perPage = 4) => {
    return models.product.findAll({
        attributes: [
            'id',
            'name',
            'price',
            'rate',
        ],
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
        }, 
    ],
        limit: perPage,
        raw: true,
        group: ['id'],
        order: [
            ['rate', 'DESC']
        ]
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
            'product_id': id,
            quantity: { [Op.not]: 0 }
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

const addRate = ({ userId, productId, rate, content }) => {
    return models.feedback.create({
        'customer_id': userId,
        'product_id': productId,
        rate,
        content,
        'created_at': Date.now()
    })
}

const getRate = (productId, offset, limit) => {
    return models.feedback.findAndCountAll({
        raw: true,
        offset,
        limit,
        order: [
            ['created_at', 'DESC']
        ],
        where: {
            'product_id': productId
        },
        include: {
            model: models.customer,
            as: 'customer',
            attributes: ['first_name', 'last_name', 'avatar']
        }
    })
}


const getAVGRate = productId => {
    return models.feedback.findOne({
        raw: true,
        where: {
            'product_id': productId
        },
        attributes: [[sequelize.fn('avg', sequelize.col('rate')), 'avgRate']]
    })
}

const updateProductRate = (rate, productId) => {
    return models.product.update({
        rate
    },{
        where: {
            id: productId
        }
    })
}

module.exports = {
    all,
    category,
    byCategory,
    topRate,
    detail,
    size,
    image,
    addRate,
    getRate, 
    bestSeller,
    getAVGRate,
    updateProductRate
}