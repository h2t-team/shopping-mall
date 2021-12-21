const cartService = require('../cart/cartService');
const profileService = require('../profile/profileService');

const checkout = async (req, res, next) => {
    const user = req.user;
    if (user) {
        try {
            const [product, address] = await Promise.all([ 
                cartService.getCartById(user.id),
                profileService.getAddresses(user.id)
            ]);
            const firstAddress = address[0];
            const otherAddress = address.slice(1);
            const total = product.reduce((prev, cur) => {
                return cur.total + prev;
            }, 0);
            const totalWithShip = total + 15000;
            res.render('order/checkout', {
                title: 'Checkout',
                style: 'checkout.css',
                scripts: ['cart.js'],
                firstAddress,
                otherAddress,
                product,
                total,
                totalWithShip
            });
        } catch (err) {
            console.log(err);
        }
    } else {
        res.redirect('/auth/login')
    }
}

const confirm = (req, res, next) => {
    res.render('order/confirmation', { title: 'Confirmation', style: 'confirmation.css' });
}

module.exports = {
    checkout,
    confirm
}