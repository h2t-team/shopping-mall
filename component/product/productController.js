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
        title: 'Shop',
        products, 
        category, 
        page, 
        catOption
    });
}

const detail = async (req, res) => {
    try{
        const [detail, topRate, size, image] = await Promise.all([
                service.detail(req.params.id),
                service.topRate(),
                service.size(req.params.id),
                service.image(req.params.id)
            ]);
        res.render('product/productDetail', { 
            title: detail.name, 
            detail, 
            topRate, 
            size,
            image });
    }catch(err){
        
    }
}

module.exports = {
    list,
    detail
}

