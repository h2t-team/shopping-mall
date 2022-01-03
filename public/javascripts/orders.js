$(document).ready(() => {
    $('.delete-btn').on('click', async e => {
        const orderId = $(e.target).closest('tr').find('input[name=orderId]').val();
        const request = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ orderId })
        };
        $(".loading").removeClass("d-none");
        $(".loading").addClass("d-flex");
        const response = await fetch(`/order/cancel`, request);
        if (response.ok) {            
            window.location.replace(`/order`);
        }
    })
})