import React = require("react");
import { ItemPageContext } from "../item-page";
import { checkboxList } from "maishu-wuzhui-helper";
import { DataSource } from "maishu-wuzhui";
import { ValidateDataField } from "assert/index";

interface CheckboxListFieldProps<T> {
    dataField: keyof T, label: string,
    dataType: 'string' | 'number',
    defaultValue?: string | number,
    dataSource: DataSource<T>,
    nameField: keyof T,
    valueField: keyof T,
}

export class CheckboxListInput<T> extends React.Component<CheckboxListFieldProps<T> & ValidateDataField, { value?: string }>{
    constructor(props: CheckboxListInput<T>['props']) {
        super(props)
        this.state = {}
    }
    render() {
        let { dataField, label, dataSource, nameField, valueField } = this.props
        return <ItemPageContext.Consumer>
            {args => {
                let dataItem = args.dataItem || {}
                dataItem[dataField] = dataItem[dataField] || this.props.defaultValue
                return <div className="item">
                    <label>{label}</label>
                    <span>
                        <div ref={e => {
                            if (!e) return;
                            checkboxList<T>({
                                element: e,
                                dataSource: dataSource,
                                dataField: dataField,
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
