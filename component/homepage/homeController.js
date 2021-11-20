const home = (req, res, next) => {
    res.render('index', { title: 'Homepage' });
}

module.exports = {home};