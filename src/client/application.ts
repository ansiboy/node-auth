import chitu = require('chitu');

import ko = require('knockout');

class Application extends chitu.Application {
    private _contentElement: HTMLElement;

    constructor() {
        super({
            container: (routeData: chitu.RouteData, previous: chitu.PageContainer) => {
                var c: chitu.PageContainer = chitu.PageContainerFactory.createInstance({ app, routeData, previous });

                console.assert(this._contentElement != null);
                this._contentElement.appendChild(c.element);
                return c;
            }
        });

        this._contentElement = document.getElementById('mainContent');
    }
}

let app: Application = window['app'] = window['app'] || new Application();
app.run();

export = app;