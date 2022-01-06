const service = require('./productService')

const list = async (req, res) => {
    const url = req.url;

    //get params
    const page = !Number.isNaN(req.query.page) && req.query.page > 0 ? Number.parseInt(req.query.page) : 1;
    let catOption = req.query.category && !Number.isNaN(req.query.category) && req.query.category > 0 ? Number.parseInt(req.query.category) : '';
    const priceOption = req.query.price ? req.query.price : '';
    const ratingOption = req.query.rating && !Number.isNaN(req.query.rating) && req.query.rating > 0 ? Number.parseInt(req.query.rating) : 0;
    const keyword = req.query.keyword ? req.query.keyword : '';
    const sortOption = req.query.sort ? req.query.sort : 'default';

    //request from dtb
    const category = await service.category();
    let products;
    if (catOption || priceOption || ratingOption || sortOption) {
        // price
        let priceValue;
        if (priceOption) {
            priceValue = priceOption.split('-').map(item => parseInt(item));
        }
        else {
            priceValue = [0, 10000000];
        }
        products = await service.byFilter(catOption, priceValue, ratingOption, keyword, sortOption, page - 1);
    }
    else {
        products = keyword ? await service.byKeyword(keyword, page - 1) : await service.all(page - 1);
        catOption = 0;
    }
    res.render('product/productList', {
        title: 'TiMa Shop',
        style: 'productlist.css',
        products,
        category,
        page,
        catOption,
        sortOption,
        priceOption,
        ratingOption,
        keyword,
        url,
        scripts: ['searchProduct.js']
    });
}

const detail = async(req, res) => {
    try {
        const [detail, size, image] = await Promise.all([
            service.detail(req.params.id),
            service.size(req.params.id),
            service.image(req.params.id)
        ]);
        const related = await service.byCategory(detail['category_id']);
        res.render('product/productDetail', {
            title: detail.name,
            style: 'detail.css',
            scripts: ['productRate.js', 'addToCart.js'],
            detail,
            related: related.rows,
            size,
            image
        });
    } catch (err) {
        console.log(err);
    }
}

const addRate = async(req, res) => {
    try {
        const { rate, content } = req.body;
        const userId = req.user.id;
        const productId = req.params.id;
        const newRating = await service.addRate({ userId, productId, rate, content });
        const avg = await service.getAVGRate(productId);
        await service.updateProductRate(avg.avgRate, productId);
        res.status(201).json(newRating);
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

const getRate = async(req, res) => {
    try {
        const productId = req.params.id;
        const product = await service.detail(productId);
        const page = !Number.isNaN(req.query.page) && req.query.page > 0 ? Number.parseInt(req.query.page) : 1;
        const limit = !Number.isNaN(req.query.size) && req.query.size > 0 ? Number.parseInt(req.query.size) : 3;
        const offset = page == 1 ? 0 : (page - 1) * limit;
        const rates = await service.getRate(productId, offset, limit);
        const totalPages = Math.ceil(rates.count / limit);
        const response = {
            total: rates.count,
            totalPages,
            pageNumber: page,
            pageSize: rates.rows.length,
            rates: rates.rows,
            overall: product.rate,
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

module.exports = {
    list,
    detail,
    addRate,
    getRate
}