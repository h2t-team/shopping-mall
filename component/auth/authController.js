module.exports.login = (req,res) => {
    res.render('auth/login', { title: 'Login' });
}
module.exports.regist = (req,res) => {
    res.render('auth/register', { title: 'Register' });
}