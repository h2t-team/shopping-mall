$(document).ready(()=>{
    loadRate();
    $('#submit-review').on('click', async e => {
        e.preventDefault();
        const rate = $('input[name=rate]').val();
        const content = $('input[name=content]').val();
        const request = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ rate, content })
        };
        const response = await fetch(`/product/${$('input[type=hidden]').val()}/rate`, request)
        if (response.ok)
            loadRate();
        else
            window.location.replace('/auth/login')
    });
})

async function loadRate(page, size) {
    const url = `/product/${$('input[type=hidden]').val()}/rate?page=${page}&size=${size}`;
    const request = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    const response = await fetch(url, request)
    if (response.ok) {
        const data = await response.json();
        $('#review-list').empty();
        $.each(data.rates, function (index, item) {
            appendRate(item);
        });
        if ($('ul.pagination li').length - 2 != data.totalPages) {
            $('ul.pagination').empty();
            buildPagination(data.totalPages);
        }
    }
}

function appendRate(rate) {
    let html =
        `<div class="review-item">\n
        <div class="d-flex position-relative mb-2">\n
            <div class="avatar">\n
                <img src="${rate['customer.avatar'] ? rate['customer.avatar'] : '/images/default.png'}" 
                alt="avatar" class="rounded-circle" />
            </div>\n
            <div class="info">\n
                <h5>${rate['customer.first_name']} ${rate['customer.last_name']}</h3>\n
                <div>\n`;
    //add rating start
    for (let i = 1; i <= rate.rate; i++)
        html += `<i class="fas fa-star"></i>`
    for (let i = rate.rate + 1; i <= 5; i++)
        html += `<i class="far fa-star"></i>`

    html += `</div>\n
            <p>${new Date(rate['created_at']).toDateString()}</p>\n
            </div>
        </div>\n
        <p class="review">${rate.content}</p>\n
    </div>\n`
    $('#review-list').append(html);
}

function buildPagination(totalPages) {
    // Build paging navigation
    let pageIndex = '<li class="page-item"><a class="page-link"><i class="fas fa-caret-left"></i></a></li>';
    $("ul.pagination").append(pageIndex);

    // create pagination
    for (let i = 1; i <= totalPages; i++) {
        // adding .active class on the first pageIndex 
        if (i == 1) {
            pageIndex = `<li class='page-item active'><a class='page-link'>${i}</a></li>`
        } else {
            pageIndex = `<li class='page-item'><a class='page-link'>${i}</a></li>`
        }
        $("ul.pagination").append(pageIndex);
    }
    pageIndex = '<li class="page-item"><a class="page-link"><i class="fas fa-caret-right"></i></a></li>';
    $("ul.pagination").append(pageIndex);
}

$(document).on('click', 'ul.pagination li', e => {
    let value = e.target.text;
    if (!value) {
        value = e.target.classList.value.includes('fas') ? e.target.classList.value
            : e.target.childNodes[0].classList.value;
        if (value.includes('left')) {
            const curentPage = $("li.active");
            const page = Number.parseInt(curentPage.text());
            if (page > 1) {
                loadRate(page - 1);
                $("li.active").removeClass("active");
                curentPage.prev().addClass('active');
            }
        }
        else {
            const totalPages = $("ul.pagination li").length - 2;
            const curentPage = $("li.active");
            const page = Number.parseInt(curentPage.text());
            if (page < totalPages) {
                loadRate(page + 1);
                $("li.active").removeClass("active");
                curentPage.next().addClass('active');
            }
        }
    } else {
        loadRate(value);
        $("li.active").removeClass("active");
        e.target.parentElement.classList.add('active');
    }
})


