const service = require('./productService')

const list = async (req, res) => {
    //get params
    const page = !Number.isNaN(req.query.page) && req.query.page > 0 ? Number.parseInt(req.query.page) : 1;
    const catOption = !Number.isNaN(req.query.category) && req.query.category > 0 ? Number.parseInt(req.query.category) : 0;
    //request from dtb
    const category = await service.category();
    const products = catOption ? await service.byCategory(catOption, page - 1) : await service.all(page - 1);
    console.log(products);
    res.render('product/productList', {
        title: 'TiMa Shop',
        style: 'productlist.css',
        products,
        category,
        page,
        catOption
    });
}

const detail = async (req, res) => {
    try {
        const [detail, topRate, size, image] = await Promise.all([
            service.detail(req.params.id),
            service.topRate(),
            service.size(req.params.id),
            service.image(req.params.id)
        ]);
        res.render('product/productDetail', {
            title: detail.name,
            style: 'detail.css',
            detail,
            topRate,
            size,
            image
        });
    } catch (err) {

    }
}

const addRate = async (req, res) => {
    const { rate, content } = req.body;
    const userId = req.user.id;
    const productId = req.params.id;
    try{
        const newRating = await service.addRate({ userId, productId, rate, content });
        res.status(201).json(newRating);
    }catch(error){
        res.status(500).json({
            message: error.message
        })
    }
}

const getRate = async (req, res) => {
    const productId = req.params.id;
    try{
        const rates = await service.getRate(productId);
        res.status(201).json(rates);
    }catch(error){
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

