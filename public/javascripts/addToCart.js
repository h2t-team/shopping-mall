$(document).ready(() => {
    $('#add-cart').on('click', async e => {
        const productId = $('.text-detail input[type=hidden]').val();
        const price = reverseFormatNumber($('#price').text(), 'vi-VN');
        const quantity = parseInt($('#qty').val());
        const size = $('#size').val();
        if (!size || quantity <= 0) {
            const failed = document.getElementById('failed-toast');
            const toast = new bootstrap.Toast(failed);
            toast.show();
            return;
        }
        const total = price * quantity;
        const request = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ productId, size, quantity, total })
        };
        $(".loading").removeClass("d-none");
        $(".loading").addClass("d-flex");
        const response = await fetch(`/cart/add`, request);
        $(".loading").removeClass("d-flex");
        $(".loading").addClass("d-none");
        if (response.ok) {
            const success = document.getElementById('success-toast');
            const toast = new bootstrap.Toast(success);
            toast.show();
        } else if (response.status == 401) {
            window.location.replace('/auth/login')
        } else {
            const failed = document.getElementById('failed-toast');
            const toast = new bootstrap.Toast(failed);
            toast.show();
        }
    })
});