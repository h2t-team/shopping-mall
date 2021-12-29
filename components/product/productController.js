const service = require('./productService')

const list = async (req, res) => {
    //get params
    const page = !Number.isNaN(req.query.page) && req.query.page > 0 ? Number.parseInt(req.query.page) : 1;
    const catOption = !Number.isNaN(req.query.category) && req.query.category > 0 ? Number.parseInt(req.query.category) : 0;
    //request from dtb
    const category = await service.category();
    const products = catOption ? await service.byCategory(catOption, page - 1) : await service.all(page - 1);
    res.render('product/productList', {
        title: 'TiMa Shop',
        style: 'productlist.css',
        products,
        category,
        page,
        catOption,
        scripts: ['searchProduct.js']
    });
}

const search = async (req, res) => {
    try {
        const page = !Number.isNaN(req.query.page) && req.query.page > 0 ? Number.parseInt(req.query.page) : 1; 
        const keyword = req.query.keyword;
        const catOption = !Number.isNaN(req.query.category) && req.query.category > 0 ? req.query.category : '';
        console.log(req.query);
    
        //request from dtb
        const category = await service.category();
        const products = await service.search(catOption, keyword, page - 1);
        
        console.log(products);
        res.render('product/productList', { 
            title: 'Shop', 
            products, 
            category, 
            page, 
            catOption, 
            keyword, 
            style: 'productlist.css', 
            scripts: ['searchProduct.js'] });
    }
    catch (err) {
        console.log(err);
    }
}

const detail = async (req, res) => {
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

const addRate = async (req, res) => {
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

const getRate = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await service.detail(productId);
        const page = !Number.isNaN(req.query.page) && req.query.page > 0 ? Number.parseInt(req.query.page) : 1;
        const limit = !Number.isNaN(req.query.size) && req.query.size > 0 ? Number.parseInt(req.query.size) : 3;
        const offset = page == 1 ? 0 : (page-1) * limit;
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
    search,
    detail,
    addRate,
    getRate
}

