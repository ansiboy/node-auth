import chitu = require('chitu');

import ko = require('knockout');

class Application extends chitu.Application {

    constructor() {
        super({
            container: (routeData: chitu.RouteData, previous: chitu.PageContainer) => {

                var css_path = chitu.Utility.format(`c!css/${routeData.actionPath}.css`);
                routeData.resource = [css_path];

                let element = document.createElement('div');
                var c: chitu.PageContainer = chitu.PageContainerFactory.createInstance({ app, routeData, previous, element });

                if (routeData.pageName == 'user.login') {
                    let container_host_element = document.getElementById('login-container');
                    console.assert(container_host_element != null);
                    container_host_element.appendChild(c.element);
                }
                else if (routeData.pageName == 'home.applications') {
                    let container_host_element = document.getElementById('applications-container');
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


                return c;
            }
        });
    }
}

let app: Application = window['app'] = window['app'] || new Application();
app.pageCreated.add((s, p) => {
    p.element.className = p.name.replace(/\./g, '_');
})
app.run();

export = app;