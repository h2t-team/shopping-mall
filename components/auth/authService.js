const { Op } = require("sequelize");
const { v4: uuidv4 } = require('uuid');
const { models } = require('../../model');
const nodemailer = require('nodemailer');
const { use } = require("passport");
const findUser =  ({ username, email, phone }) => {
    return  models.customer.findOne({
        raw: true,
        where: {
            [Op.or]: [
                { username },
                { email },
                { telephone: phone }
            ]
        }
    })
}
const findUserByEmail =  ({  email }) => {
    return  models.customer.findOne({
        raw: true,
        where: {
            [Op.or]: [
                { email },
            ]
        }
    })
}
const update = async ( user) => {
    return await models.customer.update(user, {
        where: {
            id: user.id
        }
    })
}
const createUser = ({
    firstname,
    lastname,
    username,
    email,
    phone,
    birthday,
    hashPassword
}) => {
    return models.customer.create({
        id: uuidv4(),
        username,
        password: hashPassword,
        'first_name': firstname,
        'last_name': lastname,
        email,
        telephone: phone,
        dob: birthday,
        'created_at': Date.now()
    });

}
const sendEmail = async (email, token) => {
    var transporter = await nodemailer.createTransport({ service: 'Gmail', auth: { user: process.env.EMAIL_USERNAME, pass: process.env.EMAIL_PASSWORD } });
    var mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: email,
        subject: 'Email verification - H2T',
        html: `
        <p>You requested for email verification, kindly use this <a href="${process.env.CLIENT_URL}/auth/verify-email?token=${token}">link</a> to verify your email address</p>`
    };
    transporter.sendMail(mailOptions, function (err) {
        if (err) {
            return new Error('Technical Issue!, Please click on resend for verify your Email.');
        }
    });
}
const sendEmailResetPassword = async (userid,email, token) => {
    var transporter = await nodemailer.createTransport({ service: 'Gmail', auth: { user: process.env.EMAIL_USERNAME, pass: process.env.EMAIL_PASSWORD } });
    var mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: email,
        subject: 'Email Reset password - H2T',
        html: `
        <p>You requested for email reset password, kindly use this <a href="${process.env.CLIENT_URL}/auth/forgot-password/${userid}/${token}">link</a> to reset your password </p>`
    };
    transporter.sendMail(mailOptions, function (err) {
        if (err) {
            return new Error('Technical Issue!, Please click on resend for verify your Email.');
        }
    });
}
module.exports = {
    createUser,
    findUser,
    sendEmail,
    update,
    sendEmailResetPassword,
    findUserByEmail
}