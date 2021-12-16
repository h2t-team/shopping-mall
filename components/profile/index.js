const express = require('express');
const router = express.Router();
const controller = require('./profileController');

router.get('/', controller.profile);
router.post('/', controller.update);
router.get('/changePassword', controller.changePasswordPage);
router.post('/changePassword', controller.changePassword);
module.exports = router;