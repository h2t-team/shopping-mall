$(document).ready(function() {
    $('#create-order').on('click', async e => {
        const receiverId = $('input[name=address]:checked').val();
        const total = reverseFormatNumber($('#order-total').text(),'vi-VN');
        const note = $('#message').val();
        const data = [];
        $.each($('.table tbody tr'), function (i, item) {
            const productId = $(item).find('input[type=hidden]').val();
            const quantity = parseInt($(item).find('.qty h5').text());
            const size = $(item).find('.size h5').text();
            const total = reverseFormatNumber($(item).find('.total h5').text(),'vi-VN');
            data.push({
                productId,
                size,
                quantity,
                total
            });
        });
        const request = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ receiverId, total, note, data })
        };
        $(".loading").removeClass("d-none");
        $(".loading").addClass("d-flex");
        const response = await fetch(`/order/create`, request);
        if (response.ok) {
            const result = await response.json();
            window.location.replace(`/order/confirm/${result.order.id}`);
        }
    })
});