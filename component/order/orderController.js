const checkout = (req, res, next) => {
    res.render('order/checkout', { title: 'Checkout' });
}

const confirm = (req, res, next) => {
    res.render('order/confirmation', { title: 'Confirmation' });
}

module.exports = {
    checkout,
    confirm
}