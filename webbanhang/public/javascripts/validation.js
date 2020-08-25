

function Validator(formSelector){
    function getParent(element, Seletor){
        while(element.parentElement){
            if(element.parentElement.matches(Seletor)){
                return element.parentElement;
            }
            element = element.parentElement;
        }
    }

    var formRules = {};
    /**
     * quy ước tạo rule:
     * -nếu có lỗi thì return về message error
     * -nếu k có lỗi thì return về undefined
     */
    var ValidatorRules = {
        required: function (value){
            return value ? undefined : 'Vui lòng nhập trường này';
        },
        email: function (value){
            var regax = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regax.test(value) ? undefined : 'Vui lòng nhập email';
        },
        min: function (min){
            return function (value){
                return value.length >= min ? undefined : `Vui lòng nhập tối thiểu ${min} kí tự`;
            }
        },
        retype: function (min){
            return function (value){
                return value == min ? undefined : 'Mật khẩu bạn nhập lại không khớp!';
            }
        }

    };


    var formElement = document.querySelector(formSelector);  //lấy ra form muốn validation
    //chỉ xử lý khi có element trong DOM
    if(formElement){
        var inputs = formElement.querySelectorAll('[name][rules]');
        // console.log(inputs);
        for(var input of inputs){
            var rules = input.getAttribute('rules').split('|');
            for(var rule of rules){
                var ruleInfo;
                var isRuleHasValue = rule.includes(':');
                if(isRuleHasValue){
                    ruleInfo = rule.split(':');
                    rule = ruleInfo[0];
                }

                var ruleFunc = ValidatorRules[rule];
                // console.log(ruleFunc);

                if(isRuleHasValue){
                    ruleFunc = ruleFunc(ruleInfo[1]);
                    // console.log(ruleFunc);
                }
                // console.log(rule);
                if(Array.isArray(formRules[input.name])){
                    formRules[input.name].push(ruleFunc);
                }
                else{
                    // console.log(ruleFunc);
                    formRules[input.name] = [ruleFunc];
                }
                
            }
            
            // Lắng nghe các sự kiện blur,change,...
            input.onblur = hendleValidate;
            input.oninput = hendleClearError;

            
            
            
        }

    }

    //hàm thực hiện validate
    function hendleValidate(even){
        var rules = formRules[even.target.name];
        // console.log(rules);
        var errorMessage;
        rules.forEach(function(rule){
            // console.log(rule);
            errorMessage = rule(even.target.value);
            return errorMessage;
        });
        //Nếu mà có lỗi validate thì hiển thị lỗi ra Dom
        if(errorMessage){
            var formGroup = getParent(even.target, '.form-group');
            if(!formGroup) return;
            formGroup.classList.add('invalid');
            var formMessage = formGroup.querySelector('.form-message');
            if(formMessage){
                formMessage.innerText = errorMessage;
            }
            
        }
        return !errorMessage;

    }

    // hàm clear error
    function hendleClearError(even){
        var formGroup = getParent(even.target, '.form-group');
        if(formGroup.classList.contains('invalid')) {
            formGroup.classList.remove('invalid');
            var formMessage = formGroup.querySelector('.form-message');
            if(formMessage){
                formMessage.innerText = '';
            }
        }
        
    }


    // xử lý hành vi submit form
    formElement.onsubmit = function(even){
        even.preventDefault();
        var inputs = formElement.querySelectorAll('[name][rules]');
        var isValid = true;
        
        for(var input of inputs){
            if(!hendleValidate({target:input})){
                isValid = false;
            }
            
        }

        if($('#password_confirmation').val() != $('#password1').val()){
            isValid = false;
        }
        $('#password_confirmation').blur(function(){
            var checkValue = $('#password1').val();
            // console.log(checkValue)
            if($(this).val() != checkValue || $(this).val() == ''){
                $(this).parent().addClass('invalid');
                $(this).next().text('Vui lòng nhập khớp mật khẩu!');
                isValid = false;
            }
            else{
                $(this).next().text('');
            }
        });
        
        $('#password_confirmation').keydown(function(){
            var pass = document.querySelector('#password_confirmation');
            var formGroup = getParent(pass, '.form-group');
                if(formGroup.classList.contains('invalid')) {
                    formGroup.classList.remove('invalid');
                    var formMessage = formGroup.querySelector('.form-message');
                    if(formMessage){
                        formMessage.innerText = '';
                    }
                }
        });

        // khi không có lỗi thì submit form
        if(isValid){
            formElement.submit();
            $.post('/checklogin',{},
            function(data){
                if(!data.login){
                    $('.login-error').text('tên tài khoản hoặc mật khẩu không đúng');
                }
                else {
                    $('.login-error').text('');
                }
            });
        }
    }
    

    // console.log(formRules); 
    $('#password_confirmation').blur(function(){
        var checkValue = $('#password1').val();
        // console.log(checkValue)
        if($(this).val() != checkValue || $(this).val() == ''){
            $(this).parent().addClass('invalid');
            $(this).next().text('Vui lòng nhập khớp mật khẩu!');
        }
        else{
            $(this).next().text('');
        }
    });
    $('#password_confirmation').keydown(function(){
        var pass = document.querySelector('#password_confirmation');
        var formGroup = getParent(pass, '.form-group');
            if(formGroup.classList.contains('invalid')) {
                formGroup.classList.remove('invalid');
                var formMessage = formGroup.querySelector('.form-message');
                if(formMessage){
                    formMessage.innerText = '';
                }
            }
    });

    
    

}


