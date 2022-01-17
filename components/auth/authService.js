const { Op } = require("sequelize");
const { v4: uuidv4 } = require('uuid');
const { models } = require('../../model');
const nodemailer = require('nodemailer');
const { use } = require("passport");
const fs = require('fs');
var Handlebars = require('handlebars');

const findUser = ({ username, email, telephone }) => {
    return models.customer.findOne({
        raw: true,
        where: {
            [Op.or]: [
                { username },
                { email },
                { telephone: telephone }
            ]
        }
    })
}
const findUserByEmail = async(email) => {
    return await models.customer.findOne({
        raw: true,
        where: {
            email: email
        }
    })
}
const findUserByUsername = async(username) => {
    return await models.customer.findOne({
        raw: true,
        where: {
            username: username
        }
    })
}
const updateUserStatus = async(id, status) => {
    return await models.customer.update({
        status: status
    }, {
        where: {
            id: id
        }
    })
}
const updateUserPassword = async(id, password) => {
    return await models.customer.update({
        password: password
    }, {
        where: {
            id: id
        }
    })
}
const createUser = async({
    firstname,
    lastname,
    username,
    email,
    telephone,
    birthday,
    hashPassword
}) => {
    return await models.customer.create({
        id: uuidv4(),
        username,
        password: hashPassword,
        'first_name': firstname,
        'last_name': lastname,
        email,
        telephone: telephone,
        dob: birthday,
        'created_at': Date.now()
    });

}
const sendVerificationEmail = async(email, token) => {
    var transporter = await nodemailer.createTransport({ service: 'Gmail', auth: { user: process.env.EMAIL_USERNAME, pass: process.env.EMAIL_PASSWORD } });

    function render(filename, data) {
        var source = fs.readFileSync(filename, 'utf8').toString();
        var template = Handlebars.compile(source);
        var output = template(data);
        return output;
    }

    const link = `${process.env.CLIENT_URL}/auth/verify-email?token=${token}`;
    const title = "Welcome!";
    const description = "We're excited to have you get started. First, you need to confirm your account. Just press the button below.";
    const button = "Confirm Account";
    var data = { email, link, title, description, button }

    var result = render('./view/emailTemplate.hbs', data);
    const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: email,
        subject: 'Verification Email - H2T',
        html: result,
    };
    transporter.sendMail(mailOptions, function(err) {
        if (err) {
            return new Error('Technical Issue!, Please click on resend for verify your Email.');
        }
    });
}
const sendResetPasswordEmail = async(email, token) => {
    var transporter = await nodemailer.createTransport({ service: 'Gmail', auth: { user: process.env.EMAIL_USERNAME, pass: process.env.EMAIL_PASSWORD } });

    function render(filename, data) {
        var source = fs.readFileSync(filename, 'utf8').toString();
        var template = Handlebars.compile(source);
        var output = template(data);
        return output;
    }

    const link = `${process.env.CLIENT_URL}/auth/reset-password/${token}`;
    const title = "Welcome Back!";
    const description = "There was recently a request to change the password for your account. If you requested this change, press the button below.";
    const button = "Reset Password";
    var data = { email, link, title, description, button }

    var result = render('./view/emailTemplate.hbs', data);
    const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: email,
        subject: 'Reset Password Email - H2T',
        html: result,
    };

    transporter.sendMail(mailOptions, function(err) {
        if (err) {
            return new Error('Technical Issue!, Please click on resend for verify your Email.');
        }
    });
}
const checkEmail = async(username, email) => models.customer.findOne({
    where: {
        email: email,
        username: {
            [Op.not]: username
        }
    },
    raw: true
})
const checkTelephone = async(username, telephone) => models.customer.findOne({
    where: {
        telephone: telephone,
        username: {
            [Op.not]: username
        }
    },
    raw: true
})
module.exports = {
    createUser,
    findUser,
    sendVerificationEmail,
    updateUserStatus,
    updateUserPassword,
    sendResetPasswordEmail,
    findUserByEmail,
    findUserByUsername,
    checkEmail,
    checkTelephone
}