$(document).ready(function () {
    $(document).on('click', '.delete-btn', async e => {
        const row = $(e.target).closest('.border-top');
        const id = row.find('input[type=hidden]').val();
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
        if (response.ok)
            window.location.replace('/profile');
        else {
            $(".loading").addClass("d-none");
            $(".loading").removeClass("d-flex");
            const failed = document.getElementById('failed-toast');
            const toast = new bootstrap.Toast(failed);
            toast.show();
        }
    })
})