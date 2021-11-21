const service = require('./productService')

const list = async (req,res) => {
    const page = !Number.isNaN(req.query.page) && req.query.page > 0 ? req.query.page : 1; 
    const catOption = !Number.isNaN(req.query.category) && req.query.category > 0 ? req.query.category : 0;
    if(catOption){
        const products = await service.byCategory(catOption,page-1);
        const category = await service.category();
        res.render('product/productList', { title: 'Shop', products, category, page, catOption});
    }else{
        const products = await service.all(page-1);
        const category = await service.category();
        res.render('product/productList', { title: 'Shop', products, category, page, catOption});
    }
}

const detail = async (req,res) => {
    const detail = await service.detail(req.params.id);
    const topRate = await service.topRate();
    const size = await service.size(req.params.id);
    res.render('product/productDetail', { title: "", detail, topRate, size});
}

module.exports = {
    list,
    detail
}
