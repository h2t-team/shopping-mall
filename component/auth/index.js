const express = require('express');
const router = express.Router();

const controller = require('./authController')

router.get('/login', controller.login);
router.get('/register', controller.regist);

module.exports = router;