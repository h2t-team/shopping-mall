const express = require('express');
const router = express.Router();

const controller = require('./orderController')

router.get('/', controller.orders);
router.get('/checkout', controller.checkout);
router.get('/confirm/:id', controller.confirm);
router.post('/create', controller.createOrder);
module.exports = router;