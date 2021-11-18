module.exports.list = (req,res) => {
    res.render('product/productList', { title: 'Shop' });
}

module.exports.detail = (req,res) => {
    res.render('product/productDetail', { title: 'Detail' });
}