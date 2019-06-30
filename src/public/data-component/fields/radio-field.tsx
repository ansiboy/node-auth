import React = require("react");
import { errors } from "../errors";
import { ItemPageContext } from "../item-page";
import { radioList } from "maishu-wuzhui-helper";
import { DataSource } from "maishu-wuzhui";

interface RadioFieldProps {
    dataField: string, label: string, name?: string,
    dataType: 'string' | 'number',
    items: { name: string, value: string | number }[], //{[value: string]: string },
    defaultValue?: string | number
}

export class RadioField extends React.Component<RadioFieldProps, { value?: string }>{
    constructor(props: RadioField['props']) {
        super(props)
        this.state = {}
    }
    render() {
        let { dataField, name, label, items: values } = this.props
        return <ItemPageContext.Consumer>
            {args => {
                let dataItem = args.dataItem || {}
                dataItem[dataField] = dataItem[dataField] || this.props.defaultValue
                let value = this.state.value || dataItem[dataField]
                return <div className="item">
                    <label>{label}</label>
                    <span>
                        {values.map((o, i) =>
                            <label key={i} className="radio-inline">
                                <input type="radio" name={name || dataField} value={o.value} checked={o.value == value}
                                    onChange={e => {
                                        if (this.props.dataType == 'number') {
                                            dataItem[dataField] = /^-?\\d+$/.test(e.target.value) ? Number.parseInt(e.target.value) : Number.parseFloat(e.target.value)
                                        }
                                        else if (this.props.dataType == 'string') {
                                            dataItem[dataField] = e.target.value
                                        }
                                        else {
                                            throw errors.notImplement()
                                        }
                                        value = e.target.value
                                        this.setState({ value })
                                    }} />
                                {o.name}
                            </label>
                        )}
                    </span>
                </div>
            }}
        </ItemPageContext.Consumer>
    }
}

interface RadioFieldProps1<T> {
    dataField: string, label: string,
    dataType: 'string' | 'number',
    defaultValue?: string | number,
    dataSource: DataSource<T>,
    nameField: keyof T,
    valueField: keyof T,
}

export class RadioField1<T> extends React.Component<RadioFieldProps1<T>, { value?: string }>{
    constructor(props: RadioField1<T>['props']) {
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
                    <span ref={e => {
                        if (!e) return;
                        radioList<T>({
                            element: e,
                            dataSource: dataSource,
                            dataField: dataField as string,
                            nameField: nameField,
                            valueField: valueField,
                            dataItem: dataItem
                        })
                    }}>

                    </span>
                </div>
            }}
        </ItemPageContext.Consumer>
    }
}
