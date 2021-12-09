const express = require('express');
const router = express.Router();
const controller = require('./profileController');

router.get('/', controller.profile)

module.exports = router;