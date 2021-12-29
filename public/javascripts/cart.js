$(document).ready(() => {
    //Update Cart
    $('#update-cart').on('click', async e => {
        const data = [];
        let isValid = true;
        $.each($('.table tbody tr'), function (i, item) {
            const productId = $(item).find('input[type=hidden]').val();
            const quantity = parseInt($(item).find('input[type=number]').val());
            const size = $(item).find('.size h5').text();
            if (quantity <= 0) {
                const failed = document.getElementById('failed-toast');
                const toast = new bootstrap.Toast(failed);
                toast.show();
                isValid = false;
                return;
            }
            let price = $(item).find('h5').text();
            price = reverseFormatNumber(price, 'vi-VN');
            const total = quantity * price;
            data.push({
                productId,
                size,
                quantity,
                total
            });
        });
        if (!isValid)
            return;
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
        if (response.ok) {
            window.location.replace('/cart');
        }
    });

    //Delete from cart
    $(document).on('click', '.delete-btn', async e => {
        const row = $(e.target).closest('tr');
        const productId = row.find('input[type=hidden]').val();
        const size = row.find('.size h5').text();
        const request = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ productId, size })
        };
        $(".loading").removeClass("d-none");
        $(".loading").addClass("d-flex");
        const response = await fetch(`/cart/delete`, request);
        window.location.replace('/cart');
    })
})