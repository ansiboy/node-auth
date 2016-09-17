import * as application_service from 'services/application_service';

let apps = [
    { name: 'AAA', title: 'AAA' },
    { name: 'BBB', title: 'AAA' },
    { name: 'CCC', title: 'AAA' },
    { name: 'DDD', title: 'AAA' },
];

class ApplicationsPage extends chitu.Page {

    private items: KnockoutObservableArray<any>;

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
}

export = ApplicationsPage;