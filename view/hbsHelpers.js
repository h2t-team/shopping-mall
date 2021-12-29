const helpers = (hbs) => {
        hbs.registerHelper('section', (name, options) => {
            console.log(options.fn(this));
            return null;
        })
        hbs.registerHelper('page', (num, page, category, sort) => {
                    const maxPage = Math.ceil((num / 9));
                    //First item
                    var item = `<li><a class="direct ${page == 1 ? "disabled" : ""}" 
        href="${category == 0 ? "/product" : `?category=${category}&sort=${sort}`}">
            <i class="fas fa-angle-double-left"></i>
        </a></li>\n`;
        //Previous item       
        item += `<li><a class="direct ${page == 1 ? "disabled" : ""}" 
                        href="?${category == 0 ? "" : `category=${category}&`}${sort == "default" ? "" : `sort=${sort}&`}page=${page - 1}">
                            <i class="fas fa-caret-left"></i>
                        </a></li>\n`;

        var i = page > 2 ? page - 1 : 1;
        //... item
        item += i != 1 ? `<li><a class="disabled" href="#">...</a></li>` : "";
        //Page items
        for (; i <= page + 1 && i <= maxPage; i++) {
            item += `<li>
                        ${i == page ?
                    `<a class="active disabled" 
                                href="?${category == 0 ? "" : `category=${category}&`}${sort == "default" ? "" : `sort=${sort}&`}page=${i}">
                                ${i}
                            </a>`
                    : `<a href="?${category == 0 ? "" : `category=${category}&`}${sort == "default" ? "" : `sort=${sort}&`}page=${i}">
                                ${i}
                            </a>`}
                    </li>\n`;
        }
        //... item
        item += i <= maxPage ? `<li><a class="disabled" href="#">...</a></li>` : "";
        item += `<li><a class="direct ${page == maxPage ? "disabled" : ""}" 
                        href="?${category == 0 ? "" : `category=${category}&`}${sort == "default" ? "" : `sort=${sort}&`}page=${page + 1}">
                            <i class="fas fa-caret-right"></i>
                        </a></li>\n`;

        item += `<li><a class="direct ${page == maxPage ? "disabled" : ""}" 
        href="?${category == 0 ? "" : `category=${category}&`}${sort == "default" ? "" : `sort=${sort}&`}page=${maxPage}">
            <i class="fas fa-angle-double-right"></i>
        </a></li>\n`;
        return item;
    });

    hbs.registerHelper('radioChecked', (id, check) => id == check ? 'checked' : "");

    hbs.registerHelper('currencyFormat', money => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(money));

    hbs.registerHelper('avatar', url => url ? url : "/images/default.png");

    hbs.registerHelper('selectSelected', (id, select) => id == select ? "selected" : "");
}
module.exports = {
    helpers
}