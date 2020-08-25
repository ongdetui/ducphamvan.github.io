$(document).ready(function(){
    // khi nhấn vào thay đổi địa chỉ
    $('.infor-address-change').click(function(){
        window.location = "/checkout";
    });//end

    //khi nhấn nút chốt đơn mua hàng
    $('.pay-end-button').click(function(){
        $.post('/checkaddress',{},
        function(data){
            if(data.payed){
                $.post('/paytimeone',{},
                function(data2){
                    console.log(data2);
                    if(data2.paydone){
                        $('.pay-done').parents('.grid').show();
                        $('.method-pay').parents('.grid').hide();
                    }
                });
            }
            else{
                $.post('/payend',
                {},
                function(data){
                    console.log(data);
                    if(data.paydone){
                        $('.pay-done').parents('.grid').show();
                        $('.method-pay').parents('.grid').hide();
                    }
                });
            }
        });


        
    });

});