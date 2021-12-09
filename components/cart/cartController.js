const page = (req, res, next) => {
    res.render('cart/cart', { title: 'Cart' });
}

module.exports = {page}