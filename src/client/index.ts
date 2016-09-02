
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
        },
        wuzhui: {
            deps: ['jquery']
        }
    },
    paths: {
        ace: 'js/ace',
        bootstrap: 'js/bootstrap',
        c: 'js/css',
        chitu: 'js/chitu',
        crossroads: 'js/crossroads',
        hammer: 'js/hammer',
        iscroll: 'js/iscroll-probe',
        jquery: 'js/jquery-2.1.0',
        knockout: 'js/knockout-3.2.0.debug',
        'knockout.validation': 'js/knockout.validation',
        move: 'js/move',
        text: 'js/text',
        wuzhui: 'js/wuzhui'
    }
});


requirejs(['application', 'knockout', 'menus', 'ace', 'wuzhui'], (app: chitu.Application, ko: KnockoutStatic, menus) => {
    if (!location.hash) {
        location.hash = '#home/index';
    }
    window['ko'] = window['ko'] || ko;
    var model = {
        menus: ko.observableArray()
    };
    var stack = [];
    for (var i = 0; i < menus.length; i++)
        stack.push(menus[i]);

    while (stack.length > 0) {
        var item = stack.pop();
        item.Url = item.Url || '';
        item.Children = item.Children || [];
        item.Icon = item.Icon || '';
        item.Visible = (item.Visible === undefined) ? true : item.Visible;
        item.VisibleChildren = [];

        for (var i = 0; i < item.Children.length; i++) {
            if (item.Children[i].Visible === undefined || item.Children[i].Visible !== false)
                item.VisibleChildren.push(item.Children[i]);

            stack.push(item.Children[i]);
        }
    }

    model.menus(menus);
    ko.applyBindings(model, document.getElementById('sidebar'));
    ko.applyBindings(model, document.getElementById('navbar'));
});