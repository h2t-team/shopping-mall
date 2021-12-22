const formidable = require('formidable');
const bcrypt = require('bcrypt');
const { uploadImage } = require('../../cloudinary');

const service = require('./profileService');

const profile = (req, res) => {
    res.render('profile/profile', { title: 'Account' });
}

const update = (req, res) => {
    const form = formidable({});
    form.parse(req, async (err, fields, files) => {
        try {
            const { firstname, lastname, birthday } = fields;
            const userId = req.user.id;
            if (files.photo.size > 0) {
                const oldPath = files.photo.filepath;
                const response = await uploadImage(oldPath);
                const url = response.url;
                await service.updateWithImg(userId, { firstname, lastname, birthday, url });
            }
            else {
                await service.update(userId, { firstname, lastname, birthday })
            }
            res.redirect('/profile');
        } catch (err) {
            console.log(err);
        }
    });
}

const changePasswordPage = (req, res) => {
    res.render('profile/changePassword', { title: 'Change Password', message: req.flash('error') });
}

const changePassword = async (req, res) => {
    try {
        const user = req.user;
        const { oldPass, newPass } = req.body;
        if (!bcrypt.compareSync(oldPass, user.password)) {
            req.flash('error', 'Invalid Password.')
            return res.redirect('/profile/changePassword')
        }
        const hashPass = bcrypt.hashSync(newPass, 10);
        await service.updatePass(user.id, hashPass);
        res.redirect('/profile')
    } catch (err) {
        console.log(err);
    }
}

const getAddresses = async (req, res) => {
    const user = req.user;
    if (user) {
        try {
            const addresses = await service.getAddresses(user.id);
            res.render('profile/address', {
                title: "Addresses",
                addresses, 
                style: 'addresses.css',
                scripts: ['address.js']
            });
        } catch (err) {
            console.log(err);
        }
    } else {
        res.redirect('/auth/login');
    }
}

const addAddressPage = (req, res) => {
    res.render('profile/addAddress', { tiltle: 'Add Address' });
}

const addAddress = async (req, res) => {
    const user = req.user;
    if (user) {
        try {
            const { receiver, tel, city, district, ward, address } = req.body;
            await service.addAddress(user.id, receiver, tel, city, district, ward, address);
            res.redirect('/profile/address');
        } catch (err) {
            console.log(err);
        }
    } else {
        res.redirect('/auth/login');
    }
}

const updateAddressPage = async (req, res) => {
    const user = req.user;
    if (user) {
        try {
            const id = req.params.id;
            const address = await service.getAddress(id);
            res.render('profile/updateAddress', { tiltle: 'Add Address', address });
        } catch (err) {
            console.log(err);
        }
    } else {
        res.redirect('/auth/login');
    }
}

const updateAddress = async (req, res) => {
    const user = req.user;
    if (user) {
        try {
            const { id, receiver, tel, city, district, ward, address } = req.body;
            await service.updateAddress(id, receiver, tel, city, district, ward, address);
            res.redirect('/profile/address');
        } catch (err) {
            console.log(err);
        }
    } else {
        res.redirect('/auth/login');
    }
}

const deleteAddress = async (req, res) => {
    const user = req.user;
    if (user) {
        try {
            const { id } = req.body;
            console.log(id);
            await service.deleteAddress(id);
            res.status(200).json({ success: 'success' });
        } catch (err) {
            res.status(500).json({
                message: err.message
            })
        }
    } else {
        res.redirect('/auth/login');
    }
}

module.exports = {
    profile,
    update,
    changePasswordPage,
    changePassword,
    getAddresses,
    addAddressPage,
    addAddress,
    updateAddressPage,
    updateAddress,
    deleteAddress
}