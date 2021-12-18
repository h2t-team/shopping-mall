$(document).ready(() => {
    $('#update-cart').on('click', async e => {
        const data = [];
        $.each($('.table tbody tr'), function (i, item) {
            const productId = item.querySelector('input[type=hidden]').value;
            const quantity = parseInt(item.querySelector('input[type=number]').value);
            let price = item.querySelector('h5').innerText;
            price = reverseFormatNumber(price,'vi-VN');
            const total = quantity*price;
            data.push({
                productId,
                quantity,
                total
            });
        });
        const request = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data })
        };
        $(".loading").removeClass("d-none");
        $(".loading").addClass("d-flex");
        const response = await fetch(`/cart/update`, request);
        window.location.replace('/cart');
    })
})

function reverseFormatNumber(val, locale) {
    var thousandSeparator = Intl.NumberFormat(locale).format(11111).replace(/\p{Number}/gu, '');
    var decimalSeparator = Intl.NumberFormat(locale).format(1.1).replace(/\p{Number}/gu, '');
    return parseFloat(val.replace(new RegExp('\\' + thousandSeparator, 'g'), '')
        .replace(new RegExp('\\' + decimalSeparator), '.'));
}