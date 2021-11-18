const express = require('express');
const router = express.Router();

const controller = require('./orderController')

router.get('/checkout', controller.checkout);
router.get('/confirm', controller.confirm);

module.exports = router;