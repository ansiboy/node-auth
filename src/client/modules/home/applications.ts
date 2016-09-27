import * as application_service from 'services/application_service';
import * as validation from 'knockout.validation';


class ApplicationsPage extends chitu.Page {

    private applicationName = ko.observable<string>().extend({ required: { message: '请输入应用名称' } });
    private val: KnockoutValidationErrors;

    constructor(params) {
        super(params);

        this.items = ko.observableArray();
        ko.applyBindings(this, this.element);

        this.load.add(this.page_load);
        this.val = validation.group(this);
    }

    private page_load(sender: chitu.Page, args) {
        return application_service.list().done((data: Array<any>) => {
            this.items(data);
        })
    }

    //==========================================================
    // 绑定
    private items: KnockoutObservableArray<any>;

    private newApp() {
        (<any>$(this.element).find('[name="dlg_application"]')).modal();
    }

    private addApp(model: ApplicationsPage) {
        if (!model['isValid']()) {
            model.val.showAllMessages();
            return;
        }
    }
    //==========================================================
}

export default ApplicationsPage;