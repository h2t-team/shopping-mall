
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
        filter();
    })

    $("#sort_select").change(() => {
        filter();
    });

    function filter() {
        const filterForm = $('#filterForm');
        const keyword = $("#shop-search").val();
        const sortValue = $("#sort_select").children(":selected").attr("id");
        
        if(keyword) {
            // check exist keywords
            if ($("input[name=keyword]", "#filterForm").val() === undefined) {
                $("<input>")
                    .attr({
                        name: "keyword",
                        value: keyword,
                        type: 'hidden'
                    })
                    .appendTo(filterForm);
            }
            else {
                $("input[name=keyword]", "#filterForm").val(keyword);
            }
        }
        else {
            $("#shop-search").attr('disabled', true);
        }

        // check exists sort
        if ($("input[name=sort]", "#filterForm").val() === undefined) {

            $("<input>")
                .attr({
                    name: "sort",
                    value: sortValue,
                    type: 'hidden'
                })
                .appendTo(filterForm);
        }
        else {
            $("input[name=sort]", "#filterForm").val(sortValue);
        }
        filterForm.submit();
    }
});