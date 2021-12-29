
$(document).ready(function () {

    //enter search 
    $("#shop-search").on("keyup keypress", event => {
        if (event.which === 13) {
            if($("#shop-search").val() == "") {
                $("#shop-search").attr('disabled', true);
            }
            $("#searchForm").submit();
        }
    });

    //filter category
    $("input[name=category]", "#filterForm").on('click', () => {
        const filterForm = $('#filterForm');
        const keyword = $("#shop-search").val();
        if(keyword && $("input[name=keyword]", "#filterForm").val() === undefined) {
            $("<input>")
                .attr({
                    name: "keyword",
                    value: keyword,
                    type: 'hidden'
                })
                .appendTo(filterForm);
        }
        else if (keyword) {
            $("input[name=keyword]", "#filterForm").val(keyword);
        }
        else {
            $("#shop-search").attr('disabled', true);
        }
        filterForm.submit();
    })
});