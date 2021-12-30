$('#resend').click(function (e) {
    const email = document.getElementById("email").textContent;
    const type = document.getElementById("type").textContent;
    $.ajax({
        contentType: "application/json",
        url: '/auth/resend-email',
        dataType: "json",
        type: 'POST', // http method
        data: JSON.stringify({
            email: email,
            type: type
        }), // data to submit
    })
});