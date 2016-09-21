import * as application_service from 'services/application_service';

class ApplicationsPage extends chitu.Page {

    constructor(params) {
        super(params);

        this.items = ko.observableArray();
        ko.applyBindings(this, this.element);

        this.load.add(this.page_load);
    }

    private page_load(sender: chitu.Page, args) {
        application_service.list().done((data: Array<any>) => {
            this.items(data);
        })
    }

    //==========================================================
    // 绑定
    private items: KnockoutObservableArray<any>;

    private addApp() {
        (<any>$(this.element).find('[name="dlg_application"]')).modal();
    }
    //==========================================================
}

export = ApplicationsPage;