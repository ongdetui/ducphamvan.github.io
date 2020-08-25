$(document).ready(function(){
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
        // console.log(textHistory);
        $(".header__search-input").val(textHistory);
        // console.log(textHistory.split(" "));
    });

    //filter search
    $(".header__search-input").keyup(function(){
        var valueSearch = $(this).val().toLowerCase();
        $(".header__search-history-item").filter(function(){
            $(this).toggle($(this).text().toLowerCase().indexOf(valueSearch) > -1);
        });
    });

    // product
    if($(".image-small").attr("class").indexOf('image-active') == -1){
        $(".image-small:first").addClass("image-active");
    }
    $(".image-small").click(function(){
        $(".image-small").removeClass("image-active");
        var linkImage = $(this).attr("src");
        if($(this).attr("class").indexOf('image-active') == -1){
            $(this).addClass('image-active');
        }
        $(".big-image__image").attr("src", `${linkImage}`);
    });

    // phần click vào logo
    $(".header__logo-img").attr("href","/");

    // điều hướng vào trang thanh toán
    // $(".product-buy-now").click(function(){
    //     window.location = "/thanhtoan";
    // });

    // Add smooth scrolling to all links
  $(".textcontent-detail").on('click', function(event) {

    // Make sure this.hash has a value before overriding default behavior
    if (this.hash !== "") {
      // Prevent default anchor click behavior
      event.preventDefault();

      // Store hash
      var hash = this.hash;

      // Using jQuery's animate() method to add smooth page scroll
      // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
      $('html, body').animate({
        scrollTop: $(hash).offset().top
      }, 800, function(){
   
        // Add hash (#) to URL when done scrolling (default click behavior)
        window.location.hash = hash;
      });
    } // End if
  });

  // chặn hành động login sang trang thanh toán
  // $(".product-add-cart-click").click(function(even){
  //   event.preventDefault();
  // });

  $(".product-add-cart").click(function(event){
    event.preventDefault();
    
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var itemCart = document.querySelectorAll(".header__cart-item").length.toString();
        if(Number(itemCart) == 0){
          document.querySelector(".header__cart-list").innerHTML = this.responseText;
          $(".header__cart-list-item").after('<button class="opencart btn btn--primary">Xem giỏ hàng</button>');
          $(".opencart").click(function(){
            window.location = "/thanhtoan";
          });
        }
        else{
          document.querySelector(".header__cart-list-item").innerHTML = this.responseText;  
        }
        
      }
    };
    
    xhttp.open("GET", "/thanhtoan1", true);
    xhttp.send();
    
    $(".app-animation-cart").css({'visibility': 'visible','opacity': '1'});
    setTimeout(function(){
      $(".app-animation-cart").css({'visibility': 'hidden','opacity': '0'});
    },1500);
     
    // gửi số sản phẩm trong giỏ hàng
    $.post("/soluongSp",
    {},
    function(data){
      console.log(data);
      var soluong = data.soluong + 1;
      $('.header__cart-notice').text(`${soluong}`);
    });

    
  });

  $(".opencart").click(function(){
    window.location = "/thanhtoan";
  });

});



