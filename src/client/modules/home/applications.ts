//import * as ko from 'ko';

class PageModel {
    private page: ApplicationsPage;
    apps: KnockoutObservableArray<any>;
    constructor(page: ApplicationsPage) {
        this.page = page;
        this.apps = ko.observableArray([
            { name: 'AAA' },
            { name: 'BBB' },
            { name: 'CCC' },
            { name: 'DDD' },
            { name: 'EEE' },
            { name: 'FFF' },
            { name: 'GGG' },
            { name: 'AAA' },
            { name: 'BBB' },
            { name: 'CCC' },
            { name: 'DDD' },
            { name: 'EEE' },
            { name: 'FFF' },
            { name: 'GGG' },
        ])
    }
    newApplication() {
        let $dlg_application = $(this.page.element).find('[name="dlg_application"]');
        (<any>$dlg_application).modal('show');
    }
    appApplication() {

    }
}

class ApplicationsPage extends chitu.Page {
    constructor(params) {
        super(params);
        this.load.add(this.page_load);
    }

    private page_load(sender: chitu.Page, args) {

        let dataSource: wuzhui.DataSource<any> = new wuzhui.ArrayDataSource([
            { name: 'ShoupCloud前台', token: 'xxoo???bb', createDateTime: '2016-8-2 16:10' },
            { name: 'ShoupCloud前台', token: 'xxoo???bb', createDateTime: '2016-8-2 16:10' }
        ], ['id']);
        let gridView = new wuzhui.GridView({
            dataSource,
            columns: [
                new wuzhui.BoundField({ dataField: 'name', headerText: '名称' }),
                new wuzhui.BoundField({ dataField: 'token', headerText: '令牌' }),
                new wuzhui.BoundField({ dataField: 'createDateTime', headerText: '创建时间' }),
                new wuzhui.CommandField({ showDeleteButton: true, showEditButton: true })
            ]
        });
        gridView.element.className = 'table table-striped table-bordered';
        this.element.appendChild(gridView.element);
        dataSource.select();

        let model = new PageModel(this);
        ko.applyBindings(model, sender.element);
    }
}

export = ApplicationsPage;