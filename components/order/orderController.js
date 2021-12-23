const cartService = require('../cart/cartService');
const profileService = require('../profile/profileService');
const orderService = require('./orderService');

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
                scripts: ['order.js'],
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

const createOrder = async (req, res) => {
    const user = req.user;
    if (user) {
        const { receiverId, total, note } = req.body;
        const order = await orderService.createOrder(user.id, receiverId, total, note);
        if (order) {
            const data = req.body.data;
            const detail = await Promise.all(data.map(item => {
                const { productId, size, quantity, total } = item;
                return orderService.createOrderDetail(order.dataValues.id, productId, size, quantity, total);
            }));
            if (detail) {
                await cartService.clearCart(user.id);
                res.status(200).json({ order, detail });
            }
        }
    } else {
        res.redirect('/auth/login')
    }
}

const confirm = async (req, res, next) => {
    const user = req.user;
    if (user) {
        const orderId = req.params.id;
        const [order, detail] = await Promise.all([
            orderService.getOrder(orderId),
            orderService.getOrderDetail(orderId)
        ]);
        const totalWOShip = order.total - 15000;
        res.render('order/confirmation', {
            title: 'Confirmation',
            style: 'confirmation.css',
            order,
            totalWOShip,
            detail
        });
    }
    else {
        res.redirect('/auth/login')
    }
}

const orders = async (req, res) => {
    const user = {id: 'c13b50cf-6d5a-4816-ab11-e4c0b59fad35'};//req.user;
    if(user){
        const orders = await orderService.getOrders(user.id);
        res.render('order/orderList', {title: 'My Order',style: 'order.css', orders})
    }else{
        res.redirect('/auth/login')
    }
}

module.exports = {
    checkout,
    createOrder,
    orders,
    confirm
}