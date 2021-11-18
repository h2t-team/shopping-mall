const express = require('express');
const router = express.Router();

const controller = require('./cartController')

router.get('/', controller.page);

module.exports = router;