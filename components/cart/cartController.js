const page = (req, res, next) => {
    res.render('cart/cart', { title: 'Cart', style: 'cart.css' });
}

module.exports = {page}