const helpers = (hbs) => {
    hbs.registerHelper('page', (num, page, category) => {
        var item = "";
        for (let i = 1; i <= num / 9 + 1; i++) {
            item += `<li>
                        ${i == page ? 
                            `<a class=\"active\" 
                                href=\"?${category == 0 ? "" : `category=${category}&`}page=${i}\">
                                ${i}
                            </a>`
                        : `<a href=\"?${category == 0 ? "" : `category=${category}&`}page=${i}\">
                                ${i}
                            </a>`}
                    </li>\n`;
        }
        return item;
    });

    hbs.registerHelper('radioChecked', (id, check) => id == check ? 'checked' : "");

    hbs.registerHelper('currencyFormat', money =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(money));
}
module.exports = {
    helpers
}