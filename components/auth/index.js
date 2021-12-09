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
router.get('/logout',(req, res) => {
    req.logout();
    res.redirect('/');
  });
router.get('/register', controller.isAuthenticated, controller.registerPage);
router.post('/register', controller.register);

module.exports = router;