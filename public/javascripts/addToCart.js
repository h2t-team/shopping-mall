$(document).ready(() => {
    $('#add-cart').on('click', async e => {
        const productId = $('.text-detail input[type=hidden]').val();
        const price = reverseFormatNumber($('#price').text(), 'vi-VN');
        const quantity = parseInt($('#qty').val());
        const size = $('#size').val();
        const total = price * quantity;
        const request = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ productId, size, quantity, total })
        };
        const response = await fetch(`/cart/add`, request);
        if (response.ok) {
            const success = document.getElementById('success-toast');
            const toast = new bootstrap.Toast(success);
            toast.show();
        }else if(response.status == 401){
            window.location.replace('/auth/login')
        }else{
            const failed = document.getElementById('failed-toast');
            const toast = new bootstrap.Toast(failed);
            toast.show();
        }
    })
});

function reverseFormatNumber(val, locale) {
    var thousandSeparator = Intl.NumberFormat(locale).format(11111).replace(/\p{Number}/gu, '');
    var decimalSeparator = Intl.NumberFormat(locale).format(1.1).replace(/\p{Number}/gu, '');
    return parseFloat(val.replace(new RegExp('\\' + thousandSeparator, 'g'), '')
        .replace(new RegExp('\\' + decimalSeparator), '.'));
}