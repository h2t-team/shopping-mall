const bcrypt = require('bcrypt')
const service = require('./authService')
const login = (req, res) => {
    res.render('auth/login', { title: 'Login', message: req.flash('error') });
}

const registerPage = (req, res) => {
    res.render('auth/register', { title: 'Register', message: req.flash('error') });
}

const register = async (req, res) => {
    //get params
    const { firstname,
        lastname,
        username,
        email,
        phone,
        birthday,
        password,
        confirm } = req.body;

    const user = await service.findUser({ username, email, phone });
    if (user) {
        req.flash('error', 'This account already exists.');
        res.redirect('/auth/register');
    }
    if (password != confirm) {
        req.flash('error', 'Confirm password does not match.');
        res.redirect('/auth/register');
    }
    const hashPassword = bcrypt.hashSync(password,10);
    await service.createUser({
        firstname, lastname, username, email,
        phone, birthday, hashPassword
    });
    res.redirect('/');
}

module.exports = {
    login,
    registerPage,
    register
}