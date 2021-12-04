const express = require('express');
const router = express.Router();

// require Router
const homeRouter = require('../component/homepage');
const productRouter = require('../component/product');
const authRouter = require('../component/auth');
const cartRouter = require('../component/cart');
const orderRouter = require('../component/order');
const profileRouter = require('../component/profile');

//Route
router.use('/', homeRouter);
router.use('/product', productRouter);
router.use('/auth', authRouter);
router.use('/cart', cartRouter);
router.use('/order', orderRouter);
router.use('/profile', profileRouter);

module.exports = router;