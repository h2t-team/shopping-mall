const productService = require('../product/productService');

const home = async (req, res, next) => {
    try {
        const trendings = await productService.topRate();
        const bestSellers = await productService.bestSeller();    
        res.render('homepage/home', { title: 'Homepage', style: 'homepage.css', trendings, bestSellers});
    }
    catch (err) {
        console.log(err.message)
    }
}

module.exports = {home};