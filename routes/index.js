const express = require('express');
const router = express.Router();

// require Router
const homeRouter = require('../components/homepage');
const productRouter = require('../components/product');
const authRouter = require('../components/auth');
const cartRouter = require('../components/cart');
const orderRouter = require('../components/order');
const profileRouter = require('../components/profile');

//Route
router.use('/', homeRouter);
router.use('/product', productRouter);
router.use('/auth', authRouter);
router.use('/cart', cartRouter);
router.use('/order', orderRouter);
router.use('/profile', profileRouter);

module.exports = router;