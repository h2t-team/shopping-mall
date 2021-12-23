const express = require('express');
const router = express.Router();
const passport = require('../../auth/passport');
const controller = require('./authController')

router.get('/login', controller.isAuthenticated, controller.login);
router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/auth/login',
    failureFlash: true
}));
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});
router.post('/forgot-password', controller.sendLinkForgotPasswordToEmail);

router.get('/register', controller.isAuthenticated, controller.registerPage);
router.post('/register', controller.register);
router.get('/verify-email', controller.verifyEmail);
router.post('/forgot-password/:userid/:token', controller.resetPassword);
router.get('/forgot-password/:userid/:token', controller.forotPassword);
router.get('/resend-email', controller.resendEmail);



module.exports = router;