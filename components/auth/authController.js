const bcrypt = require('bcrypt')
const service = require('./authService')
const jwt = require('jsonwebtoken');
const profileService = require('../profile/profileService');
const { use } = require('passport');
const createHttpError = require('http-errors');
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
const register = async(req, res) => {
    //get params
    const {
        firstname,
        lastname,
        username,
        email,
        phone,
        birthday,
        password,
        confirm
    } = req.body;
    const user = await service.findUser({ username, email, phone });
    if (user) {
        req.flash('error', 'This account already exists.');
        return res.redirect('/auth/register');
    }
    const hashPassword = bcrypt.hashSync(password, 10);
    const newAccount = {
        firstname,
        lastname,
        username,
        email,
        phone,
        birthday,
        hashPassword
    }
    service.createUser(newAccount);
    // send active link to email
    const token = jwt.sign({ username, email, phone }, process.env.PRIVATE_KEY, { expiresIn: '20m' });
    try {
        service.sendVerificationEmail(email, token);
        res.render('auth/verify', { email: email, token: token })
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
}
const verifyEmail = async(req, res) => {
    const { token } = req.query;
    try {
        if (token) {
            const decodedToken = jwt.verify(token, process.env.PRIVATE_KEY)
            if (!decodedToken) {
                throw { message: "Token validate fail", status: 500 };
            }
            const { username, email, phone } = decodedToken;
            var user = await service.findUser({ username, email, phone });
            if (!user) {
                throw { message: "Cant find user", status: 401 };
            }
            user.status = "active";
            service.updateUser(user);
            res.render("auth/verifySuccess");
        } else {
            throw { message: "No token found", status: 404 };
        }
    } catch (err) {
        console.log("err", err);
        res.status(err.status).send({ message: err.message });
    }
}
const resendEmail = async(req, res) => {}
const forgotPasswordPage = async(req, res) => {
    res.render("auth/forgotPassword");
}
const forgotPasswordForm = async(req, res) => {
    console.log(req.body);
    const { email } = req.body;
    try {
        const user = await service.findUserByEmail({ email });
        if (!user) {
            throw ({ status: 404, message: "email not found" });
        }
        const token = jwt.sign(user, process.env.PRIVATE_KEY, { expiresIn: '20m' });
        try {
            await service.sendResetPasswordEmail(user.id, email, token);
            res.render('auth/verify', { email: email, token: token })
        } catch (err) {
            res.status(500).send({ message: err.message });
        }
    } catch (err) {
        res.status(err.status).send({ message: err.message });
    }
}
const resetPasswordPage = async(req, res) => {
    res.render("auth/resetPassword");
}
const resetPasswordForm = async(req, res) => {
    console.log("Token", req.body)
    const { userid, token } = req.params;
    const { password } = req.body;
    const hashPassword = await bcrypt.hashSync(password, 10);
    try {
        if (token) {
            const decodedToken = jwt.verify(token, process.env.PRIVATE_KEY)
            if (!decodedToken) {
                throw { message: "Token validate fail", status: 500 };
            }
            console.log("DECODE", decodedToken)
            const { username, email, telephone } = decodedToken;
            var user = await service.findUserByEmail({ email: email });
            if (!user) {
                throw { message: "Cant find user", status: 401 };
            }
            user.password = hashPassword;
            service.updateUser(user);
            res.status(200).send(({ message: "Update successfully" }))
        } else {
            throw { message: "No token found", status: 404 };
        }
    } catch (err) {
        console.log("err", err);
        res.status(500).send({ message: err });
    }
}

module.exports = {
    isAuthenticated,
    login,
    registerPage,
    register,
    verifyEmail,
    resendEmail,
    forgotPasswordPage,
    forgotPasswordForm,
    resetPasswordPage,
    resetPasswordForm,
}