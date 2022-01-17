const express = require('express');
const router = express.Router();
const passport = require('../../auth/passport');
const controller = require('./authController')

router.get('/login', controller.isAuthenticated, controller.login);
router.post('/login', controller.checkVerification, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/auth/login',
    failureFlash: true,
}));
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

router.get('/register', controller.isAuthenticated, controller.registerPage);
router.post('/register', controller.register);
router.get('/verify-email', controller.verifyEmail);
router.post('/resend-email', controller.resendEmail);
router.get('/forgot-password', controller.forgotPasswordPage);
router.post('/forgot-password', controller.forgotPasswordForm);
router.get('/reset-password/:token', controller.resetPasswordPage);
router.post('/reset-password/:token', controller.resetPasswordForm);
router.get('/reset-password-success', controller.resetPasswordSuccess);
router.get('/google/callback', passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/auth/login',
    failureFlash: true,
}));

router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email'],
}), );
router.get('/facebook', passport.authenticate('facebook', {
    scope: ['email']
}));

router.get('/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect: '/',
        failureRedirect: '/auth/login',
        failureFlash: true,
    }));
module.exports = router;