function reverseFormatNumber(val, locale) {
    var thousandSeparator = Intl.NumberFormat(locale).format(11111).replace(/\p{Number}/gu, '');
    var decimalSeparator = Intl.NumberFormat(locale).format(1.1).replace(/\p{Number}/gu, '');
    return parseFloat(val.replace(new RegExp('\\' + thousandSeparator, 'g'), '')
        .replace(new RegExp('\\' + decimalSeparator), '.'));
}

// remove the blank field when submit the search form
$("form").submit(function() {
    if($(".search").val() == "") {
            $(".search").attr('disabled', true);
    }
});