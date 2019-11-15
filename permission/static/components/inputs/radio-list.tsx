import { DataSource } from "maishu-wuzhui"
import React = require("react")
import { InputControl } from "./input-control";
import { rules } from "maishu-dilu";

interface RadioFieldProps<T, S> {
    dataField: keyof T,
    dataType: 'string' | 'number',
    defaultValue?: string | number,
    dataSource: DataSource<S>,
    nameField: Extract<keyof S, string>,
    valueField: Extract<keyof S, string>,
}

interface RadioFieldState {
    items: { text: any, value: any }[],
    value?: any
}

export class RadioListInput<T, S> extends InputControl<T, RadioFieldProps<T, S>, RadioFieldState>{

    constructor(props: RadioListInput<T, S>['props']) {
        super(props)
        this.state = { items: [], value: this.props.defaultValue }
    }

    set value(value: any) {
        this.setState({ value });
    }
    get value(): any {
        return this.state.value;
    }

    componentDidMount() {
        let { nameField, valueField } = this.props;
        this.props.dataSource.executeSelect().then(r => {
            let items = r.dataItems.map(o => ({ text: o[nameField], value: o[valueField] }));
            this.setState({ items });
        })
    }

    render() {
        let { dataField, dataType } = this.props;
        let { items } = this.state;
        return <div>
            {items.map(o => <>
                <input name={dataField as string} type="radion" value={o.value} checked={this.value == o.value}
                    onChange={e => {
                        if (dataType == "number" && !rules.numeric().validate(e.target))
                            return;

                        let value = dataType == "number" ? parseFloat(e.target.value) : e.target.value;
                        this.setState({ value });
                    }} />
                <span>{o.text}</span>
            </>)}
        </div>
    }
}
