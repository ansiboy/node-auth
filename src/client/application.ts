import chitu = require('chitu');

import ko = require('knockout');

class Application extends chitu.Application {

    constructor() {
        super({
            container: (routeData: chitu.RouteData, previous: chitu.PageContainer) => {
                var c: chitu.PageContainer = chitu.PageContainerFactory.createInstance({ app, routeData, previous });
                //
                if (routeData.pageName == 'user.login') {
                    let container_host_element = document.getElementById('login-container');
                    console.assert(container_host_element != null);
                    container_host_element.appendChild(c.element);
                }
                else {
                    let _contentElement = document.getElementById('mainContent');
                    console.assert(_contentElement != null);
                    _contentElement.appendChild(c.element);
                }
                c.shown.add((sender, args) => {
                    $('.main-container:visible').hide();
                    $(sender.element).parents('.main-container').first().show();
                });
                c.closing.add((sender, args) => {
                    $(sender.element).parents('.main-container').first().hide();
                })
                //$(c.element).parents('.main-container').first().show();

                return c;
            }
        });
    }
}

let app: Application = window['app'] = window['app'] || new Application();
app.run();

export = app;