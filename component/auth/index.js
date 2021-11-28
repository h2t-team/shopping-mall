const express = require('express');
const router = express.Router();
const passport = require('../../auth/passport');
const controller = require('./authController')

router.get('/login', controller.login);
router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/auth/login',
}));
router.get('/register', controller.regist);

module.exports = router;