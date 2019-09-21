import React = require("react");
import { hideDialog, showDialog } from "maishu-ui-toolkit";
import ReactDOM = require("react-dom");
import { ItemPageContext } from "./item-page";
import { DataSource } from "maishu-wuzhui";
import { FormValidator, ValidateField, Rule } from "maishu-dilu";

type BeforeSave<T> = (dataItem: T) => Promise<any>

export interface ValidateDataField {
    validateRules?: Rule[]
}

export function createItemDialog<T extends { id: string }>
    (dataSource: DataSource<T>, name: string, child: React.ReactElement, beforeSave?: BeforeSave<T>): { show: (args: T) => void } {

    class ItemDialog extends React.Component<{ dataItem: T }, { dataItem: T }> {

        private static instance: ItemDialog;
        private dialogElement: HTMLElement;

        private validator: FormValidator;
        private beforeSaves: BeforeSave<T>[];
        private fieldsConatiner: HTMLElement;

        constructor(props: ItemDialog["props"]) {
            super(props);
            this.state = { dataItem: props.dataItem };

            this.beforeSaves = [];
        }

        private async onSaveButtonClick(dataItem: T) {
            this.validator.clearErrors()
            if (!this.validator.check()) {
                return Promise.reject('validate fail')
            }

            await this.save(dataItem);
            hideDialog(this.dialogElement);
        }

        async save(dataItem: T) {
            if (beforeSave) {
                await beforeSave(dataItem);
            }

            if (this.beforeSaves.length > 0) {
                await Promise.all(this.beforeSaves.map(m => m(dataItem)));
            }

            if (dataItem.id) {
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

        componentDidMount() {
            let nodes: React.ReactElement[] = this.childrenToArray(child.props.children) //Array.isArray(child.props.children) ? child.props.children : [child.props.children];
            var validateFields: ValidateField[] = []

            let stack: React.ReactElement[] = [...nodes];
            while (stack.length > 0) {
                let item = stack.pop();

                if (!item.props)
                    continue;

                let props = item.props as ValidateDataField & { dataField: string, name: string };
                if (props.validateRules != null) {
                    let f: ValidateField = { name: props.name || props.dataField, rules: props.validateRules || [] };
                    validateFields.push(f);
                }

                let children = this.childrenToArray(item.props.children);
                stack.push(...children);
            }

            this.validator = new FormValidator(this.fieldsConatiner, ...validateFields)
        }

        render() {
            let { dataItem } = this.state;
            return <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                        <h4 className="modal-title">{dataItem.id ? `修改${name}` : `添加${name}`}</h4>
                    </div>
                    <div className="modal-body well" style={{ paddingLeft: 20, paddingRight: 20 }}
                        ref={e => this.fieldsConatiner = e || this.fieldsConatiner}>
                        <ItemPageContext.Provider value={{
                            dataItem: dataItem,
                            updatePageState: (dataItem) => {
                                this.setState({ dataItem })
                            },
                            beforeSave: (callback: BeforeSave<T>) => {
                                this.beforeSaves.push(callback);
                            }
                        }}>
                            {child}
                        </ItemPageContext.Provider>

                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-default" onClick={e => { hideDialog(this.dialogElement) }}>
                            <i className="icon-reply" />
                            <span>取消</span>
                        </button>
                        <button className="btn btn-primary" onClick={() => this.onSaveButtonClick(dataItem)}>
                            <i className="icon-save" />
                            <span>确定</span>
                        </button>
                    </div>
                </div>
            </div>
        }

        static show(dataItem: T) {
            if (!ItemDialog.instance) {
                let dialogElement = document.createElement("div");
                dialogElement.className = "modal fade-in";
                document.body.appendChild(dialogElement);
                ItemDialog.instance = ReactDOM.render(<ItemDialog dataItem={dataItem} />, dialogElement) as any;
                ItemDialog.instance.dialogElement = dialogElement;
            }

            ItemDialog.instance.validator.clearErrors();
            ItemDialog.instance.setState({ dataItem: dataItem });
            showDialog(ItemDialog.instance.dialogElement);
        }
    }

    return ItemDialog;
}