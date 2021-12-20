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
    try{
        const user = req.user;
        const {oldPass, newPass} = req.body;
        if(!bcrypt.compareSync(oldPass, user.password)){
            req.flash('error', 'Invalid Password.')
            return res.redirect('/profile/changePassword')
        }
        const hashPass = bcrypt.hashSync(newPass, 10);
        await service.updatePass(user.id, hashPass);
        res.redirect('/profile')
    }catch (err) {
        console.log(err);
    }
}

const getAddresses = async (req, res) => {
    const user = req.user;
    if(user){
        try{            
            const addresses = await service.getAddresses(user.id);
            console.log(addresses);
            res.render('profile/address', {title: "Addresses", addresses, style: 'addresses.css'});
        }catch(err){
            console.log(err);
        }
    }else{
        res.redirect('/auth/login');
    }
}
module.exports = {
    profile,
    update,
    changePasswordPage,
    changePassword,
    getAddresses
}