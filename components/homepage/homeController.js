const productService = require('../product/productService');

const home = async (req, res, next) => {
    try {
        const trendings = await productService.topRate();
        const bestSellers = await productService.bestSeller(); 
        res.render('homepage/home', { title: 'Homepage', style: 'homepage.css', trendings, bestSellers});
    }
    catch (err) {
        res.status(500).send({ messeage: 'Error'});

    }
}

module.exports = {home};