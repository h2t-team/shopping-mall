const express = require('express');
const router = express.Router();

const controller = require('./cartController')

router.get('/', controller.cart);
router.post('/update',controller.updateCart);
module.exports = router;