import React = require("react");
import { Rule } from "maishu-dilu";
import { NameValue } from "../common";
import { ItemPageContext } from "../item-page";

interface DropdownFieldProps<T> {
    dataField: keyof T, label: string, name?: string,
    placeholder?: string,
    items: () => Promise<NameValue[]>,
    validateRules?: Rule[],
    onChange?: (value: string, dataItem: T) => void
}

interface DropdownFieldState {
    // items: { name: string, value: string }[]
}

export class DropdownField<T> extends React.Component<DropdownFieldProps<T>, DropdownFieldState> {
    constructor(props: DropdownField<T>['props']) {
        super(props)

        this.state = { items: [] }
    }
    componentDidMount() {

    }
    render() {
        let { dataField, label, name, placeholder } = this.props
        return <ItemPageContext.Consumer>
            {args => {
                let dataItem = args.dataItem || {}
                return <div className="item">
                    <label>{label}</label>
                    <span>
                        <select name={name || dataField as string} className="form-control"
                            ref={e => {
                                if (!e) return
                                e.value = dataItem[dataField] || ''
                                e.onchange = () => {
                                    dataItem[dataField] = e.value
                                    if (this.props.onChange) {
                                        this.props.onChange(e.value, dataItem)
                                    }

                                    args.updatePageState(dataItem)
                                }

                                this.props.items().then(items => {
                                    items.forEach(item => {
                                        let optionElement = document.createElement('option');
                                        optionElement.value = item.value;
                                        optionElement.innerHTML = item.name;
                                        e.options.add(optionElement);
                                        return optionElement;
                                    })
                                })

                            }} >
                            {placeholder ? <option value="">{placeholder}</option> : null}
                        </select>
                    </span>
                </div>
            }}
        </ItemPageContext.Consumer>
    }
}
