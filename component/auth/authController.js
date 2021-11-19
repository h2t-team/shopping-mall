const login = (req,res) => {
    res.render('auth/login', { title: 'Login' });
}

const regist = (req,res) => {
    res.render('auth/register', { title: 'Register' });
}

module.exports = {
    login,
    regist
}