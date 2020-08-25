$(document).ready(function(){
    var cartInputs = document.querySelectorAll(".cart-product-input"); // sản phẩm ở giỏ hàng
    var numberCartInputs = document.querySelectorAll(".cart-product-input").length;
    var cartPay = document.querySelectorAll(".cart-product-price-pay");
    var priceReal = document.querySelectorAll(".cart-product-current");
    // console.log(cartInputs);
    for(var i = 0; i < numberCartInputs; i++){
        var valueNow = Number(`${cartInputs[i].getAttribute("value")}`); // lấy ra giá trị của input Cart
        // console.log(valueNow);
        var pricePay = Number(`${priceReal[i].textContent.slice(0, -1).split('.').join('')}`);
        // console.log(pricePay);
        var total = pricePay * valueNow;
        cartPay[i].textContent = formatMoney(total); //in ra tổng tiền

    }



    $(".cart-product-less").click(function(){
        var cost = $(this).parents(".cart-product-more-less").siblings().find(".cart-product-current").text();
        var costNumber = Number(`${cost.slice(0, -1).split('.').join('')}`);   //chuyển từ chuỗi về dạng number
        // console.log(costNumber);

        var numberBuy = $(this).siblings().val();  //lấy ra giá trị của cart-product-input (chuỗi)
        var valueBuy = Number(numberBuy); //lấy ra giá trị của cart-product-input (number)
        
        var valueBuy1 = valueBuy - 1 ;
        if(valueBuy == 1){
            valueBuy1 = 1;
        }
        var totalPrice = costNumber * (valueBuy1);
        $(this).parents(".cart-product-more-less").siblings().find(".cart-product-price-pay").text(`${formatMoney(totalPrice)}`);

        // console.log(numberBuy);
        if(numberBuy == 1){
            $(this).css("opacity", "0.4");
        }
        else {
            $(this).siblings().val(`${valueBuy - 1}`); 
            $(this).siblings().attr('value',`${valueBuy - 1}`)
            $(this).siblings(".cart-product-more").css("opacity", "1");
        }
        // tinhTong(cartPay);
        
    });//end

    // khi click tăng
    $(".cart-product-more").click(function(){
        var cost = $(this).parents(".cart-product-more-less").siblings().find(".cart-product-current").text();
        var costNumber = Number(`${cost.slice(0, -1).split('.').join('')}`);   //chuyển từ chuỗi về dạng number
        // console.log(costNumber);

        var numberBuy = $(this).siblings(".cart-product-input").val();  //lấy ra giá trị của cart-product-input (chuỗi)
        var valueBuy = Number(numberBuy); //lấy ra giá trị của cart-product-input (number)
        
        var valueBuy1 = valueBuy + 1 ;
        if(valueBuy == 99){
            valueBuy1 = 99;
        }
        var totalPrice = costNumber * (valueBuy1);
        $(this).parents(".cart-product-more-less").siblings(".cart-product-price").find(".cart-product-price-pay").text(`${formatMoney(totalPrice)}`);

        // console.log(numberBuy);
        if(numberBuy == 99){
            $(this).css("opacity", "0.4");
        }
        else {
            $(this).siblings().val(`${valueBuy + 1}`);  
            $(this).siblings().attr('value',`${valueBuy + 1}`)
            $(this).siblings(".cart-product-less").css("opacity", "1");
        }
        // tinhTong(cartPay);
        
        
    });//end

    $(".cart-product-input").blur(function(){     //sự kiện blur khỏi thẻ input cart
        var cost = $(this).parents(".cart-product-more-less").siblings().find(".cart-product-current").text();
        var costNumber = Number(`${cost.slice(0, -1).split('.').join('')}`);   //chuyển từ chuỗi về dạng number
        // console.log(costNumber);
        var valueInput = $(this).val();
        var totalPrice = costNumber * valueInput;
        $(this).parents(".cart-product-more-less").siblings(".cart-product-price").find(".cart-product-price-pay").text(`${formatMoney(totalPrice)}`);
    });

    $(".cart-product-input").keypress(function(even){  // hàm chỉ cho phép nhập số vào input
        var charKey = even.which;
        // console.log(charKey);
        if(charKey > 47 && charKey < 58){
            return true;
        }
        return false;
    });


    //hàm tính tổng tất cả các sản phẩm trong giỏ hàng
    function tinhTong(params) {
        var totalAll = 0;
        params.forEach(function(price){
            var pricePay = Number(`${price.textContent.slice(0, -1).split('.').join('')}`);
            totalAll += pricePay;
            // console.log(totalAll);
        });
        document.querySelector(".price-value").textContent = formatMoney(totalAll);
        document.querySelector(".prices__value--final").textContent = `${formatMoney(totalAll)}`;
    }   //end
    tinhTong(cartPay);

//gửi giá trị về server và server trả về giá    
     //khi click vào -
    $(".cart-product-less").click(function(){ 
        var valueAll;
        var inputCart = document.querySelectorAll('.cart-product-input');
        inputCart.forEach(function(inputsp,index){
            if(!valueAll){
                valueAll = [inputsp.value];
            }
            else{
                valueAll.push(inputsp.value);
            }
            
        });
        console.log(valueAll);
        var valueSp = valueAll.toString();
        $.post("/thanhtoanInside",
        {
            valueAll : valueSp
        },
        function(data){
            console.log(data);
            var listPrice = data.danhsachCart;
            // console.log(listPrice[0]);
            var total = 0;
            dataLength = listPrice.length;
            for(var i = 0; i < dataLength; i++){
                total += listPrice[i];
            }
            $('.price-value').text(`${formatMoney(total)}`);
        });
    });
    //khi ckick vào +
    $('.cart-product-more').click(function(){
        var valueAll;
        var inputCart = document.querySelectorAll('.cart-product-input');
        inputCart.forEach(function(inputsp,index){
            if(!valueAll){
                valueAll = [inputsp.value];
            }
            else{
                valueAll.push(inputsp.value);
            }   
        });
        console.log(valueAll);
        var valueSp = valueAll.toString();
        $.post("/thanhtoanInside",
        {
            valueAll : valueSp
        },
        function(data){
            console.log(data);
            var listPrice = data.danhsachCart;
            // console.log(listPrice[0]);
            var total = 0;
            dataLength = listPrice.length;
            for(var i = 0; i < dataLength; i++){
                total += listPrice[i];
            }
            $('.price-value').text(`${formatMoney(total)}`);
        });
    });
    // khi nhập từ ô input
    $('.cart-product-input').change(function(){
        var valueAll;
        var inputCart = document.querySelectorAll('.cart-product-input');
        inputCart.forEach(function(inputsp,index){
            if(!valueAll){
                valueAll = [inputsp.value];
            }
            else{
                valueAll.push(inputsp.value);
            }   
        });
        console.log(valueAll);
        var valueSp = valueAll.toString();
        $.post("/thanhtoanInside",
        {
            valueAll : valueSp
        },
        function(data){
            console.log(data);
            var listPrice = data.danhsachCart;
            // console.log(listPrice[0]);
            var total = 0;
            dataLength = listPrice.length;
            for(var i = 0; i < dataLength; i++){
                total += listPrice[i];
            }
            $('.price-value').text(`${formatMoney(total)}`);
        });
    });//end


    // khi người dùng nhấn submit mua hàng
    $('.cart__submit').click(function(){
        $.post("/checkaddress",
        {},
        function(data){
            console.log(data);
            if(data.checklogin){
                window.location = "/#login";
            }
            else{
                if(data.checkAddress){//nếu người dùng đã xác nhận địa chỉ thì
                    window.location = "/payproduct";
                }else{       //nếu người dùng chưa xác nhận địa chỉ thì
                    window.location = "/checkout";
                }
            }
            
        });
    });


   

    // sự kiện submit form địa chỉ
    // $('.checkout').submit(function(){
    //     window.location = "/checkout/thanhtoan";
    // });
});






function formatMoney(money){  //hàm chuyển số 1234 thành chuỗi 1.234
    money +="";
    let format ='đ';
    for(let i = 0 ; i < money.length ; i++){
    if(i % 3 == 0 && i){
    format = money[money.length - i - 1] + '.' + format;
    }
    else {
    format = money[money.length - i - 1] + format;
    }
    }
    return format;
}//end
