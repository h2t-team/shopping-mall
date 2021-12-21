const express = require('express');
const router = express.Router();
const controller = require('./profileController');

router.get('/', controller.profile);
router.post('/', controller.update);
router.get('/address', controller.getAddresses);
router.get('/address/add', controller.addAddressPage);
router.post('/address/add', controller.addAddress);
router.get('/changePassword', controller.changePasswordPage);
router.post('/changePassword', controller.changePassword);
module.exports = router;