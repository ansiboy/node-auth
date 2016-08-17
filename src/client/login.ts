requirejs.config({
    shim: {
        ace: {
            deps: ['jquery', 'bootstrap']
        },
        bootstrap: {
            deps: ['jquery']
        },
        chitu: {
            deps: ['jquery', 'hammer', 'move'],
        },
        move: {
            exports: window['move']
        }
    },
    paths: {
        ace: 'js/ace',
        bootstrap: 'js/bootstrap',
        chitu: 'js/chitu',
        crossroads: 'js/crossroads',
        c: 'js/css',
        hammer: 'js/hammer',
        iscroll: 'js/iscroll-probe',
        jquery: 'js/jquery-2.1.0',
        knockout: 'js/knockout-3.2.0.debug',
        'knockout.validation': 'js/knockout.validation',
        move: 'js/move',
        text: 'js/text'
    }
});

requirejs(['knockout', 'knockout.validation', 'services/user_service', 'jquery'], (ko: KnockoutStatic, val: KnockoutValidationStatic) => {
    let login_model = {
        username: ko.observable<string>().extend({ required: true }),
        password: ko.observable<string>().extend({ required: true }),
        login: () => {
            let username = login_model.username();
            let password = login_model.password();
            if (!(<any>login_model).isValid()) {
                validation.showAllMessages();
                return;
            }
            return services.UserService.login(username, password).done(() => {
                let redirect_url = 'index.html#home/index'
                location.href = redirect_url;
            });
        }
    };

    let validation = val.group(login_model);
    let login_element = document.getElementsByName('login')[0];
    ko.applyBindings(login_model, login_element);
});