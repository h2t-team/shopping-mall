const express = require('express');
const router = express.Router();

const controller = require('./cartController')

router.get('/', controller.cart);
router.post('/update',controller.updateCart);
router.post('/delete', controller.deleteFromCart);
module.exports = router;