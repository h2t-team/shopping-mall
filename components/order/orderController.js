const checkout = (req, res, next) => {
    res.render('order/checkout', { title: 'Checkout', style: 'checkout.css' });
}

const confirm = (req, res, next) => {
    res.render('order/confirmation', { title: 'Confirmation', style: 'confirmation.css' });
}

module.exports = {
    checkout,
    confirm
}