const helpers = (hbs) => {
    hbs.registerHelper('page', (num, page) => {
        var item = "";
        for (let i = 1; i <= num / 9 + 1; i++) {
            item += i == page ? "<li><a class=\"active\" href=\"?page=" + i + "\">" + i + "</a></li>\n" 
            : "<li><a href=\"?page=" + i + "\">" + i + "</a></li>\n";
        }
        return item;
    });

    hbs.registerHelper('radioChecked', (id, check) => id == check ? 'checked' : "");

    hbs.registerHelper('currencyFormat', money => 
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(money));
}
module.exports ={
    helpers
}