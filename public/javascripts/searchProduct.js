
$(document).ready(function () {
    // enter search 
    $("#searchBtn").on("keydown", event => {

        if (event.keycode === 13) {
            event.preventDefault();
            let catOption = $("input[name=category]:checked", "#categoryForm");

            const value = catOption.val();
            alert(value);
            let form = $("#searchForm");

            if ($("input[name=category]", "#searchForm").val() === undefined) {
                $("<input>")
                    .attr({
                        name: "category",
                        value: value,
                    })
                    .appendTo(form);
            } else {
                $("input[name=category]", "#searchForm").val(value);
            }
            form.submit();
        }
    });

    //filter category
    $("input[name=category]", "#categoryForm").on('click', event => {
        let value = event.target.value;
        if (value != 0) {
            window.location.assign(
                `/product?category=${value}`
            );
        }
        else {
            window.location.assign(`/product`);
        }
    })
});