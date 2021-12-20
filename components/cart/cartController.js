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
                total
            });
        } catch (err) {
            console.log(err);
        }
    } else {
        res.redirect('/auth/login')
    }
}

const addToCart = async (req, res) => {
    const user = req.user;
    try {
        if (user) {
            const { productId, size, quantity, total } = req.body;
            const product = await service.findInCart(user.id, productId, size);
            if (product) {
                const newQty = product.quantity + quantity;
                const newTotal = product.total * newQty / product.quantity;
                await service.updateCart(user.id, productId, size, newQty, newTotal);
                res.status(200).json({ success: 'success' });
            }else{
                await service.addToCart(user.id, productId, size, quantity, total);
                res.status(201).json({ success: 'success' });
            }
        } else {
            res.status(401).json({ message: 'No Authenticate' });
        }
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}

const updateCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const data = req.body.data;
        await Promise.all(data.map(item => {
            const { productId, size, quantity, total } = item;
            return service.updateCart(userId, productId, size, quantity, total);
        }));
        res.status(200).json({ success: 'success' });
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}

const deleteFromCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const productId = req.body.productId;
        await service.deleteFromCart(userId, productId);
        res.status(200).json({ success: 'success' });
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}

module.exports = {
    page,
    cart,
    addToCart,
    updateCart,
    deleteFromCart
}