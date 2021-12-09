const home = (req, res, next) => {
    res.render('homepage/home', { title: 'Homepage', style: 'homepage.css'});
}

module.exports = {home};