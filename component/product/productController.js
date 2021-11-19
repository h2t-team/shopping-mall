const service = require('./productService')

const list = async (req,res) => {
    const page = !Number.isNaN(req.query.page) && req.query.page > 0 ? req.query.page : 1; 
    const products = await service.all(page-1);
    res.render('product/productList', { title: 'Shop', products});
}

const detail = (req,res) => {
    res.render('product/productDetail', { title: 'Detail' });
}
module.exports = {
    list,
    detail
}

