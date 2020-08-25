$(document).ready(function(){
    //xử lý khi click vào nút hủy đơn hàng
    $('.cancelpay').click(function(){
        var result = confirm('Bạn có chắc muốn hủy đơn hàng này ?');
        if(result){
            console.log($(this).attr('id'));
        var indexRemove = $(this).attr('id');
        $.post('/infouser/productcancel',
        {
            indexRemove: indexRemove
        },
        function(data){
            if(data.update){
                location.reload();
            }
        });
        }
        
    });
});