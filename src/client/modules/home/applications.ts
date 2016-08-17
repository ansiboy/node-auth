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
    }
}

export = ApplicationsPage;