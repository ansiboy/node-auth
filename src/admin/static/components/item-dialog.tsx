import React = require("react");
import { hideDialog, showDialog } from "maishu-ui-toolkit";
import ReactDOM = require("react-dom");
import { DataSource } from "maishu-wuzhui";
import { FormValidator, ValidateField, Rule } from "maishu-dilu";
import { InputControl, InputControlProps } from "./inputs/input-control";

type BeforeSave<T> = (dataItem: T) => Promise<any>

export interface ValidateDataField {
    validateRules?: Rule[]
}

export let ItemDialogContext = React.createContext({
    controlCreated: null as (ctrl: InputControl<any, any>) => void
});


export interface Dialog<T> {
    show: (args: T) => void
}

export function createItemDialog<T>
    (dataSource: DataSource<T>, name: string, child: React.ReactElement, beforeSave?: BeforeSave<T>): Dialog<T> {

    class ItemDialog extends React.Component<{}, { title?: string }> {

        private static instance: ItemDialog;
        private dialogElement: HTMLElement;

        private validator: FormValidator;
        private beforeSaves: BeforeSave<T>[];
        private fieldsConatiner: HTMLElement;

        private inputControls: InputControl<any>[];
        private dataItem: T;

        constructor(props: ItemDialog["props"]) {
            super(props);
            this.state = {};

            this.beforeSaves = [];
            this.inputControls = [];
        }

        private async onSaveButtonClick() {
            this.validator.clearErrors()
            if (!this.validator.check()) {
                return Promise.reject('validate fail')
            }

            await this.save();
            hideDialog(this.dialogElement);
        }

        setDataItem(dataItem: T) {
            this.dataItem = dataItem;
            let primaryValues = dataSource.primaryKeys;
            let title = primaryValues.length > 0 ? `修改${name}` : `添加${name}`;

            this.inputControls.forEach(c => {
                let value = dataItem[c.props.dataField];
                c.value = value;
            })

            this.setState({ title })
        }

        async save() {
            let dataItem = this.dataItem;
            this.inputControls.forEach(c => {
                dataItem[c.props.dataField] = c.value;
            })

            if (beforeSave) {
                await beforeSave(dataItem);
            }

            if (this.beforeSaves.length > 0) {
                await Promise.all(this.beforeSaves.map(m => m(dataItem)));
            }

            let primaryValues = dataSource.primaryKeys.map(o => dataItem[o]).filter(v => v != null);
            if (primaryValues.length > 0) {
                await dataSource.update(dataItem);
            }
            else {
                await dataSource.insert(dataItem);
            }
        }

        childrenToArray(children: any): React.ReactElement[] {
            let r = Array.isArray(children) ? children : [children];
            r = r.filter(o => o);
            return r;
        }

        controlCreated(ctrl: InputControl<any>) {
            let exists = this.inputControls.filter(o => o.id == ctrl.id).length > 0;
            if (exists)
                return;

            this.inputControls.push(ctrl);
        }

        componentDidMount() {
            let ctrls = this.inputControls;
            let validateFields = ctrls.filter(o => o.props.validateRules).map(o => ({ name: o.props.dataField as string, rules: o.props.validateRules }));
            this.validator = new FormValidator(this.fieldsConatiner, ...validateFields);
        }

        render() {
            let { title } = this.state;
            return <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                        <h4 className="modal-title">{title}</h4>
                    </div>
                    <div className="modal-body well" style={{ paddingLeft: 20, paddingRight: 20 }}
                        ref={e => this.fieldsConatiner = e || this.fieldsConatiner}>
                        <ItemDialogContext.Provider value={{ controlCreated: (ctrl) => this.controlCreated(ctrl) }}>
                            {child}
                        </ItemDialogContext.Provider>
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-default" onClick={e => { hideDialog(this.dialogElement) }}>
                            <i className="icon-reply" />
                            <span>取消</span>
                        </button>
                        <button className="btn btn-primary" onClick={() => this.onSaveButtonClick()}>
                            <i className="icon-save" />
                            <span>确定</span>
                        </button>
                    </div>
                </div>
            </div>
        }

        static show(dataItem?: T) {
            dataItem = dataItem || {} as T;
            if (!ItemDialog.instance) {
                let dialogElement = document.createElement("div");
                dialogElement.className = "modal fade-in";
                document.body.appendChild(dialogElement);
                ItemDialog.instance = ReactDOM.render(<ItemDialog />, dialogElement) as any;
                ItemDialog.instance.dialogElement = dialogElement;
            }

            if (ItemDialog.instance.validator)
                ItemDialog.instance.validator.clearErrors();

            ItemDialog.instance.setDataItem(dataItem);
            showDialog(ItemDialog.instance.dialogElement);
        }
    }

    return ItemDialog;
}

export interface ValidateDataField {
    validateRules?: Rule[]
}

// export let ItemDialogContext = React.createContext({
//     controlCreated: null as (ctrl: InputControl<any>) => void
// });
