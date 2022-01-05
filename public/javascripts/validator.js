function Validation(selector) {
    const ruleLib = {
        required: value => value ? undefined : 'Please enter this field.',
        email: value => {
            const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : 'Please enter your email.'
        },
        min: min => value => value.length >= min ? undefined : `Please enter at least ${min} characters.`,
        max: max => value => value.length <= max ? undefined : `Please enter no more than ${max} characters.`,
        confirm: id => value => {
            const src = document.querySelector(`#${id}`);
            if(src){
                return src.value === value ? undefined : 'Please make sure your password match.'
            }
        },
        special: value => {
            const regex = /^[_A-z0-9]*((-|\s)*[_A-z0-9])*$/;
            return regex.test(value) ? undefined : 'The field must not containt special character.'
        },
        phone: value => {
            const regex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;
            return regex.test(value) ? undefined : 'Please enter your phone number.'
        } 
    }

    const form = document.querySelector(selector);
    if (form) {
        var formRules = {};
        const inputs = form.querySelectorAll('[name][rules]');
        for (let input of inputs) {
            const ruleNames = input.getAttribute('rules').split('|');
            for (let name of ruleNames) {
                //Check rule have param
                let ruleParam;
                const hasParam = name.includes(':');
                if (hasParam) {
                    ruleParam = name.split(':');
                    name = ruleParam[0];
                }
                //Get rule function from Lib
                ruleFunc = ruleLib[name];
                if (hasParam)
                    ruleFunc = ruleFunc(ruleParam[1]);
                //Push rule to array
                if (Array.isArray(formRules[input.name]))
                    formRules[input.name].push(ruleFunc);
                else
                    formRules[input.name] = [ruleFunc];
            }
            input.onblur = handleValidate;
            input.oninput = handleClearError;
        }

        //Handle submit form
        form.onsubmit = (event) => {
            event.preventDefault();

            const inputs = form.querySelectorAll('[name][rules]');
            var isValid = true;
            for (let input of inputs) {
                if (!handleValidate({ target: input })) {
                    isValid = false;
                }
            }
            if (isValid) {
                $(".loading").removeClass("d-none");
                $(".loading").addClass("d-flex");
                form.submit();
            }
        }
    }

    function handleValidate(event) {
        const rules = formRules[event.target.name];
        var errorMessage;
        for (let rule of rules) {
            errorMessage = rule(event.target.value);
            if (errorMessage) {
                event.target.classList.add("is-invalid");
                const parent = event.target.parentElement;
                if (parent) {
                    const message = parent.querySelector('.invalid-feedback');
                    if (message)
                        message.innerText = errorMessage;
                    break;
                }
            }
        }
        return !errorMessage;
    }

    function handleClearError(event) {
        const child = event.target;
        if (child.classList.contains("is-invalid"))
            child.classList.remove("is-invalid")
        const parent = child.parentElement;
        if (parent) {
            const message = parent.querySelector('.invalid-feedback');
            if (message)
                message.innerText = "";
        }
    }


}