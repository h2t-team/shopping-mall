$(document).ready(function () {
    $(document).on('click', '.delete-btn', async e => {
        const row = $(e.target).closest('.border-top');
        const id = row.find('input[type=hidden]').val();
        console.log(id);
        const request = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id })
        };
        $(".loading").removeClass("d-none");
        $(".loading").addClass("d-flex");
        const response = await fetch(`/profile/address/delete`, request);
        window.location.replace('/profile/address');
    })
})