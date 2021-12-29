const helpers = (hbs) => {
    hbs.registerHelper('section', (name, options) => {
        console.log(options.fn(this));
        return null;
    })
    hbs.registerHelper('page', (num, page, url) => {
        url = url.includes("page") ? url.substring(0, url.indexOf("page") - 1) : url;
        const urlTerm = url === "/" ? "?" : `${url.substring(1)}&`;

        const maxPage = Math.ceil((num / 9));
        //First item
        var item = `<li>
                        <a class="direct ${page == 1 ? "disabled" : ""}" href="${urlTerm}page=1">
                            <i class="fas fa-angle-double-left"></i>
                        </a>
                    </li>\n`;
        //Previous item       
        item += `<li>
                    <a class="direct ${page == 1 ? "disabled" : ""}" href="${urlTerm}page=${page - 1}">
                        <i class="fas fa-caret-left"></i>
                    </a>
                </li>\n`;
        var i = page > 2 ? page - 1 : 1;
        //... item
        item += i != 1 ? `<li><a class="disabled" href="#">...</a></li>` : "";
        //Page items
        for (; i <= page + 1 && i <= maxPage; i++) {
            item += `<li>
                        ${i == page ?
                    `<a class="active disabled" 
                                href="${urlTerm}page=${i}" >
                                ${i}
                            </a>`
                    : `<a href="${urlTerm}page=${i}">
                                ${i}
                            </a>`}
                    </li>\n`;
        }
        //... item
        item += i <= maxPage ? `<li><a class="disabled" href="#">...</a></li>` : "";
        // Next item
        item += `<li>
                    <a class="direct ${(page == maxPage|| maxPage == 0) ? "disabled" : ""}" href="${urlTerm}page=${page + 1}">
                            <i class="fas fa-caret-right"></i>
                    </a>
                </li>\n`;
        // Last item
        item += `<li>
                    <a class="direct ${(page == maxPage || maxPage == 0)  ? "disabled" : ""}" href="${urlTerm}page=${maxPage}">
                        <i class="fas fa-angle-double-right"></i>
                    </a>
                </li>\n`;
        return item;
    });


    hbs.registerHelper('radioChecked', (id, check) => id == check ? 'checked' : "");

    hbs.registerHelper('currencyFormat', money => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(money));

    hbs.registerHelper('avatar', url => url ? url : "/images/default.png");

    hbs.registerHelper('selectSelected', (id, select) => id == select ? "selected" : "");
    hbs.registerHelper('dateFormat', date => new Date(date).toLocaleString('en-GB'));

    hbs.registerHelper('checkStatus', status => {
        if (status === 'Success')
            return 'success';
        else if (status === 'Delivering')
            return 'warning';
        else if (status === 'Cancel')
            return 'danger';
        else return 'secondary';
    });

    hbs.registerHelper('checkDisabled', status => {
        if (status !== 'Prepairing')
            return 'disabled';
    });
}
module.exports = {
    helpers
}