import React = require("react");
import { radioList } from "maishu-wuzhui-helper";
import { DataSource } from "maishu-wuzhui";
import { ItemPageContext, ValidateDataField } from "assert/index";

interface RadioFieldProps<T, S> {
    dataField: Extract<keyof T, string>, label: string,
    dataType: 'string' | 'number',
    defaultValue?: string | number,
    dataSource: DataSource<S>,
    nameField: Extract<keyof S, string>,
    valueField: Extract<keyof S, string>,
}

export class RadioListInput<T, S> extends React.Component<RadioFieldProps<T, S> & ValidateDataField, { value?: string }>{
    constructor(props: RadioListInput<T, S>['props']) {
        super(props)
        this.state = {}
    }
    render() {
        let { dataField, label, dataSource, nameField, valueField } = this.props
        return <ItemPageContext.Consumer>
            {args => {
                let dataItem = args.dataItem || {}
                dataItem[dataField] = dataItem[dataField] || this.props.defaultValue
                return <div className="input-control">
                    <label>{label}</label>
                    <span>
                        <div ref={e => {
                            if (!e) return;
                            radioList<S>({
                                element: e,
                                dataSource: dataSource,
                                dataField: dataField as string,
                                nameField: nameField,
                                valueField: valueField,
                                dataItem: dataItem
                            })
                        }}>
                        </div>
                        <div className={`validationMessage ${dataField}`} style={{ display: "none" }} >请选择用户角色</div>

                    </span>
                </div>
            }}
        </ItemPageContext.Consumer>
    }
}
