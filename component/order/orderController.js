module.exports.checkout = (req, res, next) => {
    res.render('order/checkout', { title: 'Checkout' });
}
module.exports.confirm = (req, res, next) => {
    res.render('order/confirmation', { title: 'Confirmation' });
}