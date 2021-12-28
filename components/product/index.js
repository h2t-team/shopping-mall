const express = require('express');
const router = express.Router();

const controller = require('./productController')


router.get('/', controller.list);

router.get('/:id/rate',controller.getRate);
router.post('/:id/rate',controller.addRate);

router.get('/search', controller.search);

router.get('/:id', controller.detail);
module.exports = router;