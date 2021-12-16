const bcrypt = require('bcrypt')
const service = require('./authService')

const isAuthenticated = (req, res, next) => {
    if (req.user)
        res.redirect('/');
    next();
}

const login = (req, res) => {
    res.render('auth/login', { title: 'Login', style: 'login.css', message: req.flash('error') });
}

const registerPage = (req, res) => {
    res.render('auth/register', { title: 'Register', style: 'login.css', message: req.flash('error') });
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
        return res.redirect('/auth/register');
    }    
    const hashPassword = bcrypt.hashSync(password, 10);
    const newAccount = {
        firstname, lastname, username, email,
        phone, birthday, hashPassword
    }
    await service.createUser(newAccount);
    res.redirect('/auth/login');
}

module.exports = {
    isAuthenticated,
    login,
    registerPage,
    register
}