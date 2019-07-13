import React = require("react");
import { ValidateDataField } from "assert/index";
import { ItemPageContext } from "../index";

interface InputFieldProps<T> {
    dataField: keyof T, label: string, name?: string,
    placeholder?: string, type?: 'text' | 'password',
}

export class TextInput<T> extends React.Component<InputFieldProps<T> & ValidateDataField> {
    input: HTMLInputElement;
    constructor(props) {
        super(props)

        this.state = { dataItem: {} }
    }
    get value() {
        return this.input.value
    }
    render() {
        let { dataField, label, name, placeholder } = this.props
        return <ItemPageContext.Consumer>
            {args => {
                let dataItem = args.dataItem || {}
                return <div className="input-control">
                    <label>{label}</label>
                    <span>
                        <input name={name || dataField as string} className="form-control"
                            placeholder={placeholder} type={this.props.type}
                            ref={e => {
                                if (!e) return
                                this.input = e
                                e.value = dataItem[dataField] || ''
                                e.onchange = () => {
                                    dataItem[dataField] = e.value
                                }
                            }} />
                    </span>
                </div>
            }}
        </ItemPageContext.Consumer>
    }
}

export function textbox<T>(args: {
    element: HTMLInputElement, dataItem: T, dataField: Extract<keyof T, string>, name: string,
    toInputValue?: (fieldValue: any) => string,
    fromInputValue?: (value: string) => any,
}) {
    let { element, dataField, name, dataItem } = args;
    element.name = name || dataField;

    let convertToValue = args.toInputValue || function (fieldValue: any) {
        if (!fieldValue)
            return "";

        return `${fieldValue}`
    }

    let convertFromValue = args.fromInputValue || function (value: string): any {
        if (!value)
            return null;

        return value;
    }

    element.value = convertToValue(dataItem[dataField])
    element.onchange = () => {
        dataItem[dataField] = convertFromValue(element.value);
    }
}
