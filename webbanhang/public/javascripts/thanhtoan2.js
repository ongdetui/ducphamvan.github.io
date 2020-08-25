$(document).ready(function(){

    //sử lý phần form select huyện xã giao hàng
    if($('#huyen').val() == 'Huyện Yên Định'){
        $('#yendinh').show();
        $('#thieuhoa').hide();
        $('#thieuhoa').attr('name', 'xaHide');
    }
    else{
        $('#yendinh').hide();
        $('#yendinh').attr('name', 'xaHide');
        $('#thieuhoa').show();
        $('#thieuhoa').attr('name', 'xa');
    }
    $('#huyen').click(function(){
        console.log($('#huyen').val());
        if($('#huyen').val() == 'Huyện Yên Định'){
            $('#yendinh').show();
            $('#yendinh').attr('name', 'xa');
            $('#thieuhoa').hide();
            $('#thieuhoa').attr('name', 'xaHide');
        }
        else{
            $('#yendinh').hide();
            $('#yendinh').attr('name', 'xaHide');
            $('#thieuhoa').show();
            $('#thieuhoa').attr('name', 'xa');
        }
    });//end
});