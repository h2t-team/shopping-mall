const home = (req, res, next) => {
    res.render('homepage/home', { title: 'Homepage'});
}

module.exports = {home};