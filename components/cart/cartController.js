const service = require('./cartService')

const page = (req, res, next) => {
    res.render('cart/cart', { title: 'Cart', style: 'cart.css' });
}

const cart = async (req, res) => {
    const user = req.user;
    if (user) {
        try {
            const product = await service.getCartById(user.id);
            const total = product.reduce((prev, cur) => {
                return cur.total + prev;
            }, 0);
            res.render('cart/cart', { 
                title: 'Cart', 
                style: 'cart.css', 
                scripts: ['cart.js'], 
                product, 
                total });
        } catch (err) {
            console.log(err);
        }
    } else {
        res.redirect('/auth/login')
    }
}
module.exports = {
    page,
    cart
}