const bcrypt = require('bcrypt');
const service = require('./authService');
const jwt = require('jsonwebtoken');
const passport = require('passport')
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
        telephone,
        birthday,
        password,
    } = req.body;
    const user = await service.findUser({ username, email, telephone });
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
        telephone,
        birthday,
        hashPassword
    }
    await service.createUser(newAccount);
    // send active link to email
    const token = jwt.sign({ username, email, telephone }, process.env.PRIVATE_KEY, { expiresIn: '20m' });
    try {
        await service.sendVerificationEmail(email, token);
        res.render('auth/sendEmail', { title: "Send Successfully", email: email, type: "Verification", style: 'verification.css' });
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
            const { username, email, telephone } = decodedToken;
            var user = await service.findUser({ username, email, telephone });
            if (!user) {
                throw { message: "This account is not exists!", status: 401 };
            }
            if (user.status == "active") {
                res.render("auth/verifySuccess", {
                    title: "Verify Successfully",
                    message: "This account has been already verified. Please log in.",
                    style: 'verification.css'
                });
            } else {
                const status = "active";
                await service.updateUserStatus(user.id, status);
                res.render("auth/verifySuccess", {
                    title: "Verify Successfully",
                    message: "Your account has been successfully verified.",
                    style: 'verification.css'
                });
            }

        } else {
            throw { message: "No token found", status: 404 };
        }
    } catch (err) {
        console.log("err", err);
        res.render("auth/error", { title: "Error", message: err.message });
        //res.status(err.status).send({ message: err.message });
    }
}
const resendEmail = async(req, res) => {
    const { email, type } = req.body;
    console.log(req.body);
    const user = await service.findUserByEmail(email);
    const username = user.username;
    const telephone = user.telephone;
    const token = jwt.sign({ username, email, telephone }, process.env.PRIVATE_KEY, { expiresIn: '20m' });
    try {
        if (type == "Verification") {
            await service.sendVerificationEmail(email, token);
        }
        if (type == "Reset Password") {
            await service.sendResetPasswordEmail(email, token);
        }
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
}
const forgotPasswordPage = async(req, res) => {
    res.render("auth/forgotPassword", { title: "Forgot Password", message: req.flash('error'), style: 'verification.css' });
}
const forgotPasswordForm = async(req, res) => {
    console.log(req.body);
    const { email } = req.body;
    try {
        const user = await service.findUserByEmail(email);
        if (!user) {
            //throw ({ status: 404, message: "We cannot find an account with that email address!" });
            req.flash('error', 'We cannot find an account with that email address!');
            return res.redirect("/auth/forgot-password");
        }
        const token = jwt.sign(user, process.env.PRIVATE_KEY, { expiresIn: '20m' });
        try {
            await service.sendResetPasswordEmail(email, token);
            res.render('auth/sendEmail', {
                title: "Send Successfully",
                email: email,
                type: "Reset Password",
                style: 'verification.css'
            });
        } catch (err) {
            res.status(500).send({ message: err.message });
        }
    } catch (err) {
        res.status(err.status).send({ message: err.message });
    }
}
const resetPasswordPage = async(req, res) => {
    res.render("auth/resetPassword", {
        title: 'Reset Password',
        style: 'verification.css'
    });
}
const resetPasswordForm = async(req, res) => {
    console.log("Token", req.body)
    const { token } = req.params;
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
            var user = await service.findUser({ username, email, telephone });
            if (!user) {
                throw { message: "This account is not exists!", status: 401 };
            }
            await service.updateUserPassword(user.id, hashPassword);
            res.status(200).send(({ message: "Update successfully" }))
        } else {
            throw { message: "No token found", status: 404 };
        }
    } catch (err) {
        console.log("err", err);
        res.status(500).send({ message: err });
    }
}
const checkVerification = async(req, res, next) => {
    const { username } = req.body;
    const user = await service.findUserByUsername(username);
    if (user) {
        if (user.status == "inactive") {
            res.render('auth/sendEmail', {
                title: "Send Successfully",
                email: user.email,
                type: "Verification",
                style: 'verification.css',
                scripts: ['resendEmail.js']
            });
        } else {
            next();
        }
    } else {
        next();
    }
}
const resetPasswordSuccess = async(req, res, ) => {
    res.render("auth/verifySuccess", {
        title: "Reset Password Successfully",
        message: "Your password is reset successfully. Please log in with your new password.",
        style: 'verification.css'
    });
}
const loginGoogle = async(req, res) => {
    console.log("@google", req.query.code)
    passport.authenticate('google');
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
    checkVerification,
    resetPasswordSuccess,
    loginGoogle
}