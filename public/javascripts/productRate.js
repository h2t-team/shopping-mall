$('#submit-review').on('click', async e => {
    e.preventDefault();
    const rate = $('input[name=rate]').val();
    const content = $('input[name=content]').val();
    try {
        const response = await fetch(`/product/${$('input[type=hidden]').val()}/rate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ rate, content })
        });
        if(response.ok)
            loadRate();
        else
            window.location.replace('/auth/login')
    } catch (error) {
        console.log(error);
    }
});

function loadRate() {
    $.getJSON(`/product/${$('input[type=hidden]').val()}/rate`, data => {
        let html = "";
        for (let item of data) {
            html += `<div class="review-item">\n
            <div class="d-flex position-relative mb-2">\n
                <div class="avatar">\n
                    <img src="${item['customer.avatar'] ? item['customer.avatar'] : '/images/default.png'}" 
                    alt="avatar" class="rounded-circle" />
                </div>\n
                <div class="info">\n
                    <h5>${item['customer.first_name']} ${item['customer.last_name']}</h3>\n
                    <div>\n`;
            for (let i = 1; i <= item.rate; i++)
                html += `<i class="fas fa-star"></i>`
            for (let i = item.rate + 1; i <= 5; i++)
                html += `<i class="far fa-star"></i>`
            html += `</div>\n
                </div>\n
            </div>\n
            <p class="review">${item.content}</p>\n
        </div>\n`
        }
        $('#review-list').html(html);
    });
}

loadRate();
