
var formElement = document.querySelector(".nav__mobile-link:nth-child(4)");

// console.log(formElement);
var navMobile = document.querySelector(".nav__mobile");
var overlay = document.querySelector(".nav__overlay");

formElement.onclick = function() {
    
    navMobile.setAttribute('style','transform: translateX(-100%);');
    overlay.setAttribute('style','display: none');

}

var formElement2 = document.querySelector(".nav__mobile-link:nth-child(5)");
if(formElement2){
    formElement2.onclick = function() {
    
        navMobile.setAttribute('style','transform: translateX(-100%);');
        overlay.setAttribute('style','display: none');
    
    }
}


var elementBack = document.querySelectorAll(".form-out__click");
// console.log(elementBack);
elementBack.forEach(function(e){
    
    e.onclick = function() {
        navMobile.setAttribute('style','');
        overlay.setAttribute('style','');
    }
})


// header-cart
$('.header__cart').click(function(){
    $('.header__cart-list').toggle();
});

// header__cart-item

var cartItem =  document.querySelectorAll(".header__cart-item");
// console.log(cartItem)
cartItem.forEach(function(e){
    // console.log(e)
    e.onclick = function(){
        e.setAttribute('style','background-color: rgb(211, 209, 208);');
    }
});

// phân loại sp

var categoryLink =  document.querySelectorAll(".category-item__link");
var productAll = document.querySelectorAll(".product__classify");

//  console.log(productAll);

categoryLink.forEach(function(e){
    //  console.log(e);
    var linkClick = e.getAttribute("href").slice(1);
    // console.log(linkClick);
    e.onclick =  function(){
        var product = document.querySelectorAll(`div[id="${linkClick}"]`);
        // console.log(product);
        if(linkClick == "all"){
            productAll.forEach(function(req){
                
                req.setAttribute('style','display: block;');
            });
        }
        else{
            productAll.forEach(function(req){
                req.setAttribute('style','display: none;');
                product.forEach(function(sp1){
                    sp1.setAttribute('style','display: block;');
                });
            });
        }
        

    }


});  //hihi xong rồi


//phần số sản phẩm trong giỏ

var itemCart = document.querySelectorAll(".header__cart-item").length.toString();
// console.log(itemCart);
$(".product-add-cart").click(function(){

    
    var itemCart2 = document.querySelectorAll(".header__cart-item").length.toString();
    
    if(Number(itemCart) == 0){
        // console.log(itemCart);
        itemCart = Number(itemCart) + 1;
        document.querySelector(".header__cart-notice").textContent = itemCart;
    }
    else{
        // console.log('itemcarrt2: '+ itemCart2);
        document.querySelector(".header__cart-notice").textContent = `${Number(itemCart2) + 1}`;
        
        
    }
    
    $(".header__cart-heading:first").remove();
    $(".header__cart-list-item:first").remove();
});
// console.log(itemCart);
document.querySelector(".header__cart-notice").textContent = itemCart;
if(Number(itemCart) == 0){
    $(".header__cart--no-cart-img").addClass("header__cart-list--no-cart");
    $(".header__cart-list-no-cart-msg").addClass("header__cart-list--no-cart");
    $(".header__cart-heading").hide();
    // $(".header__cart-list-item").hide();
}

//end

$(".header__cart-item-name").click(function(){
    window.location = "/thanhtoan";
});
$(".opencart").click(function(){
    window.location = "/thanhtoan";
});

//khi hover vào avatar
$('.shop-avatar').mouseenter(function(){
    $('.menu-user').show();
});

$('.shop-avatar').mouseleave(function(){
    $('.menu-user').hide();
});


