$(document).ready(function(){
    // category
    if($(".category-item").attr("class").indexOf('category-item--active') == -1){
        $(".category-item:first").addClass("category-item--active");
    }

    $(".category-item").click(function(){
        $(".category-item").removeClass("category-item--active");
        if($(this).attr("class").indexOf('category-item--active') == -1){
            $(this).addClass("category-item--active");
        }
        
        
    }); //end

    //header search
    
    $(".header__search-input").on({
        click: function(){
            $(".header__search-history").css("display", "block");
        },
        
    });

    $(".header__search-history").mouseleave(function(){
        $(".header__search-history").css("display", "none");
    });

    $(".header__search-history-item").click(function(){
        var textHistory = $(this).text().trim();
        console.log(textHistory);
        $(".header__search-input").val(textHistory);
        console.log(textHistory.split(" "));
    });

    //filter search
    $(".header__search-input").keyup(function(){
        var valueSearch = $(this).val().toLowerCase();
        $(".header__search-history-item").filter(function(){
            $(this).toggle($(this).text().toLowerCase().indexOf(valueSearch) > -1);
        });
    });

    //sắp xếp theo giá
    $(".select-input__option-item1").click(function(){
        window.location = "/thapdencao";
    });

    $(".select-input__option-item2").click(function(){
        window.location = "/caodenthap";
    });

    $(".banchay").click(function(){
        window.location = "/banchaynhat";
    });


});